use mongodb::bson::oid::ObjectId;
use mongodb::bson::DateTime;
use mongodb::bson::doc;
use serde::{Deserialize, Serialize};
use crate::database::entities::produto::Produto;
use crate::database::traits::crudable::Crudable;

#[derive(Debug, Serialize, Deserialize, Clone )]
pub struct ItemProduto {
    #[serde(rename = "_id")]
    pub id: ObjectId,
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

       
        fornecedor_id: ObjectId,
        quantidade: i32,
        preco_compra: f64,
        preco_venda: f64,
        lote: Option<String>,
        data_fabricacao: DateTime,
        data_validade: DateTime,
    ) -> Self {        
        ItemProduto {
            id: ObjectId::new(),    
            fornecedor_id,
            quantidade,
            preco_compra,
            preco_venda,
            lote,
            data_fabricacao,
            data_validade,
        }
    }

    pub async fn produto_id(&self) -> ObjectId {
        let produto = Produto::find_element_by_child_id("itens", self.id).await.unwrap();
        produto.id
        
    }
    
}
   
