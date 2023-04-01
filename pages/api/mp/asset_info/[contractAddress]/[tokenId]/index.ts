import { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import environment from 'environment';

const client = new ApolloClient({
    uri: environment.GRAPHQL_URL,
    cache: new InMemoryCache()
  });

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

        const contractAddress: string = req.query.contractAddress ? req.query.contractAddress.toString() : ''
        const tokenId: string = req.query.tokenId ? req.query.tokenId.toString() : ''
        //const listingId: string = req.query.listingId ? req.query.listingId.toString() : ''

        const query = gql`
            query GetAssetInfo {
                asset(id: "5-0x6188453fa8bb443e32d5d52dff9ee7c440380f97-45387924270393257389334086320371254840416599882299913161774614679165044293936"){
                    id
                    name
                    image
                    chainId
                    tokenId
                    tokenUri
                    collection {
                        name
                    }
                    creatorAddress
                    sales {
                        nodes {
                            id
                            unitPrice
                            expiredAt
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
        const { data } = await client.query({
            query: query
        });

        data 
        ? res
            .status(200)
            .json({ 
                tokenId: tokenId,
                contractAddress: contractAddress,
                name: data.asset.name,
                collection: data.asset.collection.name,
                imageUrl: data.asset.image,
                explorerUrl: `${environment.BLOCKCHAIN_EXPLORER_URL}/token/${contractAddress}?a=${tokenId}`,
                price: data.asset.sales.nodes[0].unitPrice,
                priceCurrencyCode: 'ETH',
                quantity: data.asset.sales.nodes[0].availableQuantity,
                sellerAddress: data.asset.sales.nodes[0].maker.address,
                sellType: 'secondary',
                flow: 'Direct',
                network: 'eth'
            })
        : res.status(500).end()

    }
    res.status(500).end()
}

export const config = {
    api: {
      bodyParser: false,
    },
}

export default asset_info;