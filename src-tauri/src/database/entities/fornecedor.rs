use crate::database::Crudable;
use crate::utilities::validar_cnpj;
use async_trait::async_trait;
use mongodb::bson::oid::ObjectId;
use mongodb::bson::doc;
use serde::{Deserialize, Serialize};




#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Fornecedor {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub nome: String,
    pub cnpj: String,
    pub endereco: ObjectId,
    pub telefone: String,
    pub email: String,
    pub data_criacao: String,
}

impl Fornecedor {
    pub fn new(
        id: ObjectId,
        nome: String,
        cnpj: String,
        endereco: ObjectId,
        telefone: String,
        email: String,
        data_criacao: String,
    ) -> Result<Self, String> {
        if validar_cnpj(&cnpj) {
            return Err("CNPJ inválido".to_string());
        }
        Ok(Fornecedor {
            id,
            nome,
            cnpj,
            endereco,
            telefone,
            email,
            data_criacao,
        })
    }

    
}


#[async_trait]
impl Crudable for Fornecedor{

    fn collection_name() -> &'static str {
        "fornecedores"
    }
    fn id(&self) -> String {
        self.id.to_hex()
    }



}