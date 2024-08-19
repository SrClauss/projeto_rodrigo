use mongodb::bson::oid::ObjectId;
use mongodb::bson::doc;
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
   
    
    
}
