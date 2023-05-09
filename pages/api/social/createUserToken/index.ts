import { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { connect } from 'getstream'
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
        const userWalletAddress = req.query.userWalletAddress ? encodeURIComponent(req.query.userWalletAddress.toString().toUpperCase()) : undefined
        if(userWalletAddress){
            const streamServerClient = connect(
                                        environment.STREAM_API_KEY,
                                        environment.STREAM_API_SECRET,
                                        environment.STREAM_APP_ID,
                                        { location: 'us-east', timeout: 15000 }
                                      )
            const streamUserToken = streamServerClient.createUserToken(userWalletAddress)
            res
                .status(200)
                .json({streamUserToken})
        }else{
          res
            .status(500)
            .json({error: 'No userWalletAddress parameter'})
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