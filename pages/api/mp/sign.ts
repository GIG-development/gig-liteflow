import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import environment from 'environment'

export default async function sign(
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<any> {

    if(req){
        const signRequest: string | undefined = req.query.signRequest ? encodeURIComponent(req.query.signRequest.toString()) : undefined
        if(signRequest){
          const sign = crypto
                          .createHmac('sha256', environment.MOONPAY_SECRET)
                          .update(signRequest)
                          .digest('base64')
          res
            .status(200)
            .json({ 
              signature: sign, 
              params: signRequest
            })
        }else{
          res
            .status(500)
            .json({error: 'No signRequest parameter to sign'})
        }

    }else{
      res
        .status(500)
        .json({error: 'No API request received'})
    }

  }

  export const config = {
    api: {
      bodyParser: false,
    },
  }