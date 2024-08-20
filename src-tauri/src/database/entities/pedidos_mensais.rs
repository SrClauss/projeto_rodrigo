use mongodb::bson::{oid::ObjectId, DateTime};
use crate::{database::{entities::pedido::Pedido, traits::{crudable::Crudable, pedidos_recorrentes::{PedidoRecorrente, TipoRecorrencia}}}, utilities::naive_to_bson};
use crate::utilities::bson_to_naive;
use chrono::Datelike;
use serde::{Deserialize, Serialize};





#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PedidosMensais{
    pub id: ObjectId,
    pub cliente_id: ObjectId,
    pub data_criacao: DateTime,
    pub pedido_recorrente: Pedido,
    pub dias_recorrentes: Vec<u32>,
}

impl PedidosMensais {
    pub fn new(
        cliente_id: ObjectId,
        data_criacao: DateTime,
        pedido_recorrente: Pedido,
        dias_recorrentes: Vec<u32>,

    ) -> Self {
        PedidosMensais {
            id: ObjectId::new(),
            cliente_id,
            data_criacao,
            pedido_recorrente,
            dias_recorrentes,
        }
    }
    fn get_recorrencia(&self) -> Vec<u32> {
        self.dias_recorrentes.clone()
    }
}

impl PedidoRecorrente for PedidosMensais {
    fn recorrencia(&self) -> TipoRecorrencia {
        TipoRecorrencia::Mensal
    }
  
    fn proximo_pedido(&self,data_base: &DateTime) -> Result<DateTime,String> {
        let mut database = bson_to_naive(*data_base);
        let recorrencias = self.get_recorrencia();
        for _i in 0..7 {
            database = database.succ_opt().unwrap();
            if recorrencias.contains(&database.day()){
                return Ok(naive_to_bson(database));
            }
        }
        Err("Não foi possível encontrar a próxima data".to_string())
    }
    fn pedido(&self) -> Pedido {
        self.pedido_recorrente.clone()
    }
    fn set_pedido(&mut self, pedido: &Pedido) {
        self.pedido_recorrente = pedido.clone();
    }

    
}


impl Crudable for PedidosMensais{
    fn collection_name() -> &'static str {
        "pedidos_recorrentes"
    }

    fn id(&self) -> String {
        self.id.to_hex()
    }
    
}