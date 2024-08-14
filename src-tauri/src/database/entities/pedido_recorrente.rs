use std::time::SystemTime;
use crate::database::Crudable;
use async_trait::async_trait;
use chrono::{DateTime as ChronoDateTime, Datelike, Duration, Local, NaiveDate, NaiveDateTime, TimeZone, Utc, Weekday};
use mongodb::bson::oid::ObjectId;
use mongodb::bson::DateTime;
use mongodb::bson::doc;
use serde::{Deserialize, Serialize};




#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PedidoRecorrente {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub cliente_id: ObjectId,
    pub pedido_id: ObjectId,
    pub data_cadastro: DateTime,
    pub recorrencia: Recorrencia,
    pub recorrencia_semanal: Option<Vec<DiaSemana>>,
    pub recorrencia_mensal: Option<i32>,
    pub recorrencia_anual: Option<DateTime>,
    pub recorrencia_por_dia: u8,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum Recorrencia {
    Diaria,
    Semanal,
    Mensal,
    Anual,
    PorDia
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum DiaSemana {
    Domingo,
    Segunda,
    Terca,
    Quarta,
    Quinta,
    Sexta,
    Sabado,
}

impl PedidoRecorrente {
    pub fn new(
        id: ObjectId,
        cliente_id: ObjectId,
        pedido_id: ObjectId,
        data_cadastro: DateTime,
        recorrencia: Recorrencia,
        recorrencia_semanal: Option<Vec<DiaSemana>>,
        recorrencia_mensal: Option<i32>,
        recorrencia_anual: Option<DateTime>,
        recorrencia_por_dia: u8,
    ) -> Self {
        PedidoRecorrente {
            id,
            cliente_id,
            pedido_id,
            data_cadastro,
            recorrencia,
            recorrencia_semanal,
            recorrencia_mensal,
            recorrencia_anual,
            recorrencia_por_dia,
        }
    }
    #[allow(dead_code)]
    fn naive_date_para_bson_datetime(data: NaiveDate) -> DateTime {
        // Converte NaiveDate para NaiveDateTime adicionando horário (meia-noite)
        let naive_datetime: NaiveDateTime = data.and_hms_opt(0, 0, 0).unwrap();
        
        // Converte NaiveDateTime para DateTime<Utc>
        let datetime_utc: ChronoDateTime<Utc> = TimeZone::from_utc_datetime(&Utc, &naive_datetime);
        
        // Converte DateTime<Utc> para SystemTime
        let system_time: SystemTime = datetime_utc.into();
        
        // Converte SystemTime para MongoDB DateTime
        DateTime::from(system_time)
    }

    fn convert_dia_da_semana_to_weekday(dia: &DiaSemana) -> Weekday {
        match dia {
            DiaSemana::Domingo => Weekday::Sun,
            DiaSemana::Segunda => Weekday::Mon,
            DiaSemana::Terca => Weekday::Tue,
            DiaSemana::Quarta => Weekday::Wed,
            DiaSemana::Quinta => Weekday::Thu,
            DiaSemana::Sexta => Weekday::Fri,
            DiaSemana::Sabado => Weekday::Sat,
        }
    }

    #[allow(dead_code)]
    fn convert_wekday_to_dia_da_semana(dia: Weekday) -> DiaSemana {
        match dia {
            Weekday::Sun => DiaSemana::Domingo,
            Weekday::Mon => DiaSemana::Segunda,
            Weekday::Tue => DiaSemana::Terca,
            Weekday::Wed => DiaSemana::Quarta,
            Weekday::Thu => DiaSemana::Quinta,
            Weekday::Fri => DiaSemana::Sexta,
            Weekday::Sat => DiaSemana::Sabado,
        }
    }
    fn proximo_pedido(&self, data_atual:NaiveDate) -> NaiveDate {
        
        match self.recorrencia {
            Recorrencia::Diaria => data_atual + Duration::days(1),
            Recorrencia::Semanal => {
                let data_atual = Local::now().naive_local().date();
                let wekday_days = self
                    .recorrencia_semanal
                    .as_ref()
                    .unwrap()
                    .iter()
                    .map(|dia| PedidoRecorrente::convert_dia_da_semana_to_weekday(dia))
                    .collect::<Vec<Weekday>>();
                let mut data_alvo = data_atual;

                while !(wekday_days.contains(&data_alvo.weekday())) {
                    data_alvo = data_alvo + Duration::days(1);
                }

                return data_alvo;
            }
            Recorrencia::Mensal => {
                let data_atual = Local::now().naive_local().date();
                let dia = self.recorrencia_mensal.unwrap();
                let mut data_alvo = data_atual;
                while data_alvo.day() != dia as u32 {
                    data_alvo = data_alvo + Duration::days(1);
                }
                return data_alvo;
            }
            Recorrencia::Anual => {
                let data_atual = Local::now().naive_local().date();
                let mut data_alvo = data_atual;
                while data_alvo.day() != data_alvo.day() {
                    data_alvo = data_alvo + Duration::days(1);
                }
                return data_alvo;
            }
            Recorrencia::PorDia => {
                let data_atual = Local::now().naive_local().date();
                let data_alvo = data_atual + Duration::days(self.recorrencia_por_dia as i64);
                return data_alvo;
          }
        }
    }
    fn proximo_domingo() -> chrono::NaiveDate {
        let data_atual = Local::now().naive_local().date();
        let dia_da_semana = data_atual.weekday().num_days_from_sunday();
        let dias_ate_domingo = 7 - dia_da_semana;
        data_atual + Duration::days(dias_ate_domingo as i64)
    }
     pub fn gera_agenda_restante_semana(&self) -> Vec<NaiveDate> {
        let data_atual = Local::now().naive_local().date();
        let data_final = PedidoRecorrente::proximo_domingo();
        let mut data_alvo = data_atual;
        let mut datas = vec![];

        while data_alvo < data_final {
            data_alvo = self.proximo_pedido(data_alvo);
            datas.push(data_alvo);
        }
        datas
    }
    pub fn gera_agenda_por_periodo(data_inicial: NaiveDate, dias_recorrencia: i32, quantidade: i32) -> Vec<NaiveDate> {
        let mut data_alvo = data_inicial;
        let mut datas = vec![];
        for _ in 0..quantidade {
            data_alvo = data_alvo + Duration::days(dias_recorrencia as i64);
            datas.push(data_alvo);
        }
        datas
    }



    
}


#[async_trait]
impl Crudable for PedidoRecorrente {
    fn collection_name() -> &'static str {
        "pedidos_recorrentes"
    }
    fn id(&self) -> String {
        self.id.to_hex()
    }

}