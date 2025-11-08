import clientPromise from "./mongodb.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
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

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const client = await clientPromise;
    const db = client.db("websiteDB");
    const users = db.collection("users");

    const existing = await users.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    await users.insertOne({ username, email, password });
    return res.status(200).json({ message: "Account created successfully!" });
  } catch (err) {
    console.error("Error in signup:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
