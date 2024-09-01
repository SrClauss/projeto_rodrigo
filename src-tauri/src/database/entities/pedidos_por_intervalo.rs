
#![allow(dead_code)]

use async_trait::async_trait;
use chrono::Datelike;
use mongodb::bson::oid::ObjectId;
use crate::database::traits::crudable::Crudable;
use crate::database::traits::pedidos_recorrentes::{RecurrentOrderable, Periodicidade};
use crate::database::entities::pedido::Pedido;
use serde::{Deserialize, Serialize};
use crate::utilities::bson_to_naive;
use mongodb::bson::DateTime;



#[derive(Debug, Serialize, Deserialize, Clone)]
struct PedidosPorIntervalo{
    id: ObjectId,
    data: String,
    dias_recorrentes: Vec<u8>,
    pedidos: Option<Vec<Pedido>>,
}

impl PedidosPorIntervalo{
    pub fn new(
        data: String,
        dias_recorrentes: Vec<u8>,
        pedidos: Option<Vec<Pedido>>,
        
    ) -> Self {
        PedidosPorIntervalo{
            id: ObjectId::new(),
            data,
            dias_recorrentes,
            pedidos,
            
        }
    }
}

#[async_trait]
impl Crudable for PedidosPorIntervalo{
    fn collection_name() -> &'static str {
        "pedidos_recorrentes"
    }
    fn id(&self) -> String {
        self.id.to_string()
    }
}

#[async_trait]
impl RecurrentOrderable for PedidosPorIntervalo{
    fn periodicidade(&self) -> Periodicidade {
        Periodicidade::PorIntervalo
    }
    fn orders(&self) -> Vec<Pedido> {
        self.pedidos.clone().unwrap()
    }

    fn dias_recorrentes(&self) -> Vec<u8> {
        self.dias_recorrentes.clone()
    }
    async fn  has_client_orders_on_day(&self, day: DateTime) -> bool {
        let date = bson_to_naive(day);
        let day = date.day0() as u8 + 1;
        if self.dias_recorrentes.contains(&day){
            return true;
        }
        false

    }

    
}