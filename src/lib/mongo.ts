import { MongoClient, Db, Collection } from "mongodb";

const uri = process.env.MONGO_URI || "your-mongodb-uri-here";
const dbName = "betting";

let client: MongoClient;
let db: Db;

export async function getMongoClient(): Promise<MongoClient> {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log("Connected to MongoDB");
  }
  return client;
}

export async function getDb(): Promise<Db> {
  if (!db) {
    await getMongoClient();
  }
  return db;
}

export async function getBetsCollection(): Promise<Collection> {
  const database = await getDb();
  return database.collection("bets");
}
