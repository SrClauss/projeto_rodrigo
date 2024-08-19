use crate::database::traits::crudable::Crudable;
use crate::database::entities::item_produto::ItemProduto;
use async_trait::async_trait;
use mongodb::bson::oid::ObjectId;
use mongodb::bson::doc;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]

pub struct Produto {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub nome: String,
    pub descricao: String,
    pub categoria_id: ObjectId,
    pub itens: Vec<ItemProduto>,

}

impl Produto {
    pub fn new(

        nome: String,
        descricao: String,
        categoria_id: ObjectId,
        itens: Option<Vec<ItemProduto>>,
    ) -> Result<Self, String> {
        Ok(Produto {
            id: ObjectId::new(),
            nome,
            descricao,
            categoria_id,
            itens: itens.unwrap_or(vec![]),
        })
    }
 
   pub async fn add_item(&mut self, item: ItemProduto) {
        self.itens.push(item);
        
    }
    pub fn produtos_ids(&self) -> Vec<ObjectId> {
        self.itens.iter().map(|item| item.id).collect()
    }

   
}

#[async_trait]
impl Crudable for Produto{
    fn collection_name() -> &'static str {
        "produtos"
    }
    fn id(&self) -> String {
        self.id.to_hex()
    }

}