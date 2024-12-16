import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Menghapus cookie 'role' saat logout
  res.setHeader('Set-Cookie', serialize('role', '', {
    path: '/',
    httpOnly: true,
    expires: new Date(0),  // Menetapkan waktu kedaluwarsa cookie ke waktu yang sudah lewat
  }));

  return res.status(200).json({ message: 'Logout berhasil' });
}
