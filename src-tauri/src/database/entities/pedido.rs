use crate::database::traits::crudable::Crudable;
use async_trait::async_trait;
use mongodb::bson::oid::ObjectId;
use mongodb::bson::doc;
use serde::{Deserialize, Serialize};


#[derive(Debug, Serialize, Deserialize, Clone)]

pub struct Pedido {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub cliente_id: ObjectId,
    pub produto: ObjectId,
    pub quantidade: f64,
    pub data: String,
    pub entrega: Option<String>,

}

impl Pedido {
    pub fn new(
        cliente_id: ObjectId,
        produto: ObjectId,
        quantidade: f64,
        data: String,
        entrega: Option<String>
        
    ) -> Result<Self, String> {
        Ok(Pedido {
            id: ObjectId::new(),
            cliente_id,
            produto,
            quantidade,
            data,
            entrega,
       
        })
    }
}


#[async_trait]
impl Crudable for Pedido{
    fn collection_name() -> &'static str {
        "pedidos"
    }
    fn id(&self) -> String {
        self.id.to_hex()
    }

}

