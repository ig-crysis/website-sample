import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Parse form data from HTML form
      let body = "";
      req.on("data", chunk => {
        body += chunk.toString();
      });
      req.on("end", async () => {
        const params = new URLSearchParams(body);
        const username = params.get("username");
        const email = params.get("email");
        const password = params.get("password");

        if (!username || !email || !password) {
          return res.status(400).json({ message: "All fields are required" });
        }

        await client.connect();
        const db = client.db("websiteDB");
        const users = db.collection("users");

        // Check if user already exists
        const existingUser = await users.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }

        // Insert new user
        await users.insertOne({ username, email, password });

        return res.status(200).json({ message: "Account created successfully!" });
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
