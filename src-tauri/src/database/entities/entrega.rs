use crate::database::traits::crudable::Crudable;
use async_trait::async_trait;
use mongodb::bson::oid::ObjectId;
use mongodb::bson::DateTime;
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


}
