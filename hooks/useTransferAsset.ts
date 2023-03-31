import { useCallback } from 'react'
import {
    //TransferAssetMutation,
    useTransferAssetMutation
} from '../graphql'

export default function useTransferAsset(): (
        assetId: string,
        from: string,
        to: string,
        quantity: string
    ) => any /*Promise<Data<TransferAssetMutation>>*/ {
    
        const [transferAssetMutation] = useTransferAssetMutation()

        const transferAsset = useCallback(
            async (assetId: string, from: string, to: string, quantity: string) => {
                const { data } = await transferAssetMutation({
                    variables: { assetId, from, to, quantity },
                })
                return data
            },
            [transferAssetMutation],
        )
        
    return transferAsset
}