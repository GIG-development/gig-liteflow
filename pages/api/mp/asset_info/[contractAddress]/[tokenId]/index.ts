import { NextApiRequest, NextApiResponse } from 'next'
import { request, gql } from 'graphql-request'
import Cors from 'cors'
import environment from 'environment';
import { ethers } from 'ethers';

const cors = Cors({
    methods: ['POST', 'GET', 'HEAD']
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

const asset_info = async(
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<any> => {

    if(req){

        await runMiddleware(req,res,cors)
        
        //const timestamp: string = req.headers.timestamp ? req.headers.timestamp.toString() : ''
        //const signature: string = req.headers.signature ? req.headers.signature.toString() : ''
        const contractAddress: string = req.query.contractAddress ? req.query.contractAddress.toString() : ''
        const tokenId: string = req.query.tokenId ? req.query.tokenId.toString() : ''
        const listingId: string = req.query.listingId ? req.query.listingId.toString() : ''

        const endpoint = environment.GRAPHQL_URL
        const variablesForQuery = { listingId: listingId }
        const query = gql`
            query GetAssetInfo ($listingId: String!) {
                asset(id: $listingId){
                    id
                    name
                    image
                    chainId
                    tokenId
                    tokenUri
                    collection {
                        name
                    }
                    collectionAddress
                    creatorAddress
                    sales {
                        nodes {
                            unitPrice
                            availableQuantity
                            currency {
                                image
                                name
                                id
                                decimals
                                symbol
                            }
                            maker {
                                image
                                address
                                name
                                verification {
                                    status
                                }
                            }
                        }
                        aggregates {
                            sum {
                            availableQuantity
                            }
                        }
                    }
                }
            }
        `
        try{
            
            const { asset } = await request(endpoint, query, variablesForQuery)

            if (asset) {
                
                if (asset.collectionAddress !== contractAddress) throw new Error('Contract Address mismatch')
                if (asset.tokenId !== tokenId) throw new Error('Token ID mismatch')

                res
                    .status(200)
                    .json({ 
                        tokenId: asset.tokenId,
                        contractAddress: asset.collectionAddress,
                        name: asset.name,
                        collection: asset.collection.name,
                        imageUrl: asset.image,
                        explorerUrl: `${environment.BLOCKCHAIN_EXPLORER_URL}/token/${asset.collectionAddress}?a=${asset.tokenId}`,
                        price: ethers.utils.formatEther(asset.sales.nodes[0].unitPrice).toString(),
                        priceCurrencyCode: asset.sales.nodes[0].currency.symbol,
                        quantity: Number(asset.sales.nodes[0].availableQuantity),
                        sellerAddress: asset.sales.nodes[0].maker.address,
                        sellType: 'Secondary',
                        flow: 'Lite',
                        network: 'Ethereum',
                        tokenType: '',
                        subFlow: ''
                    })

            }else{

                res
                    .status(500)
                    .json({error: 'Something went wrong'})

            }
        }catch(e){

            res
                .status(500)
                .json({error: e})

        }
    }
}

export const config = {
    api: {
      bodyParser: false,
    },
}

export default asset_info;