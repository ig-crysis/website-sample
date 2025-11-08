import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);

export default async function handler(req, res) {
  if (req.method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk.toString()));
    req.on("end", async () => {
      const params = new URLSearchParams(body);
      const email = params.get("email");
      const password = params.get("password");

      await client.connect();
      const db = client.db("websiteDB");
      const user = await db.collection("users").findOne({ email, password });

      if (user) {
        return res.status(200).json({ message: "Login successful!" });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
