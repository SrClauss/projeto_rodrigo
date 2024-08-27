use mongodb::bson::oid::ObjectId;
use mongodb::bson::doc;
use serde::{Deserialize, Serialize};




#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ItemPedido {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub item_produto_id: ObjectId,
    pub quantidade: i32,
    pub desconto: f64
    
}
impl ItemPedido {
    pub async fn new(
     
        item_produto_id: ObjectId,
        quantidade: i32,
        desconto: f64
    ) -> Self {
        
        ItemPedido {
            id:ObjectId::new(),
            item_produto_id,
            quantidade,
            desconto
        }

        
    }
   
    
    
}
