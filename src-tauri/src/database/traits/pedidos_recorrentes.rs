use async_trait::async_trait;
use mongodb::bson::DateTime;

use crate::database::entities::pedido::Pedido;
use super::crudable::{Crudable, Privilege};



pub enum Periodicidade{
    
    Semanal, // pode se estabelecer quais dias da semana serão gerados os pedidos
    Mensal, //pode se estabelecer quais dias do mês serão gerados os pedidos
    PorIntervalo, //establece-se um intervalo de dias entre os pedidos
    DiaSemanaMensal, //pode ser a primeira, segunta, terceira ou quarta dia da semana no mês
}

#[async_trait]
pub trait RecurrentOrderable: Crudable{


    fn periodicidade(&self) -> Periodicidade;
    fn dias_recorrentes(&self) -> Vec<u8>;
    fn orders(&self) -> Vec<Pedido>;
    async fn has_client_orders_on_day(&self, day: DateTime) -> bool;
    async fn create_a_client_order_on_day(&self, day: DateTime) -> Result<Vec<Pedido>, String>{
        let mut result: Vec<Pedido> = Vec::new();
        if self.has_client_orders_on_day(day).await{
            let orders = self.orders();
            for order in orders{
                let new_pedido = Pedido::new(

                    order.cliente_id,
                    order.produto,
                    order.quantidade,
                    day.to_string(),    
                    Some(day.to_string()),
                );
                if new_pedido.is_err(){
                    return Err(new_pedido.err().unwrap());
                }
                let new_pedido = new_pedido.unwrap();

                let created_pedido = new_pedido.create(Privilege::User).await;
                if created_pedido.is_err(){
                    return Err(created_pedido.err().unwrap());
                }
                result.push(created_pedido.unwrap());
                



                

            }
            
            
            
            
        }
        else{
            return Err("Não há pedidos para este dia".to_string());
        }
        Ok(result)
    }
    async fn create_all_client_orders_on_day(day: DateTime) -> Result<Vec<Pedido>, String>{
        let mut result: Vec<Pedido> = Vec::new();
        let recurrent_orders = Self::find_all().await?;
        for recurrent_order in recurrent_orders{
            let orders = recurrent_order.create_a_client_order_on_day(day).await;
            if orders.is_err(){
                return Err(orders.err().unwrap());
            }
            result.append(&mut orders.unwrap());
        }
        Ok(result)


    }
    async fn create_all_client_orders_on_days(&self, days: Vec<DateTime>) -> Result<Vec<Pedido>, String>{
        let mut result: Vec<Pedido> = Vec::new();
        for day in days{
            let orders = self.create_a_client_order_on_day(day).await;
            if orders.is_err(){
                return Err(orders.err().unwrap());
            }
            result.append(&mut orders.unwrap());
        }
        Ok(result)
    }

   


}