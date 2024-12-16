import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const roles = await db('ROLE').select('*');
        res.status(200).json(roles);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching roles' });
      }
      break;

    case 'POST':
      try {
        const { role_name, description } = req.body;

        if (!role_name || !description) {
          return res.status(400).json({ message: 'Role name and description are required' });
        }

        const [roleId] = await db('ROLE').insert({ role_name, description });
        return res.status(201).json({ role_id: roleId });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating role' });
      }

    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
