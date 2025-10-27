import { MongoClient, Db, Collection } from "mongodb";

const uri = process.env.MONGO_URI;
const dbName = "betting";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  if (!uri) throw new Error("❌ MONGO_URI not set in environment");

  if (!client) {
    try {
      client = new MongoClient(uri);
      await client.connect();
      db = client.db(dbName);
      console.log("✅ Connected to MongoDB");
    } catch (err) {
      console.error("❌ Failed to connect to MongoDB:", err);
      throw err;
    }
  }

  return client;
}

export async function getDb(): Promise<Db> {
  if (!db) {
    await getMongoClient();
  }
  if (!db) {
    throw new Error("❌ Database instance not initialized");
  }
  return db;
}

export async function getBetsCollection(): Promise<Collection> {
  const database = await getDb();
  return database.collection("bets");
}
