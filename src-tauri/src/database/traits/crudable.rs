use crate::database::connect;
use mongodb::bson::oid::ObjectId;
use mongodb::bson::{self,doc, Bson};

use mongodb::Collection;
use serde::{de::DeserializeOwned, Serialize};
use serde_json::Value;
pub trait Crudable: Send + Sync + DeserializeOwned + Serialize + Clone {
    async fn collection() -> Collection<Self> {
        let db = connect().await;
        db.collection(Self::collection_name())
    }
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
    async fn create(self, privilege: Privilege) -> Result<Self, String>
    where
        Self: Sized,
    {
        if (privilege as i8) < (Self::privilege_for_create() as i8) {
            return Err("Insufficient privilege".to_string());
        }
        let collection = Self::collection().await;
        collection
            .insert_one(self.clone())
            .await
            .map_err(|e| e.to_string())?;
        Ok(self)
    }

    async fn read(id: &str) -> Result<Self, String>
    where
        Self: Sized,
    {
        let collection = Self::collection().await;
        let filter = doc! {"_id": id};
        let doc = collection
            .find_one(filter)
            .await
            .map_err(|e| e.to_string())?;
        match doc {
            Some(doc) => Ok(doc),
            None => Err("Documento não encontrado".to_string()),
        }
    }

    async fn update(&self, privilege: Privilege) -> Result<Self, String> {
        if (privilege as i8) < (Self::privilege_for_update() as i8) {
            return Err("Insufficient privilege".to_string());
        }
        let collection: Collection<Self> = Self::collection().await;
        collection
            .replace_one(doc! {"_id": self.id()}, self.clone())
            .await
            .map_err(|e| e.to_string())?;
        Ok(self.clone())
    }

    async fn delete(self, privilege: Privilege) -> Result<Self, String> {
        if (privilege as i8) < (Self::privilege_for_update() as i8) {
            return Err("Insufficient privilege".to_string());
        }
        let collection: Collection<Self> = Self::collection().await;
        collection
            .delete_one(doc! {"_id": self.id()})
            .await
            .map_err(|e| e.to_string())?;
        Ok(self)
    }

    fn serialize_crudable(&self) -> Result<Value, String> {
        let serialized = serde_json::to_value(self);
        match serialized {
            Ok(serialized) => Ok(serialized),
            Err(e) => Err(e.to_string()),
        }
    }
    async fn find_all_by_param(param: &str, value: Bson) -> Result<Vec<Self>, String> {
        let collection = Self::collection().await;
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
    async fn find_first_by_param(param: &str, value: Bson) -> Result<Self, String> {
        let collection = Self::collection().await;
        let filter = doc! {param: value};
        let doc = collection
            .find_one(filter)
            .await
            .map_err(|e| e.to_string())?;
        match doc {
            Some(doc) => Ok(doc),
            None => Err("Documento não encontrado".to_string()),
        }
    }

    async fn find_all() -> Result<Vec<Self>, String> {
        let collection = Self::collection().await;
        let mut cursor = collection.find(doc! {}).await.map_err(|e| e.to_string())?;
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

    async fn element_what_contains(param: String, value: Bson) -> Result<Vec<Self>, String> {
        let collection = Self::collection().await;
        let filter = doc! {
            param:{
                "$regex": value,
                "$options": "i"
            }
        };
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

    async fn exists_with_param(param: &str, value: Bson) -> Result<bool, String> {
        let collection = Self::collection().await;
        let filter = doc! {param: value};
        let doc = collection
            .find_one(filter)
            .await
            .map_err(|e| e.to_string())?;
        match doc {
            Some(_) => Ok(true),
            None => Ok(false),
        }
    }

    async fn find_element_by_child_id(
        param_child: &str,
        child_id: ObjectId,
    ) -> Result<Self, String> {
        let collection = Self::collection().await;
        let filter = doc! {param_child: {"$elemMatch": {"_id": child_id}}};
        let doc = collection
            .find_one(filter)
            .await
            .map_err(|e| e.to_string())?;
        match doc {
            Some(doc) => Ok(doc),
            None => Err("Documento não encontrado".to_string()),
        }
    }

    async fn find_child<T>(param_child: &str, child_id: ObjectId) -> Result<T, String> 
    where
        T: Serialize + DeserializeOwned,
        
    {
        let collection = Self::collection().await;
        let filter = doc! {param_child: {"$elemMatch": {"_id": child_id}}};
        let doc = collection
            .find_one(filter)
            .await
            .map_err(|e| e.to_string())?;
        match doc {
            Some(doc) => {
                let serialized_doc = doc.serialize_crudable()?;
                let childs = serialized_doc[param_child].as_array();
                if childs.is_none() {
                    return Err("Documento não encontrado".to_string());
                }
                let childs = childs.unwrap();
                for child in childs {
                   let id = child["_id"].as_str().unwrap();
                    if id == child_id.to_hex() {
                        let deserialized: Result<T, serde_json::Error> = serde_json::from_value(child.clone());
                        match deserialized {
                            Ok(deserialized) => return Ok(deserialized),
                            Err(e) => return Err(e.to_string()),
                        }
                    }




                    
                }
                Err("Documento não encontrado".to_string())
                
            }


            None => Err("Documento não encontrado".to_string()),
        }
        
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
