use crate::database::{Crudable, find_first_by_param};
use crate::database::entities::item_produto::ItemProduto;
use async_trait::async_trait;
use mongodb::bson::oid::ObjectId;
use mongodb::bson::Bson;
use mongodb::{ bson::doc,  Database};
use serde::{Deserialize, Serialize};




#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ItemPedido {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub pedido_id: ObjectId,
    pub item_produto_id: ObjectId,
    pub quantidade: i32,
    pub desconto: f64
    
}
impl ItemPedido {
    pub async fn new(
        id: ObjectId,
        pedido_id: ObjectId,
        item_produto_id: ObjectId,
        quantidade: i32,
        desconto: f64
    ) -> Self {
        
        ItemPedido {
            id,
            pedido_id,
            item_produto_id,
            quantidade,
            desconto
        }

        
    }
    pub async fn preco(&self, db: &Database) -> Result<f64, String> {
        let item_produto = find_first_by_param::<ItemProduto>("_id", Bson::String(self.item_produto_id.to_hex()), db).await?;
        Ok(item_produto.preco_venda)
    }
    pub async fn total(&self, db: &Database) -> Result<f64, String> {
        let preco = self.preco(db).await?;
        Ok((preco - self.desconto) * self.quantidade as f64)
    }
    
}
#[async_trait]
impl Crudable for ItemPedido {
    fn collection_name() -> &'static str {
        "itens_pedidos"
    }
    fn id(&self) -> String {
        self.id.to_hex()
    }

}