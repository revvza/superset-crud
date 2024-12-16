import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { method } = req;

  if (!id) {
    return res.status(400).json({ message: 'Role ID is required' });
  }

  switch (method) {
    case 'GET':
      try {
        const role = await db('ROLE').where('role_id', id).first();
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.status(200).json(role);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching role' });
      }
      break;

    case 'PUT':
      try {
        const { role_name, description } = req.body;
        const result = await db('ROLE').where('role_id', id).update({ role_name, description });

        if (result === 0) {
          return res.status(404).json({ message: 'Role not found or no changes made' });
        }

        res.status(200).json({ message: 'Role updated successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating role' });
      }
      break;

    case 'DELETE':
      try {
        const result = await db('ROLE').where('role_id', id).delete();
        if (result === 0) {
          return res.status(404).json({ message: 'Role not found or already deleted' });
        }
        res.status(200).json({ message: 'Role deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting role' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
