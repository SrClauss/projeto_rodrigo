mod entities;
use async_trait::async_trait;
use dotenv::dotenv;
use mongodb::bson::doc;
use mongodb::options::ClientOptions;
use mongodb::Collection;
use mongodb::{Client, Database};
use serde::de::DeserializeOwned;
use std::env;

pub async fn connect() -> Database {
    dotenv().ok();

    let mongo_db_uri = env::var("MONGO_DB_URI").expect("MONGO_DB_URI must be set");
    let client_options = ClientOptions::parse(mongo_db_uri)
        .await
        .expect("Failed to parse client options");
    let client = Client::with_options(client_options).expect("Failed to create client");
    let db_name = env::var("MONGO_DB_NAME").expect("MONGO_DB_NAME must be set");
    client.database(&db_name)
}

#[async_trait]
pub trait Crudable: Send + Sync + DeserializeOwned {
    fn collection_name() -> &'static str;
    async fn create(&self, db: Database, privilege: Privilege) -> Result<(), String>;
    async fn read(id: &str, db: Database) -> Result<Self, String>
    where
        Self: Sized;
    async fn update(&self, id: &str, db: Database, privilege: Privilege) -> Result<(), String>;
    async fn delete(&self, db: Database, privilege: Privilege) -> Result<(), String>;
}

pub const PRIVILEGES: [&str; 3] = ["admin", "user", "guest"];
#[repr(i8)]
pub enum Privilege {
    Guest = 0,
    User = 1,
    SuperUser = 2,
    Admin = 3,
}

pub async fn find_all_by_param<T: Crudable>(
    param: &str,
    value: &str,
    db: Database,
) -> Result<Vec<T>, String> {
    let collection: Collection<T> = db.collection(T::collection_name());
    let filter = doc! {param: value};
    let mut cursor: mongodb::Cursor<T> =
        collection.find(filter).await.map_err(|e| e.to_string())?;
    let mut results = Vec::new();
    while cursor.advance().await.map_err(|e| e.to_string())? {
        let crudable_doc = cursor.deserialize_current();
        match crudable_doc {
            Ok(doc) => results.push(doc),
            Err(e) => {
                println!("Erro ao deserializar documento : {}", e);
                continue;
            }
        }
    }
    Ok(results)
}

pub async fn find_first_by_param<T: Crudable>(
    param: &str,
    value: &str,
    db: Database,
) -> Result<T, String> {
    let collection: Collection<T> = db.collection(T::collection_name());
    let filter = doc! {param: value};
    let mut cursor: mongodb::Cursor<T> =
        collection.find(filter).await.map_err(|e| e.to_string())?;
    if cursor.advance().await.map_err(|e| e.to_string())? {
        let crudable_doc = cursor.deserialize_current();
        match crudable_doc {
            Ok(doc) => Ok(doc),
            Err(e) => {
                println!("Erro ao deserializar documento : {}", e);
                Err(e.to_string())
            }
        }
    } else {
        Err("Documento não encontrado".to_string())
    }
}

pub async fn find_by_closure<T, F>(
    db: &Database,
    collection_name: &str,
    mut closure: F,
) -> Result<Vec<T>, String>
where
    T: DeserializeOwned + Send + Sync,
    F: FnMut(&T) -> bool + Send + Sync,
{
    let collection: Collection<T> = db.collection(collection_name);

    let mut cursor = collection
        .find(doc! {})
        .await
        .map_err(|e| e.to_string())?;

    let mut results = Vec::new();

    while cursor.advance().await.map_err(|e| e.to_string())? {
        let doc = cursor.deserialize_current();
        match doc {
            Ok(doc) => {
                if closure(&doc) {
                    results.push(doc);
                }
            }
            Err(e) => {
                println!("Erro ao deserializar documento : {}", e);
                continue;
            }
        }
    }

    Ok(results)
}




