export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    return res.status(200).json({ message: 'Message sent successfully!' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
