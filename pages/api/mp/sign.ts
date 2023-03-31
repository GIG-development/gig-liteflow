import { NextApiRequest, NextApiResponse } from 'next'

export default async function notification(
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<void> {
    res.status(200).json({ test: 'Test', request: req })
  }