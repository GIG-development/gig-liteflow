import { NextApiRequest, NextApiResponse } from 'next'

export default async function sign(
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<any> {
    console.log('test')
    if(req){
        res
            .status(200)
            .json({ test: 'Test' })
    }
    res.status(301).end()
  }

  export const config = {
    api: {
      bodyParser: false,
    },
  }