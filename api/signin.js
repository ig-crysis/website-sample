import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // --- Parse URL-encoded form data ---
      let body = "";
      await new Promise((resolve) => {
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", resolve);
      });

      const params = new URLSearchParams(body);
      const username = params.get("username");
      const email = params.get("email");
      const password = params.get("password");

      console.log("Received:", { username, email, password });

      // --- Validation ---
      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // --- Connect to MongoDB ---
      await client.connect();
      const db = client.db("websiteDB");
      const users = db.collection("users");

      // --- Check if user already exists ---
      const existing = await users.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "User already exists" });
      }

      // --- Save new user ---
      await users.insertOne({ username, email, password });

      return res.status(200).json({ message: "Account created successfully!" });
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
