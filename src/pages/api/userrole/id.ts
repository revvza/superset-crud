import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { method } = req;

  if (!id) {
    return res.status(400).json({ message: 'User Role ID is required' });
  }

  switch (method) {
    case 'GET':
      try {
        const userRole = await db('USERROLE').where('userrole_id', id).first();
        if (!userRole) return res.status(404).json({ message: 'User Role not found' });
        res.status(200).json(userRole);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user role' });
      }
      break;

    case 'PUT':
      try {
        const { user_id, role_id } = req.body;
        const result = await db('USERROLE').where('userrole_id', id).update({ user_id, role_id });

        if (result === 0) {
          return res.status(404).json({ message: 'User Role not found or no changes made' });
        }

        res.status(200).json({ message: 'User Role updated successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user role' });
      }
      break;

    case 'DELETE':
      try {
        const result = await db('USERROLE').where('userrole_id', id).delete();
        if (result === 0) {
          return res.status(404).json({ message: 'User Role not found or already deleted' });
        }
        res.status(200).json({ message: 'User Role deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user role' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
