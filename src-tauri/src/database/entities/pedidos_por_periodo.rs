use crate::utilities::{bson_to_naive, naive_to_ymd};
use crate::{
    database::{
        entities::pedido::Pedido,
        traits::{
            crudable::Crudable,
            pedidos_recorrentes::{PedidoRecorrente, TipoRecorrencia},
        },
    },
    utilities::naive_to_bson,
};
use chrono::Days;
use mongodb::bson::{oid::ObjectId, DateTime};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PedidosPorPeriodo {
    pub id: ObjectId,
    pub cliente_id: ObjectId,
    pub data_criacao: DateTime,
    pub pedido_recorrente: Pedido,
    pub dias_recorrentes: Vec<u32>,
}

impl PedidosPorPeriodo {
    pub fn new(
        cliente_id: ObjectId,
        data_criacao: DateTime,
        pedido_recorrente: Pedido,
        dias_recorrentes: u32,
    ) -> Self {
        PedidosPorPeriodo {
            id: ObjectId::new(),
            cliente_id,
            data_criacao,
            pedido_recorrente,
            dias_recorrentes: vec![dias_recorrentes],
        }
    }
}

impl PedidoRecorrente for PedidosPorPeriodo {
    fn recorrencia(&self) -> TipoRecorrencia {
        TipoRecorrencia::PorPeriodo
    }

    fn proximo_pedido(&self, data_base: &DateTime) -> Result<DateTime, String> {
        let mut data_base = naive_to_ymd(bson_to_naive(*data_base));
        let data_criacao = naive_to_ymd(bson_to_naive(self.data_criacao));
        let intervalo = self.dias_recorrentes[0];

        if data_base < data_criacao {
            return Err("Data base menor que data de criação".to_string());
        }
        if data_base == data_criacao {
            data_base = data_base + Days::new(intervalo as u64);
        } else {
            while data_base != data_criacao {
                data_base = data_base.succ_opt().unwrap();
            }
        }
        Ok(naive_to_bson(data_base).into())
    }

    fn pedido(&self) -> Pedido {
        self.pedido_recorrente.clone()
    }
    fn set_pedido(&mut self, pedido: &Pedido) {
        self.pedido_recorrente = pedido.clone();
    }
}

impl Crudable for PedidosPorPeriodo {
    fn collection_name() -> &'static str {
        "pedidos_por_periodo"
    }
    fn id(&self) -> String {
        self.id.to_hex()
    }
}
