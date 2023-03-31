import { NextApiRequest, NextApiResponse } from 'next'

export default async function sign(
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<void> {
    if(req)
        res
            .status(200)
            .json({ test: 'Test', request: req })
  }