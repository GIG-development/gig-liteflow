import environment from 'environment'
import { useCallback } from 'react'
import {
    useUpdateCollectionMutation
} from '../graphql'
import useIPFSUploader from './useUploadToIPFS'

type CollectionPatch = {
    name?: string
    description?: string
    image?: File | string
    cover?: File | string
    twitter?: string
    website?: string
    discord?: string
}

export default function useUpdateCollection(uploadUrl: string, address: string): (collection: CollectionPatch) => any {
    
    const [updateCollectionMutation] = useUpdateCollectionMutation()
    const [uploadFile] = useIPFSUploader(uploadUrl)

    const updateCollection = useCallback(
        async (inputs: CollectionPatch) => {
            const [imageIPFShash, coverIPFShash] = await Promise.all([
                inputs.image ? uploadFile(inputs.image) : undefined,
                inputs.cover ? uploadFile(inputs.cover) : undefined,
            ])

            const { data } = await updateCollectionMutation({
                variables: {
                    input: {
                        clientMutationId: null,
                        address: address,
                        chainId: environment.CHAIN_ID,
                        patch: {
                            name: inputs.name || null,
                            description: inputs.description || null,
                            twitter: inputs.twitter || null,
                            discord: inputs.discord || null,
                            website: inputs.website || null,
                            image: imageIPFShash ? `ipfs://${imageIPFShash}` : null,
                            cover: coverIPFShash ? `ipfs://${coverIPFShash}` : null,
                        }
                    }
                }
            })
            return data
        },
        [updateCollectionMutation],
    )
        
    return updateCollection
}