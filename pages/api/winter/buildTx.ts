import { NextApiRequest, NextApiResponse } from 'next'
import { request, gql } from 'graphql-request'
import Cors from 'cors'
import environment from 'environment';

const cors = Cors({
  origin: ['https://*.gig.io', '*'],
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

export default async function buildTx(
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<any> {
    await runMiddleware(req,res,cors)
    const endpoint = environment.GRAPHQL_URL

    if(req){
        const assetId = req.query.tokenId ? encodeURIComponent(req.query.tokenId.toString())  : undefined
        const tokenId = assetId?.split('-')[2]
        const contractAddress = (req.query.contractAddress && req.query.contractAddress == assetId?.split('-')[1]) ? encodeURIComponent(req.query.contractAddress.toString()) : undefined
        const buyerWalletAddress = req.query.buyerWalletAddress ? encodeURIComponent(req.query.buyerWalletAddress.toString()) : undefined
        const quantity = req.query.quantity ? encodeURIComponent(req.query.quantity.toString()) : 1

        if(tokenId && contractAddress && buyerWalletAddress){

            const variablesForQuery1 = { listingId: assetId }
            const query1 = gql`
                query GetAssetInfo ($listingId: String!) {
                    asset(id: $listingId){
                        sales {
                            nodes {
                                id
                            }
                        }
                    }
                }
            `
            const { asset } = await request(endpoint, query1, variablesForQuery1)
            const offerId = asset.sales.nodes[0].id
    
            const variablesForQuery2 = { offerId: offerId, accountAddress: buyerWalletAddress, quantity: quantity }
            console.log(variablesForQuery2)
            const query2 = gql`
                mutation BuildTx ($offerId: String!, $accountAddress: Address!, $quantity: Uint256!) {
                    createOfferFillTransaction(offerId: $offerId, accountAddress: $accountAddress, quantity: $quantity){
                        transaction {
                            to
                            from
                            data
                            gasPrice
                            value
                        }
                    }
                }
            `
            const { createOfferFillTransaction } = await request(endpoint, query2, variablesForQuery2)

            res
                .status(200)
                .json({ 
                  gigTx: createOfferFillTransaction
                })
        }else{
          res
            .status(500)
            .json({error: 'No parameters to build Tx'})
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