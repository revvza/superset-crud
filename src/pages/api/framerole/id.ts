import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { method } = req;

  if (!id) {
    return res.status(400).json({ message: 'Frame Role ID is required' });
  }

  switch (method) {
    case 'GET':
      try {
        const frameRole = await db('FRAMEROLE').where('framerole_id', id).first();
        if (!frameRole) return res.status(404).json({ message: 'Frame Role not found' });
        res.status(200).json(frameRole);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching frame role' });
      }
      break;

    case 'PUT':
      try {
        const { frame_id, role_id } = req.body;
        const result = await db('FRAMEROLE').where('framerole_id', id).update({ frame_id, role_id });

        if (result === 0) {
          return res.status(404).json({ message: 'Frame Role not found or no changes made' });
        }

        res.status(200).json({ message: 'Frame Role updated successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating frame role' });
      }
      break;

    case 'DELETE':
        try {
            const result = await db('FRAMEROLE').where('framerole_id', id).delete();
            if (result === 0) {
              return res.status(404).json({ message: 'Frame Role not found or already deleted' });
            }
            res.status(200).json({ message: 'Frame Role deleted successfully' });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error deleting frame role' });
          }
          break;
    
        default:
          res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
          res.status(405).end(`Method ${method} Not Allowed`);
      }
    }