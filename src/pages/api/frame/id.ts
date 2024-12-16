import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { method } = req;

  if (!id) {
    return res.status(400).json({ message: 'Frame ID is required' });
  }

  switch (method) {
    case 'GET':
      try {
        const frame = await db('FRAME').where('frame_id', id).first();
        if (!frame) return res.status(404).json({ message: 'Frame not found' });
        res.status(200).json(frame);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching frame' });
      }
      break;

    case 'PUT':
      try {
        const { frame_name, frame_url } = req.body;
        const result = await db('FRAME').where('frame_id', id).update({ frame_name, frame_url });

        if (result === 0) {
          return res.status(404).json({ message: 'Frame not found or no changes made' });
        }

        res.status(200).json({ message: 'Frame updated successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating frame' });
      }
      break;

    case 'DELETE':
      try {
        const result = await db('FRAME').where('frame_id', id).delete();
        if (result === 0) {
          return res.status(404).json({ message: 'Frame not found or already deleted' });
        }
        res.status(200).json({ message: 'Frame deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting frame' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
