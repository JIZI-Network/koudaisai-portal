//! `SeaORM` Entity, @generated by sea-orm-codegen 1.1.4

use super::sea_orm_active_enums::StageType;
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "exhibitors_category_stage")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: String,
    pub r#type: Option<StageType>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::exhibitors_root::Entity",
        from = "Column::Id",
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
