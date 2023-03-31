import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import environment from 'environment'

export default async function sign(
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<any> {
    if(req){
        const pk = environment.MOONPAY_API_KEY
        const sk = environment.MOONPAY_SECRET
        const oUrl = `https://buy-sandbox.moonpay.com/nft?apiKey=${pk}`
        const sign = crypto
                        .createHmac('sha256', sk)
                        .update(new URL(oUrl).search)
                        .digest('base64')
        const sUrl = `${oUrl}&signature=${encodeURIComponent(sign)}`

        res
            .status(200)
            .json({ sUrl: sUrl })
    }
    res.status(500).end()
  }

  export const config = {
    api: {
      bodyParser: false,
    },
  }