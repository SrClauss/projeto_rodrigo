use crate::database::{Crudable,find_all_by_param};
use crate::database::entities::item_pedido::ItemPedido;
use async_trait::async_trait;
use mongodb::bson::oid::ObjectId;
use mongodb::bson::DateTime;
use mongodb::{bson::doc, Database};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Pedido{

    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub cliente_id: ObjectId,
    pub data: DateTime,
    pub status: StatusPedido,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum StatusPedido {
    Aberto,
    Fechado,
    Cancelado,
}


impl Pedido {
    pub fn new(
        id: ObjectId,
        cliente_id: ObjectId,
        data: DateTime,
        status: StatusPedido,
    ) -> Self {
        Pedido {
            id,
            cliente_id,
            data,
            status,
        }
    }

    pub async fn total(&self, db: &Database) -> Result<f64, String> {
        let itens = find_all_by_param::<ItemPedido>("pedido_id", (&self.id.to_hex()).into(), db).await?;
        let mut total = 0.0;
        for item in itens {
            total += item.total(db).await?;
        }
        Ok(total)
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