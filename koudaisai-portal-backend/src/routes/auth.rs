use crate::config::Web;
use crate::entities::prelude::Users;
use crate::entities::users;
use crate::routes;
use crate::routes::AppState;
use crate::util::{digest, stretch};
use axum::body::Body;
use axum::extract::State;
use axum::handler::Handler;
use axum::http::StatusCode;
use axum::response::Response;
use axum::routing::post;
use axum::{Json, Router};
use sea_orm::ActiveValue::Set;
use sea_orm::{ActiveModelTrait, EntityTrait};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tracing::{debug, instrument, trace, warn};
use uuid::Uuid;

#[instrument(name = "init /auth")]
pub fn init_router(state: Arc<AppState>) -> Router<Arc<AppState>> {
    Router::new()
        .route("/v1/activate", post(activate))
        .with_state(Arc::clone(&state))
}

#[derive(Serialize, Deserialize)]
struct ActivatePayload {
    uuid: Uuid,
    token: String,
    password: String,
}
#[instrument(name = "/auth/v1/activate", fields(payload.uuid = %payload.uuid), skip(payload, state))]
async fn activate(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<ActivatePayload>,
) -> StatusCode {
    let hash = stretch(
        payload.uuid.to_string().as_str(),
        state.web.auth.activation_salt.as_str(),
        2_i32.pow(state.web.auth.stretch_cost as u32) as u32,
    ).await;

    debug!(hash);
    if payload.token == hash {
        let user = match Users::find_by_id(payload.uuid).one(&state.db_conn).await {
            Ok(Some(user)) => user,
            Ok(None) => return StatusCode::NOT_FOUND,
            Err(err) => {
                warn!("internal server error occurred while finding user: {}", err);
                return StatusCode::INTERNAL_SERVER_ERROR;
            }
        };

        //すでに有効化されているかどうかを確認
        if user.password_hash.is_some() {
            debug!("409 Conflict");
            return StatusCode::CONFLICT;
        }

        let mut user: users::ActiveModel = user.into();

        user.password_hash = Set(Some(
            stretch(
                payload.password.to_string().as_str(),
                state.web.auth.activation_salt.as_str(),
                2_i32.pow(state.web.auth.stretch_cost as u32) as u32,
            )
            .await,
        ));
        match user.update(&state.db_conn).await {
            Ok(_) => StatusCode::OK,
            Err(err) => {
                warn!("internal server error occurred while updating user: {}", err);
                StatusCode::INTERNAL_SERVER_ERROR
            }
        }
    } else {
        debug!("401 Unauthorized");
        StatusCode::UNAUTHORIZED
    }
}
