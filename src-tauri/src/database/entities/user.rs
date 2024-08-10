
use crate::database::{Crudable, Privilege};
use bcrypt;
use bcrypt::DEFAULT_COST;
use mongodb::bson::oid::ObjectId;
use serde::{Serialize, Deserialize};
use mongodb::bson::doc;
use mongodb::Collection;
use async_trait::async_trait;
use mongodb::Database;
use mongodb::bson::{self, Document};



#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub name: String,
    pub email: String,
    pub password_hash: String,
    pub privilege: i8,
}



impl User{
    pub fn new(name: String, email: String, password: String, privilege: i8) -> Self {
        let password_hash = bcrypt::hash(password, DEFAULT_COST).unwrap();
        Self {
            id: None,
            name,
            email,
            password_hash,
            privilege,
        }
    
    }
    pub fn verify_password(&self, password: &str) -> Result<bool, String> {
        let verification = match bcrypt::verify(password, &self.password_hash) {
            Ok(result) => result,
            Err(e) => return Err(e.to_string()),
        };

        Ok(verification)
       
    }
}

#[async_trait]
impl Crudable for User {

    fn collection_name() -> &'static str {
        "users"
    }
    async fn create(&self, db: Database, privilege: Privilege) -> Result<(), String> {
        if (privilege as i8) < (Privilege::SuperUser as i8) {
            return Err("Insufficient privilege".to_string());
        }     
        let collection: Collection<User> = db.collection("users");
        collection.insert_one(self).await.map_err(|e| e.to_string())?;
        Ok(())
    }
    async fn read(id: &str, db: Database) -> Result<Self, String> {
        
        let collection: Collection<User> = db.collection("users");
        collection.find_one(doc! {"_id": id}).await.map(|result| result.unwrap()).map_err(|e| e.to_string())
    }
    async fn update(&self, id: &str, db: Database, privilege: Privilege) -> Result<(), String> {
        if (privilege as i8) < (Privilege::Admin as i8) {
            return Err("Insufficient privilege".to_string());
        }
        let collection: Collection<User> = db.collection("users");
        let user_doc: Document = bson::to_document(self).map_err(|e| e.to_string())?;
        collection.update_one(doc! {"_id": id}, doc! {"$set": user_doc}).await.map_err(|e| e.to_string())?;
        Ok(())
    }
    async fn delete(&self, db: Database, privilege: Privilege) -> Result<(), String> {

        if (privilege as i8) < (Privilege::Admin as i8) {
            return Err("Insufficient privilege".to_string());
        }
        let collection: Collection<User> = db.collection("users");
        collection.delete_one(doc! {"_id": self.id.clone().unwrap()}).await.map_err(|e| e.to_string())?;
        Ok(())
    }

}
