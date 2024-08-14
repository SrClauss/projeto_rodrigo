use crate::database::{Crudable, Privilege};
use async_trait::async_trait;
use mongodb::bson::oid::ObjectId;
use mongodb::bson::DateTime;
use mongodb::{ bson::doc, Database};
use serde::{Deserialize, Serialize};



#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Entrega {
    #[serde(rename = "_id")]
    pub id: Option<ObjectId>,
    pub id_pedido: ObjectId,
    pub data_entrega: DateTime,
    pub endereco_entrega: ObjectId,
    pub status: String,
    pub frete: f64,
}

impl Entrega {
    pub fn new(id_pedido: ObjectId, data_entrega: DateTime, endereco_entrega: ObjectId, status: String, frete: f64) -> Self {
        Entrega {
            id: None,
            id_pedido,
            data_entrega,
            endereco_entrega,
            status,
            frete,
        }
    }
}



#[async_trait]
impl Crudable for Entrega {
    fn collection_name() -> &'static str {
        "entregas"
    }

    fn id(&self) -> String {
        self.id.unwrap().to_hex()
    }

    async fn create(self, db: &Database, privilege: Privilege) -> Result<Entrega, String> {
        Crudable::create(self, db, privilege).await
    }

    async fn read(id: &str, db: &Database) -> Result<Entrega, String> {
        Crudable::read(id, db).await
    }

    async fn update(self, id: &str, db: &Database, privilege: Privilege) -> Result<Entrega, String> {
        Crudable::update(self, id, db, privilege).await
    }

    async fn delete(self, db: &Database, privilege: Privilege) -> Result<Entrega, String> {
        Crudable::delete(self, db, privilege).await
    }
}
