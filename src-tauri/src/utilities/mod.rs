

use regex::Regex;
use chrono::NaiveDate;
use mongodb::bson::DateTime;



pub fn bson_date_equal(data1: DateTime, data2: DateTime) -> bool {
    let data1 = NaiveDate::parse_from_str(&data1.to_string()[0..10], "%Y-%m-%d").unwrap();
    let data2 = NaiveDate::parse_from_str(&data2.to_string()[0..10], "%Y-%m-%d").unwrap();
    data1 == data2
}

pub fn bson_to_naive(data: DateTime) -> NaiveDate {
    NaiveDate::parse_from_str(&data.to_string()[0..10], "%Y-%m-%d").unwrap()
}

pub fn naive_to_bson(data: NaiveDate) -> DateTime {
    DateTime::parse_rfc3339_str(str::replace(&data.to_string(), " ", "T").as_str()).unwrap()
}
pub fn validar_cep(cep: &str) -> bool {
    cep.len() == 8
}
pub fn validar_cpf_cnpj(cpf_cnpj: &str) -> bool {
    validar_cpf(cpf_cnpj) || validar_cnpj(cpf_cnpj)
}
pub fn validar_cpf(cpf: &str) -> bool {
    let re = Regex::new(r"^\d{3}\.\d{3}\.\d{3}-\d{2}$").unwrap();
    if !re.is_match(cpf) {
        return false;
    }

    let nums: Vec<u32> = cpf.chars().filter_map(|c| c.to_digit(10)).collect();
    if nums.len() != 11 {
        return false;
    }

    let dv1 = (0..9).map(|i| nums[i] * (10 - i as u32)).sum::<u32>() % 11;
    let dv1 = if dv1 < 2 { 0 } else { 11 - dv1 };

    let dv2 = (0..10).map(|i| nums[i] * (11 - i as u32)).sum::<u32>() % 11;
    let dv2 = if dv2 < 2 { 0 } else { 11 - dv2 };

    dv1 == nums[9] && dv2 == nums[10]
}
pub fn validar_cnpj(cnpj: &str) -> bool {
    let re = Regex::new(r"^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$").unwrap();
    if !re.is_match(cnpj) {
        return false;
    }

    let nums: Vec<u32> = cnpj.chars().filter_map(|c| c.to_digit(10)).collect();
    if nums.len() != 14 {
        return false;
    }

    let dv1 = (0..12).map(|i| nums[i] * (if i % 8 == 0 { 2 } else { 9 - (i % 8) as u32 })).sum::<u32>() % 11;
    let dv1 = if dv1 < 2 { 0 } else { 11 - dv1 };

    let dv2 = (0..13).map(|i| nums[i] * (if i % 8 == 0 { 2 } else { 9 - (i % 8) as u32 })).sum::<u32>() % 11;
    let dv2 = if dv2 < 2 { 0 } else { 11 - dv2 };

    dv1 == nums[12] && dv2 == nums[13]

}