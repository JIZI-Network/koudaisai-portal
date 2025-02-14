//! `SeaORM` Entity, @generated by sea-orm-codegen 1.1.4

use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "users")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Uuid,
    pub created_at: Option<DateTimeWithTimeZone>,
    pub updated_at: Option<DateTimeWithTimeZone>,
    #[sea_orm(column_type = "Text")]
    pub first_name: String,
    #[sea_orm(column_type = "Text")]
    pub last_name: String,
    #[sea_orm(column_type = "Text")]
    pub m_address: String,
    #[sea_orm(column_type = "Text")]
    pub password_hash: String,
    #[sea_orm(column_type = "Text")]
    pub exhibition_id: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::exhibitors_root::Entity",
        from = "Column::ExhibitionId",
        to = "super::exhibitors_root::Column::Id",
        on_update = "NoAction",
        on_delete = "NoAction"
    )]
    ExhibitorsRoot,
}

impl Related<super::exhibitors_root::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::ExhibitorsRoot.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
