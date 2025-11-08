export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, feedback } = req.body;

    if (!name || !feedback) {
      return res.status(400).json({ message: 'Name and feedback required' });
    }

    return res.status(200).json({ message: 'Thanks for your feedback!' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
