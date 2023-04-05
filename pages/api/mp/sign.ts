import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import environment from 'environment'

export default async function sign(
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<any> {

    if(req){
        const urlToSign = req.query.url ? req.query.url.toString() : undefined
        if(urlToSign){
          const sign = crypto
                          .createHmac('sha256', environment.MOONPAY_SECRET)
                          .update(urlToSign)
                          .digest('base64')
          console.log(`URL to sign: ${urlToSign}`)
          console.log(`Signature: ${sign}`)
          res
            .status(200)
            .json({ signature: encodeURIComponent(sign) })
        }else{
          res
            .status(500)
            .json({error: 'No URL to sign'})
        }

    }else{
      res
        .status(500)
        .json({error: 'No request received'})
    }

  }

  export const config = {
    api: {
      bodyParser: false,
    },
  }