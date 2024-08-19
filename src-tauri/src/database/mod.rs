pub mod entities;
pub mod traits;
use dotenv::dotenv;
use mongodb::options::ClientOptions;
use mongodb::{Client, Database};
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

