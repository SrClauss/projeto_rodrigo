use crate::database::{find_all_by_param, Crudable};
use crate::database::entities::item_produto::ItemProduto;
use async_trait::async_trait;
use mongodb::bson::oid::ObjectId;
use mongodb::{ bson::doc, Database};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]

pub struct Produto {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub nome: String,
    pub descricao: String,
    pub categoria_id: Option<ObjectId>,
}

impl Produto {
    pub fn new(
        id: ObjectId,
        nome: String,
        descricao: String,
        categoria_id: ObjectId,
    ) -> Result<Self, String> {
        Ok(Produto {
            id,
            nome,
            descricao,
            categoria_id: Option::Some(categoria_id),
        })
    }
    pub async fn get_estoque(&self, db: &Database) -> Result<i32, String> {
        let result = find_all_by_param::<ItemProduto>("produto_id", self.id.to_hex().as_str().into(), db)
            .await;


        match result {
            Err(e) => return Err(e),
            Ok(result) => {
                let mut total = 0;
                for item in result {
                    total += item.quantidade;
                }
                Ok(total)
            }
            
        }
  
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