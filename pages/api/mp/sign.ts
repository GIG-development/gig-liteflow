import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import environment from 'environment'

export default async function sign(
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<any> {

    if(req){

        const walletAddress = req.query.walletAddress ? req.query.walletAddress : ''
        const contractAddress = req.query.contractAddress ? req.query.contractAddress : ''
        const listingId = req.query.listingId ? req.query.listingId : ''
        const tokenId = req.query.tokenId ? req.query.tokenId : ''
        
        const oUrl = `/nft?apiKey=${environment.MOONPAY_API_KEY}
                          &contractAddress=${contractAddress}
                          &tokenId=${tokenId}
                          &listingId=${listingId}
                          &walletAddress=${walletAddress}
                      `
        console.log(new URL(oUrl).search)
        const sign = crypto
                        .createHmac('sha256', environment.MOONPAY_SECRET)
                        .update(new URL(oUrl).search)
                        .digest('base64')

        console.log(sign)
        const sUrl = `${oUrl}&signature=${encodeURIComponent(sign)}`

        res
          .status(200)
          .json({ sUrl: sUrl })

    }
    res
      .status(500)
      .json('Something went wrong')
  }

  export const config = {
    api: {
      bodyParser: false,
    },
  }