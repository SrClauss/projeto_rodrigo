use mongodb::bson::{oid::ObjectId, DateTime};
use crate::{database::{entities::pedido::Pedido, traits::{crudable::Crudable, pedidos_recorrentes::{PedidoRecorrente, TipoRecorrencia}}}, utilities::naive_to_bson};
use crate::utilities::bson_to_naive;
use chrono::Datelike;
use serde::{Deserialize, Serialize};


#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum DiasSemana{
    Segunda = 0,
    Terca = 1,
    Quarta = 2,
    Quinta = 3,
    Sexta = 4,
    Sabado = 5,
    Domingo = 6,


}
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PedidosSemanais{
    pub id: ObjectId,
    pub cliente_id: ObjectId,
    pub data_criacao: DateTime,
    pub pedido_recorrente: Pedido,
    pub dias_recorrentes: Vec<DiasSemana>,
}



impl PedidosSemanais {
    pub fn new(
        cliente_id: ObjectId,
        data_criacao: DateTime,
        pedido_recorrente: Pedido,
        dias_recorrentes: Vec<DiasSemana>,

    ) -> Self {
        PedidosSemanais {
            id: ObjectId::new(),
            cliente_id,
            data_criacao,
            pedido_recorrente,
            dias_recorrentes,
        }
    }
    fn get_recorrencia(&self) -> Vec<u32> {
        self.dias_recorrentes.iter().map(|d| d.clone() as u32).collect()
    }
}

impl PedidoRecorrente for PedidosSemanais {
    fn recorrencia(&self) -> TipoRecorrencia {
        TipoRecorrencia::Semanal
    }
   
    fn proximo_pedido(&self,data_base: &DateTime) -> Result<DateTime,String> {
        let mut database = bson_to_naive(*data_base);
        let recorrencias = self.get_recorrencia();
        for _i in 0..7 {
            let weekday = database.weekday().num_days_from_monday();
            if recorrencias.contains(&weekday) {
                return Ok(naive_to_bson(database));
            }
            database = database.succ_opt().unwrap();
        }
        Err("Não foi possível encontrar o próximo pedido".to_string())

    }
    fn pedido(&self) -> Pedido {
        self.pedido_recorrente.clone()
    }
    fn set_pedido(&mut self, pedido: &Pedido) {
        self.pedido_recorrente = pedido.clone();
    }

    
}
impl  Crudable for PedidosSemanais {
    fn collection_name() -> &'static str {
        "pedidos_recorrentes"
    }
    fn id(&self) -> String {
        self.id.to_hex()
    }
    
}