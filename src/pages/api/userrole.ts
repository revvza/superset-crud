import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const userRole = await db('USERROLE').select('*');
        if (!userRole) return res.status(404).json({ message: 'User Role not found' });
        res.status(200).json(userRole);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user role' });
      }
      break;

      case 'POST':
        try {
          const { user_id, role_id } = req.body;
  
          if (!user_id || !role_id) {
            return res.status(400).json({ message: 'user_id and role_id are required' });
          }
  
          const [userRoleId] = await db('USERROLE').insert({ user_id, role_id });
          return res.status(201).json({ userrole_id: userRoleId });
        } catch (error) {
          console.error('Error creating user role:', error);
          return res.status(500).json({ message: 'Error creating user role' });
        }
  
      default:
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
  };
  
export default handler;