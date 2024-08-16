// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
pub mod database;
pub mod utilities;
use database::{
    entities::{cliente::Cliente, endereco::Endereco, fornecedor::Fornecedor, user::User, categoria::Categoria},
    Crudable, Privilege
};
use mongodb::bson::{doc,  Bson};
use serde_json::Value;
use tauri::async_runtime::block_on;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

async fn create_a_admin_if_dont_exists() -> Result<String, String> {
    let db = database::connect().await;
    let user = database::find_first_by_param::<User>(
        "privilege",
        Bson::Int32(Privilege::Admin as i32),
        &db,
    )
    .await;

    if user.is_ok() {
        return Ok(format!(
            "Admin with id {:?} already exists",
            user.unwrap().id.unwrap().to_hex()
        ));
    }
    let user = User::new(
        "admin".to_string(),
        "admin".to_string(),
        "admin".to_string(),
        Privilege::Admin as i8,
    );

    let user = user.create(&db, Privilege::Admin).await;

    if user.is_err() {
        return Err(user.err().unwrap());
    }
    let user = user.unwrap();

    return Ok(format!("Admin with id {:?} created", user.id));
}

#[tauri::command]
async fn create_a_cliente(data: Value) -> Result<Cliente, String> {
    let db = database::connect().await;
    let enderecos_values = data.get("enderecos");
    if enderecos_values.is_none() {
        return Err("Endereços não informados".to_string());
    }
    let enderecos_values = enderecos_values.unwrap().as_array().unwrap();
    let mut enderecos: Vec<Endereco> = Vec::new();
    for endereco_value in enderecos_values {
        let endereco = Endereco::new(
            endereco_value["nome_endereco"]
                .as_str()
                .unwrap_or("")
                .to_string(),
            endereco_value["logradouro"]
                .as_str()
                .unwrap_or("")
                .to_string(),
            endereco_value["numero"].as_i64().unwrap_or(0) as i32,
            endereco_value["bairro"].as_str().unwrap_or("").to_string(),
            endereco_value["cidade"].as_str().unwrap_or("").to_string(),
            endereco_value["estado"].as_str().unwrap_or("").to_string(),
            endereco_value["cep"].as_str().unwrap_or("").to_string(),
            endereco_value["complemento"]
                .as_str()
                .unwrap_or("")
                .to_string(),
            endereco_value["referencia"]
                .as_str()
                .unwrap_or("")
                .to_string(),
        );
        if endereco.is_err() {
            return Err(endereco.err().unwrap());
        }
        enderecos.push(endereco.unwrap());
    }
    let cliente = Cliente::new(
        data["nome"].as_str().unwrap_or("").to_string(),
        data["email"].as_str().unwrap_or("").to_string(),
        data["telefone"].as_str().unwrap_or("").to_string(),
        data["cpf_cnpj"].as_str().unwrap_or("").to_string(),
        data["data_nascimento"].as_str().unwrap_or("").to_string(),
        enderecos,
    );
    if cliente.is_err() {
        return Err(cliente.err().unwrap());
    }
    let cliente = cliente.unwrap();
    let cliente = cliente.create(&db, Privilege::Admin).await;
    if cliente.is_err() {
        return Err(cliente.err().unwrap());
    }
    Ok(cliente.unwrap())
}
#[tauri::command]
async fn login(data: Value) -> Result<String, String> {
    let db = database::connect().await;

    let email = data["email"].as_str().unwrap_or("").to_string();
    let password = data["password"].as_str().unwrap_or("").to_string();

    let user = database::find_first_by_param::<User>("email", Bson::String(email), &db).await;
    if user.is_err() {
        return Err(user.err().unwrap());
    }
    let user = user.unwrap();

    let verify_password = user.verify_password(&password);
    if verify_password.is_err() {
        return Err(verify_password.err().unwrap());
    }
    let verify_password = verify_password.unwrap();
    if verify_password {
        return Ok("Login efetuado com sucesso".to_string());
    }
    Err("Senha inválida".to_string())
}
#[tauri::command]
async fn create_a_fornecedor(data: Value) -> Result<String, String> {
    
    let db = database::connect().await;
    let enderecos_values = data.get("enderecos");
    if enderecos_values.is_none() {
        return Err("Endereços não informados".to_string());
    }
    let enderecos_values = enderecos_values.unwrap().as_array().unwrap();
    let mut enderecos: Vec<Endereco> = Vec::new();
    for endereco_value in enderecos_values {
        let endereco = Endereco::new(
            endereco_value["nome_endereco"]
                .as_str()
                .unwrap_or("")
                .to_string(),
            endereco_value["logradouro"]
                .as_str()
                .unwrap_or("")
                .to_string(),
            endereco_value["numero"].as_i64().unwrap_or(0) as i32,
            endereco_value["bairro"].as_str().unwrap_or("").to_string(),
            endereco_value["cidade"].as_str().unwrap_or("").to_string(),
            endereco_value["estado"].as_str().unwrap_or("").to_string(),
            endereco_value["cep"].as_str().unwrap_or("").to_string(),
            endereco_value["complemento"]
                .as_str()
                .unwrap_or("")
                .to_string(),
            endereco_value["referencia"]
                .as_str()
                .unwrap_or("")
                .to_string(),
        );
        if endereco.is_err() {
            return Err(endereco.err().unwrap());
        }
        enderecos.push(endereco.unwrap());
    }
    let fornecedor = Fornecedor::new(
        data["nome"].as_str().unwrap_or("").to_string(),
        data["cnpj"].as_str().unwrap_or("").to_string(),
        enderecos,
        data["telefone"].as_str().unwrap_or("").to_string(),
        data["email"].as_str().unwrap_or("").to_string(),
        data["data_criacao"].as_str().unwrap_or("").to_string(),
    );
    if fornecedor.is_err() {
        return Err(fornecedor.err().unwrap());
    }
    let fornecedor = fornecedor.unwrap();

    let fornecedor = fornecedor.create(&db, Privilege::Admin).await;
    if fornecedor.is_err() {
        return Err(fornecedor.err().unwrap());
    }



    Ok("Fornecedor criado com sucesso".to_string())

    
}

#[tauri::command]
async fn create_a_category(data: Value) -> Result<String, String>{
    let db = database::connect().await;
    let category = Categoria::new(
        data["nome"].as_str().unwrap_or("").to_string(),
        data["descricao"].as_str().unwrap_or("").to_string(),
    );
    if category.is_err() {
        return Err(category.err().unwrap());
    }
    let category = category.unwrap();
    let category = category.create(&db, Privilege::Admin).await;
    if category.is_err() {
        return Err(category.err().unwrap());
    }
    Ok("Categoria criada com sucesso".to_string())
}

#[tauri::command]
async fn find_cliente_by_substring_name(name_substring: String) -> Result<Vec<Cliente>, String> {
    let db = database::connect().await;
    let clientes = database::element_what_contains::<Cliente>("nome".to_string(), Bson::String(name_substring), &db).await;
    if clientes.is_err() {
        return Err(clientes.err().unwrap());
    }
    Ok(clientes.unwrap())
}
#[tauri::command]
async fn find_fornecedor_by_substring_name(name_substring: String) -> Result<Vec<Fornecedor>, String> {
    let db = database::connect().await;
    let fornecedores = database::element_what_contains::<Fornecedor>("nome".to_string(), Bson::String(name_substring), &db).await;
    if fornecedores.is_err() {
        return Err(fornecedores.err().unwrap());
    }
    Ok(fornecedores.unwrap())
}
fn main() {
    block_on(async {
        let result = create_a_admin_if_dont_exists().await;
        match result {
            Ok(result) => println!("{}", result),
            Err(e) => println!("{}", e),
        }
    });

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_a_cliente,
            create_a_fornecedor,
            create_a_category,  
            login,
            find_cliente_by_substring_name,
            find_fornecedor_by_substring_name,  
          ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
