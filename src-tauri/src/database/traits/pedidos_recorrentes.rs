use super::crudable::{Crudable, Privilege};
use crate::database::entities::pedido::Pedido;
use crate::utilities::{bson_date_equal, bson_to_naive, naive_to_bson};
use async_trait::async_trait;
use mongodb::bson::DateTime;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub enum TipoRecorrencia {
    Semanal,
    Mensal,
    PorPeriodo,
}
#[async_trait]
pub trait PedidoRecorrente: Crudable {
    fn recorrencia(&self) -> TipoRecorrencia;

    fn pedido(&self) -> Pedido;
    fn set_pedido(&mut self, pedido: &Pedido);

    fn proximo_pedido(&self, data_base: &DateTime) -> Result<DateTime, String>;

    async fn pedido_no_dia(&self, data_base: &DateTime) -> bool {
        let proximo_pedido = self.proximo_pedido(data_base).unwrap();
        bson_date_equal(&proximo_pedido, data_base)
    }
    async fn gerar_pedidos_dia(data_base: &DateTime) -> Result<(), String> {
        let pedidos_recorrentes = Self::find_all().await.unwrap();

        for mut pedido_recorrente in pedidos_recorrentes {
            if pedido_recorrente.pedido_no_dia(data_base).await {
                let pedido = &pedido_recorrente.pedido();
                pedido_recorrente.set_pedido(pedido);
                let result = pedido_recorrente.clone().create(Privilege::Admin).await;
                if result.is_err() {
                    println!("Erro ao criar pedido recorrente");
                }
                let result = pedido.clone().create(Privilege::Admin).await;
                if result.is_err() {
                    println!("Erro ao criar pedido recorrente");
                }

            }
        }
        Ok(())
    }
}


