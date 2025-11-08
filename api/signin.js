export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    return res.status(200).json({ message: 'Account created successfully!' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
