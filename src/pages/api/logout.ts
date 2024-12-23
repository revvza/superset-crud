import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set cookie headers untuk menghapus 'role' dan 'frames'
  const cookies = [
    serialize('role', '', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Hanya gunakan secure di production
      expires: new Date(0), // Menghapus cookie
    }),
    serialize('frames', '', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
    }),
    serialize('session', '', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
    }),
  ];

  res.setHeader('Set-Cookie', cookies);

  // Kembalikan respon sukses
  return res.status(200).json({ message: 'Logout berhasil' });
}
