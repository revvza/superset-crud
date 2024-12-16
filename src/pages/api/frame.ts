import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const frames = await db('FRAME').select('frame_id', 'frame_name', 'frame_url');
      return res.status(200).json(frames);
    } catch (error) {
      console.error('Error fetching frames:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { frame_name, frame_url } = req.body;
      const [frame_id] = await db('FRAME').insert({ frame_name, frame_url });
      return res.status(201).json({ frame_id });
    } catch (error) {
      console.error('Error creating frame:', error);
      return res.status(500).json({ message: 'Error creating frame' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
};

export default handler;
