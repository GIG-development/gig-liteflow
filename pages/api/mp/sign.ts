import { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import crypto from 'crypto'
import environment from 'environment'

const cors = Cors({
  origin: ['https://*.gig.io'],
  methods: ['POST', 'GET', 'HEAD'],
  allowedHeaders: ['Content-Type']
})

const runMiddleware =(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
)=>{
  return new Promise((resolve, reject) => {
      fn(req,res, (result: any) => {
          if(result instanceof Error){
              return reject(result)
          }
          return resolve(result)
      })
  })
}

export default async function sign(
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<any> {
    await runMiddleware(req,res,cors)

    if(req){
      const apiKey = req.query.apiKey ? encodeURIComponent(req.query.apiKey.toString())  : undefined
      const contractAddress = req.query.contractAddress ? encodeURIComponent(req.query.contractAddress.toString()) : undefined
      const tokenId = req.query.tokenId ? encodeURIComponent(req.query.tokenId.toString()) : undefined
      const listingId = req.query.listingId ? encodeURIComponent(req.query.listingId.toString()) : undefined
      const walletAddress = req.query.walletAddress ? encodeURIComponent(req.query.walletAddress.toString()) : undefined

      const url = `https://buy-sandbox.moonpay.com/nft?apiKey=${apiKey}&contractAddress=${contractAddress}&tokenId=${tokenId}&listingId=${listingId}&walletAddress=${walletAddress}`
      
        if(apiKey && contractAddress && tokenId && listingId && walletAddress){
          const sign = crypto
                          .createHmac('sha256', environment.MOONPAY_SECRET)
                          .update(new URL(url).search)
                          .digest('base64')
          res
            .status(200)
            .json({ 
              signature: encodeURIComponent(sign),
              fullUrlWithoutSignature: url
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