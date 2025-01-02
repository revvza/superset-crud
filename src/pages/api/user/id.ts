import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const { method } = req;
  
    console.log('Received method:', method, 'and id:', id);
  
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

  switch (method) {
    case 'GET': 
      try {
        const user = await db('USER').where('user_id', id).first();
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
      } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Error fetching user' });
      }
      break;

    case 'POST': 
      try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [user_id] = await db('USER').insert({ username, password: hashedPassword });
        res.status(201).json({ user_id });
      } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Error creating user' });
      }
      break;

    case 'PUT': 
      try {
        const { username, password } = req.body;
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
        await db('USER').where('user_id', id).update({ username, password: hashedPassword });
        res.status(200).json({ message: 'User updated' });
      } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Error updating user' });
      }
      break;

      case 'DELETE':
      try {
        const result = await db('USER').where('user_id', id).delete();
        
        if (result === 0) {
          return res.status(404).json({ message: 'User not found or already deleted' });
        }

        return res.status(200).json({ message: 'User deleted' });
      } catch (error) {
        console.error('Error during delete:', error);
        return res.status(500).json({ message: 'Error deleting user' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
