import { useCallback, useState } from 'react'
import { Signer } from '@ethersproject/abstract-signer'
import environment from 'environment'

export default function useMoonpayCheckout(): (
    assetId: string,
    signer: Signer | undefined
) => any {
        const [moonpaySignedUrl, setMoonpaySignedUrl] = useState('')
        const getMoonpaySignerUrl = useCallback(
            (assetId, signer): string => {
                if(signer && assetId){
                    signer.getAddress().then( (walletAddress: string)  => {
                        fetch(`${environment.MOONPAY_ENDPOINT}/sign?apiKey=${environment.MOONPAY_API_KEY}&contractAddress=${assetId.split("-")[1]}&tokenId=${assetId.split("-")[2]}&listingId=${assetId}&walletAddress=${walletAddress}`)
                        .then(res => res?.json())
                        .then((data: { signature: string, fullUrlWithoutSignature: string}) => {
                            setMoonpaySignedUrl(`${data?.fullUrlWithoutSignature}&signature=${data?.signature}`)
                        })
                        .catch(e => console.error(e))
                    })
                    .catch((e: Error) => console.error(e))
                }
                return moonpaySignedUrl
            }, 
            [moonpaySignedUrl]
          )
        
    return getMoonpaySignerUrl
}