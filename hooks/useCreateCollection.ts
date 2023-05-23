import { useCallback } from 'react'
import {
    Standard,
    MintType,
    useCreateCollectionMutation
} from '../graphql'

export default function useCreateCollection(): (
        chainId: number,
        name: string,
        symbol: string,
        standard: Standard,
        mintType: MintType
    ) => any /*Promise<Data<TransferAssetMutation>>*/ {
    
        const [createCollectionMutation] = useCreateCollectionMutation()

        const createCollection = useCallback(
            async (chainId: number, name: string, symbol: string, standard: Standard, mintType: MintType) => {
                const { data } = await createCollectionMutation({
                    variables: { chainId, name, symbol, standard, mintType },
                })
                return data
            },
            [createCollectionMutation],
        )
        
    return createCollection
}