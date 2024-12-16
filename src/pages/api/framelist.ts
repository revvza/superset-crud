import { NextApiRequest, NextApiResponse } from 'next';
import knex from '@/lib/db'; // Pastikan knex dikonfigurasi dengan benar
import * as cookie from 'cookie';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const cookies = cookie.parse(req.headers.cookie || '');
    const role = cookies.role;

    if (!role) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
      const frames = await knex('frame')
        .join('framerole', 'frame.frame_id', '=', 'framerole.frame_id')
        .join('role', 'framerole.role_id', '=', 'role.role_id')
        .where('role.role_name', role)
        .select('frame.frame_id', 'frame.frame_name', 'frame.frame_url');

      return res.status(200).json(frames);
    } catch (error) {
      console.error('Error fetching frames:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default handler;