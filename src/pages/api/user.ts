import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const users = await db('USER').select('user_id', 'username');
      return res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;
      const [user_id] = await db('USER').insert({ username, password });
      return res.status(201).json({ user_id });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ message: 'Error creating user' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const result = await db('USER').where('user_id', id).delete();

      if (result === 0) {
        return res.status(404).json({ message: 'User not found or already deleted' });
      }

      return res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Error deleting user' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id } = req.query; // Ambil ID dari query params
      if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const { username, password } = req.body; // Ambil data dari body
      const result = await db('USER')
        .where('user_id', id)
        .update({ username, password });

      if (result === 0) {
        return res.status(404).json({ message: 'User not found or no changes made' });
      }

      return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Error updating user' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
};

export default handler;
