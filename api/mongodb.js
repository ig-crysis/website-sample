import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
let client;
let clientPromise;

if (!process.env.MONGO_URI) {
  throw new Error("Please add your Mongo URI to Environment Variables");
}

if (process.env.NODE_ENV === "development") {
  // Use a global variable to reuse the client during hot reloads in dev
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production (Vercel), always create a new client once
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
