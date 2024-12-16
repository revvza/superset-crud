import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const frameRoles = await db('FRAMEROLE').select('*');
        return res.status(200).json(frameRoles);
      } catch (error) {
        console.error('Error fetching frame roles:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

    case 'POST':
      try {
        const { frame_id, role_id } = req.body;

        if (!frame_id || !role_id) {
          return res.status(400).json({ message: 'frame_id and role_id are required' });
        }

        const [frameRoleId] = await db('FRAMEROLE').insert({ frame_id, role_id });
        return res.status(201).json({ framerole_id: frameRoleId });
      } catch (error) {
        console.error('Error creating frame role:', error);
        return res.status(500).json({ message: 'Error creating frame role' });
      }

    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default handler;