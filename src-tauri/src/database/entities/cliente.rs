use crate::database::{Crudable, entities::endereco::Endereco};
use crate::utilities::validar_cpf_cnpj;
use async_trait::async_trait;
use mongodb::bson::oid::ObjectId;
use mongodb::bson::doc;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Cliente {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub nome: String,
    pub email: String,
    pub telefone: String,
    pub cpf_cnpj: String,
    pub data_nascimento: String,
    pub enderecos: Vec<Endereco>,
}


impl Cliente {
    pub fn new(

        nome: String,
        email: String,
        telefone: String,
        cpf_cnpj: String,
        data_nascimento: String,
        enderecos: Vec<Endereco>,
    ) -> Result<Self, String> {
        if validar_cpf_cnpj(&cpf_cnpj) {
            return Err("CPF inválido".to_string());
        }
        Ok(Cliente {
            id: ObjectId::new(),
            nome,
            email,
            telefone,
            cpf_cnpj,
            data_nascimento,
            enderecos,
        })
    }
    pub fn pessoa_fisica(&self) -> bool {
        self.cpf_cnpj.len() == 11
    }

    
}

#[async_trait]
impl Crudable for Cliente{

    fn collection_name() -> &'static str {
        "clientes"
    }
    fn id(&self) -> String {
        self.id.to_hex()
    }

}