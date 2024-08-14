use crate::database::Crudable;
use async_trait::async_trait;
use mongodb::bson::oid::ObjectId;
use mongodb::bson::DateTime;
use mongodb::bson::doc;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ItemProduto {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub produto_id: ObjectId,
    pub fornecedor_id: ObjectId,
    pub quantidade: i32,
    pub preco_compra: f64,
    pub preco_venda: f64,
    pub lote: Option<String>,
    pub data_fabricacao: DateTime,
    pub data_validade: DateTime,
}


impl ItemProduto {
    pub fn new(
        id: ObjectId,
        produto_id: ObjectId,
        fornecedor_id: ObjectId,
        quantidade: i32,
        preco_compra: f64,
        preco_venda: f64,
        lote: Option<String>,
        data_fabricacao: DateTime,
        data_validade: DateTime,
    ) -> Self {
        ItemProduto {
            id,
            produto_id,
            fornecedor_id,
            quantidade,
            preco_compra,
            preco_venda,
            lote,
            data_fabricacao,
            data_validade,
        }
    }
}
   
#[async_trait]
impl Crudable for ItemProduto {
    fn collection_name() -> &'static str {
        "itens_produtos"
    }
    fn id(&self) -> String {
        self.id.to_hex()
    }

}