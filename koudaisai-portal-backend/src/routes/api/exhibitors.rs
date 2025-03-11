use crate::entities::{
    exhibitors_category_booth, exhibitors_category_general, exhibitors_category_labo,
    exhibitors_category_stage, exhibitors_root, sea_orm_active_enums, users,
};
use crate::middlewares::CurrentUser;
use crate::routes::AppState;
use crate::util::sha::stretch_with_salt;
use crate::util::AppError;
use axum::extract::{ConnectInfo, State};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Extension, Json, Router};
use http::StatusCode;
use migration::SubQueryStatement;
use sea_orm::ColumnTrait;
use sea_orm::{ActiveModelTrait, ActiveValue, EntityTrait, QueryFilter, TransactionTrait};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use std::sync::Arc;
use tracing::{instrument, warn};
use uuid::Uuid;

#[instrument(name = "init /api/v1/exhibitors")]
pub fn init_router() -> Router<Arc<AppState>> {
    Router::new().route("/", post(post_exhibitors))
}

#[derive(Deserialize, Debug)]
struct PostExhibitorsPayload {
    id: String,
    exhibitor_name: String,
    #[serde(rename = "type")]
    r#type: ExhibitionType,
    representatives: (
        RepresentativeWrite,
        RepresentativeWrite,
        RepresentativeWrite,
    ),
}
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "snake_case")]
enum ExhibitionType {
    Booth,
    General,
    Stage,
    Labo,
}
impl ExhibitionType {
    fn into_sea_orm(self) -> sea_orm_active_enums::ExhibitionType {
        match self {
            Self::Booth => sea_orm_active_enums::ExhibitionType::Booth,
            Self::General => sea_orm_active_enums::ExhibitionType::General,
            Self::Stage => sea_orm_active_enums::ExhibitionType::Stage,
            Self::Labo => sea_orm_active_enums::ExhibitionType::Labo,
        }
    }
}
#[derive(Deserialize, Debug)]
struct RepresentativeWrite {
    first_name: String,
    last_name: String,
    m_address: String,
}
type PostExhibitorsResponse = (String, String, String);
#[instrument(name = "POST /api/v1/exhibitors", skip(state))]
#[axum::debug_handler]
async fn post_exhibitors(
    ConnectInfo(_addr): ConnectInfo<SocketAddr>,
    State(state): State<Arc<AppState>>,
    Extension(current_user): Extension<CurrentUser>,
    Json(payload): Json<PostExhibitorsPayload>,
) -> Result<(StatusCode, Response), AppError> {
    match current_user {
        CurrentUser::Admin(_) => {}
        _ => return Ok((StatusCode::FORBIDDEN, "Access forbidden.".into_response())),
    };

    // conflict check
    if let Some(_) = exhibitors_root::Entity::find_by_id(payload.id.clone())
        .one(&state.db_conn)
        .await?
    {
        return Ok((StatusCode::CONFLICT, "Conflict.".into_response()));
    }
    if let Some(_) = users::Entity::find()
        .filter(users::Column::MAddress.eq(payload.representatives.0.m_address.clone()))
        .one(&state.db_conn)
        .await?
    {
        return Ok((StatusCode::CONFLICT, "Conflict.".into_response()));
    }

    // transaction
    let txn = state.db_conn.begin().await?;

    // exhibitors_root
    exhibitors_root::ActiveModel {
        id: ActiveValue::Set(payload.id.clone()),
        created_at: ActiveValue::NotSet,
        updated_at: ActiveValue::NotSet,
        exhibitor_name: ActiveValue::Set(payload.exhibitor_name.clone()),
        r#type: ActiveValue::Set(payload.r#type.clone().into_sea_orm()),
        exhibition_name: ActiveValue::NotSet,
        icon_id: ActiveValue::NotSet,
        description: ActiveValue::NotSet,
        representative1: ActiveValue::NotSet,
        representative2: ActiveValue::NotSet,
        representative3: ActiveValue::NotSet,
    }
    .insert(&txn)
    .await?;

    //exhibitors_category_...
    match payload.r#type {
        ExhibitionType::Booth => {
            exhibitors_category_booth::ActiveModel {
                id: ActiveValue::Set(payload.id.clone()),
                location: ActiveValue::NotSet,
                starting_time_day1: ActiveValue::NotSet,
                ending_time_day1: ActiveValue::NotSet,
                starting_time_day2: ActiveValue::NotSet,
                ending_time_day2: ActiveValue::NotSet,
            }
            .insert(&txn)
            .await?;
        }
        ExhibitionType::General => {
            exhibitors_category_general::ActiveModel {
                id: ActiveValue::Set(payload.id.clone()),
                location: ActiveValue::NotSet,
                starting_time_day1: ActiveValue::NotSet,
                ending_time_day1: ActiveValue::NotSet,
                starting_time_day2: ActiveValue::NotSet,
                ending_time_day2: ActiveValue::NotSet,
            }
            .insert(&txn)
            .await?;
        }
        ExhibitionType::Stage => {
            exhibitors_category_stage::ActiveModel {
                id: ActiveValue::Set(payload.id.clone()),
                r#type: Default::default(),
            }
            .insert(&txn)
            .await?;
        }
        ExhibitionType::Labo => {
            exhibitors_category_labo::ActiveModel {
                id: ActiveValue::Set(payload.id.clone()),
                location: ActiveValue::NotSet,
                starting_time_day1: ActiveValue::NotSet,
                ending_time_day1: ActiveValue::NotSet,
                starting_time_day2: ActiveValue::NotSet,
                ending_time_day2: ActiveValue::NotSet,
            }
            .insert(&txn)
            .await?;
        }
    }

    //users
    new_user_model(&payload.representatives.0, payload.id.clone())
        .insert(&txn)
        .await?;
    new_user_model(&payload.representatives.1, payload.id.clone())
        .insert(&txn)
        .await?;
    new_user_model(&payload.representatives.2, payload.id.clone())
        .insert(&txn)
        .await?;

    //commit
    txn.commit().await?;

    //generate activation tokens
    let activation_tokens: PostExhibitorsResponse = (
        stretch_with_salt(
            payload.representatives.0.m_address.as_str(),
            state.web.auth.activation_salt.as_str(),
            2_i32.pow(state.web.auth.stretch_cost as u32),
        )
        .await,
        stretch_with_salt(
            payload.representatives.1.m_address.as_str(),
            state.web.auth.activation_salt.as_str(),
            2_i32.pow(state.web.auth.stretch_cost as u32),
        )
        .await,
        stretch_with_salt(
            payload.representatives.2.m_address.as_str(),
            state.web.auth.activation_salt.as_str(),
            2_i32.pow(state.web.auth.stretch_cost as u32),
        )
        .await,
    );

    Ok((StatusCode::CREATED, Json(activation_tokens).into_response()))
}

fn new_user_model(
    representative: &RepresentativeWrite,
    exhibition_id: String,
) -> users::ActiveModel {
    users::ActiveModel {
        id: ActiveValue::Set(Uuid::new_v4()),
        created_at: ActiveValue::NotSet,
        updated_at: ActiveValue::NotSet,
        first_name: ActiveValue::Set(representative.first_name.clone()),
        last_name: ActiveValue::Set(representative.first_name.clone()),
        m_address: ActiveValue::Set(representative.first_name.clone()),
        password_hash: ActiveValue::NotSet,
        password_salt: ActiveValue::NotSet,
        exhibition_id: ActiveValue::Set(exhibition_id),
    }
}
