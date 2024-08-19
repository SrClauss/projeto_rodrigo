use crate::database::traits::crudable::Crudable;
use async_trait::async_trait;
use mongodb::bson::oid::ObjectId;
use mongodb::bson::DateTime;
use serde::{Deserialize, Serialize};

use super::item_pedido::ItemPedido;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Pedido{

    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub cliente_id: ObjectId,
    pub data: DateTime,
    pub status: StatusPedido,
    pub itens: Vec<ItemPedido>,
    
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum StatusPedido {
    Aberto,
    Fechado,
    Cancelado,
}


impl Pedido {
    pub fn new(
   
        cliente_id: ObjectId,
        data: DateTime,
        status: StatusPedido,
        itens: Option<Vec<ItemPedido>>
    ) -> Self {
        Pedido {
            id : ObjectId::new(),
            cliente_id,
            data,
            status,
            itens: itens.unwrap_or(vec![]),
        }
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