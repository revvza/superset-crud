import { NextApiRequest, NextApiResponse } from 'next';
import knex from '@/lib/db';
import * as cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
      const result = await knex('user')
        .join('userrole', 'user.user_id', '=', 'userrole.user_id')
        .join('role', 'userrole.role_id', '=', 'role.role_id')
        .where('user.username', username)
        .select('user.*', 'role.role_name')
        .first();

      if (!result) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = result;

      if (!user.role_name) {
        return res.status(500).json({ error: 'Role information missing' });
      }

      if (user.password === password) {
        // Query frames berdasarkan role
        const frames = await knex('frame')
          .join('framerole', 'frame.frame_id', '=', 'framerole.frame_id')
          .join('role', 'framerole.role_id', '=', 'role.role_id')
          .where('role.role_name', user.role_name)
          .select('frame.frame_id', 'frame.frame_name', 'frame.frame_url');

        // Set cookie 'role' dan 'frames'
        res.setHeader('Set-Cookie', [
          cookie.serialize('role', user.role_name, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            path: '/',
          }),
          cookie.serialize('frames', JSON.stringify(frames), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            path: '/',
          }),
        ]);

        return res.status(200).json({ message: 'Login successful' });
      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
