pub mod entities;
use async_trait::async_trait;
use dotenv::dotenv;
use mongodb::bson::{self, doc, Bson};
use mongodb::options::ClientOptions;
use mongodb::Collection;
use mongodb::{Client, Database};
use serde::de::DeserializeOwned;
use serde::Serialize;
use std::env;

pub async fn connect() -> Database {
    dotenv().ok();

    let mongo_db_uri = env::var("MONGODB_URI").expect("MONGODB_URI must be set");
    let client_options = ClientOptions::parse(mongo_db_uri)
        .await
        .expect("Failed to parse client options");
    let client = Client::with_options(client_options).expect("Failed to create client");
    let db_name = env::var("DATABASE_NAME").expect("DATABASE_NAME must be set");
    client.database(&db_name)
}

#[async_trait]

pub trait Crudable: Send + Sync + DeserializeOwned + Serialize + Clone {
    fn collection_name() -> &'static str;
    fn id(&self) -> String;
    fn privilege_for_create() -> Privilege {
        Privilege::User
    }

    fn privilege_for_update() -> Privilege {
        Privilege::User
    }
    fn privilege_for_delete() -> Privilege {
        Privilege::SuperUser
    }
    async fn create(self, db: &Database, privilege: Privilege) -> Result<Self, String> where Self: Sized {
        if (privilege as i8) < (Self::privilege_for_create() as i8) {
            return Err("Insufficient privilege".to_string());
        }
        let collection: Collection<Self> = db.collection(Self::collection_name());
        collection.insert_one(self.clone()).await.map_err(|e| e.to_string())?;
        Ok(self)
    }

    async fn read(id: &str, db: &Database) -> Result<Self, String> where Self: Sized {
        let collection: Collection<Self> = db.collection(Self::collection_name());
        let filter = doc! {"_id": id};
        let doc = collection.find_one(filter).await.map_err(|e| e.to_string())?;
        match doc {
            Some(doc) => Ok(doc),
            None => Err("Documento não encontrado".to_string()),
        }
    }
  
    async fn update(self, id: &str, db: &Database, privilege: Privilege) -> Result<Self, String>{
        if (privilege as i8) < (Self::privilege_for_update() as i8) {
            return Err("Insufficient privilege".to_string());
        }
        let collection: Collection<Self> = db.collection(Self::collection_name());
        let user_doc = bson::to_document(&self).map_err(|e| e.to_string())?;
        collection
            .update_one(doc! {"_id": id}, doc! {"$set": user_doc})
            .await
            .map_err(|e| e.to_string())?;
        Ok(self)
    }
    
    async fn delete(self, db: &Database, privilege: Privilege) -> Result<Self, String>{
        if (privilege as i8) < (Self::privilege_for_update() as i8) {
            return Err("Insufficient privilege".to_string());
        }
        let collection: Collection<Self> = db.collection(Self::collection_name());
        collection
            .delete_one(doc! {"_id": self.id()})
            .await
            .map_err(|e| e.to_string())?;
        Ok(self)
    }
   
}

#[repr(i8)]
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Privilege {
    Guest = 0,
    User = 1,
    SuperUser = 2,
    Admin = 3,
}

pub async fn find_all_by_param<T: Crudable>(param: &str, value: Bson, db: &Database) -> Result<Vec<T>, String> {
    let collection: Collection<T> = db.collection(T::collection_name());
    let filter = doc! {param: value};
    let mut cursor = collection.find(filter).await.map_err(|e| e.to_string())?;
    let mut results = Vec::new();
    while cursor.advance().await.map_err(|e| e.to_string())? {
        let doc = cursor.deserialize_current();
        match doc {
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
    value: Bson,
    db: &Database,
) -> Result<T, String> {
    let collection: Collection<T> = db.collection(T::collection_name());
    let filter = doc! {param: value};
    let doc = collection.find_one(filter).await.map_err(|e| e.to_string())?;
    match doc {
        Some(doc) => Ok(doc),
        None => Err("Documento não encontrado".to_string()),
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
pub async fn find_all<T: Crudable>(db: &Database) -> Result<Vec<T>, String> {
    let collection: Collection<T> = db.collection(T::collection_name());
    let mut cursor: mongodb::Cursor<T> = collection.find(doc! {}).await.map_err(|e| e.to_string())?;
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


