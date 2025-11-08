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
    const email = params.get("usermail");
    const password = params.get("pwd");

    const client = await clientPromise;
    const db = client.db("websiteDB");
    const user = await db.collection("users").findOne({ email, password });

    if (user) {
      return res.status(200).json({ message: "Login successful!" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Error in login:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
