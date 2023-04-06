import { NextApiRequest, NextApiResponse } from 'next'
import { request, gql } from 'graphql-request'
import Cors from 'cors'
import crypto from 'crypto'
import environment from 'environment';
import { ethers } from 'ethers';

const cors = Cors({
    origin: ['https://*.gig.io', 'https://*.moonpay.com'],
    methods: ['POST', 'GET', 'HEAD'],
    allowedHeaders: ['Content-Type', 'X-SIGNATURE-V2', 'X-TIMESTAMP']
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

    const SIGNATURE_VALID_FOR = 30

    const getTimestamp = (): number => {
        return Math.round(new Date().getTime() / 1000)
    }
    
    const validateTimestamp = (timestamp: number): boolean => {
        return getTimestamp() - timestamp <= SIGNATURE_VALID_FOR
    }
    
    const generateSignature = (
        secretKey: string,
        uri: string,
        method: string,
        timestamp: number,
        body?: string
    ): string => {
        let payload = `${method};${uri};${timestamp}`
        if(body){
            payload += `;${body}`
        }
        return crypto
            .createHmac('sha256', secretKey)
            .update(payload)
            .digest('hex')
    }
    
    const verifySignature = (
        signature: string,
        secretKey: string,
        uri: string,
        method: string,
        timestamp: number,
        body?: string
    ): boolean => {
        const generatedSignature = generateSignature(
            secretKey,
            uri,
            method,
            timestamp,
            body
        )
        if(
            !crypto.timingSafeEqual(
                Buffer.from(generatedSignature, 'hex'),
                Buffer.from(signature, 'hex')
            )
        ){
            return false
        }
        if(!validateTimestamp(timestamp)){
            return false
        }
        return true
    }

    if(req){

        await runMiddleware(req,res,cors)
        
        const timestamp: (number|undefined) = req.query.timestamp ? Number(req.query.timestamp.toString()) : undefined
        const signature: (string|undefined) = req.query.signature ? req.query.signature.toString() : undefined
        const path: (string|undefined) = req.url ? req.url : undefined
        const method: (string|undefined) = req.method ? req.method : undefined

        if(timestamp && signature && path && method){

            const valid = verifySignature(
                signature,
                environment.MOONPAY_SECRET,
                path,
                method,
                timestamp,
                req.body
            )

            if(valid){

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
            }else{

                res
                    .status(500)
                    .json({error: 'Signature not valid', reqHeaders: {
                        timestamp,
                        signature,
                        path,
                        method
                    }})

            }
        }else{

            res
                .status(500)
                .json({error: 'Missing headers', reqHeaders: {
                    timestamp,
                    signature,
                    path,
                    method
                }})

        }
    }else{

        res
            .status(500)
            .json({error: 'No request'})

    }
}

export const config = {
    api: {
      bodyParser: false,
    },
}

export default asset_info;