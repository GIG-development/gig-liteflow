import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import environment from 'environment'

export default async function sign(
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<any> {
    if(req){
        const walletAddress = req.query.ethAddress ? req.query.ethAddress : ''
        const contractAddress = req.query.contractAddress ? req.query.contractAddress : ''
        const listingId = req.query.listingId ? req.query.listingId : ''
        const tokenId = req.query.tokenId ? req.query.tokenId : ''
        const pk = environment.MOONPAY_API_KEY
        const sk = environment.MOONPAY_SECRET
        const oUrl = `https://buy-sandbox.moonpay.com/nft?apiKey=${pk}&walletAddress=${walletAddress}&contractAddress=${contractAddress}&tokenId=${tokenId}&listingId=${listingId}`
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