import { NextApiRequest, NextApiResponse } from 'next';
import knex from '@/lib/db'; // Pastikan path sesuai
import * as cookie from 'cookie';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const cookies = cookie.parse(req.headers.cookie || '');
    const role = cookies.role;

    if (!role) {
      return res.status(403).json({ error: 'Unauthorized' }); // Unauthorized jika role tidak ditemukan
    }

    try {
      // Mengambil data frames berdasarkan role yang ada di cookie
      const frames = await knex('frame')
        .join('framerole', 'frame.frame_id', '=', 'framerole.frame_id')
        .join('role', 'framerole.role_id', '=', 'role.role_id')
        .where('role.role_name', role) // Menyesuaikan role yang ada di cookie
        .select('frame.frame_id', 'frame.frame_name', 'frame.frame_url');

      if (frames.length > 0) {
        // Set cookie 'frames' jika ada frames yang ditemukan
        res.setHeader('Set-Cookie', [
          cookie.serialize('frames', JSON.stringify(frames), {
            httpOnly: true, // Cookie hanya dapat diakses oleh server
            secure: process.env.NODE_ENV === 'production', // Menggunakan secure cookie di production
            maxAge: 60 * 60 * 24, // 1 hari
            path: '/', // Bisa diakses di seluruh aplikasi
          }),
        ]);
      }

      return res.status(200).json(frames); // Mengirimkan data frames
    } catch (error) {
      console.error('Error fetching frames:', error);
      return res.status(500).json({ error: 'Internal server error' }); // Penanganan error jika query gagal
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' }); // Jika metode selain GET dipanggil
  }
};

export default handler;
