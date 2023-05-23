import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/node'
import { useCallback } from 'react'

type UploadFn = (
  file: File | string,
  options?: { protected?: boolean },
) => Promise<string>

export default function useIPFSUploader(uploadUrl: string): [UploadFn] {
  const upload = useCallback<UploadFn>(
    async (file, options) => {
        try{
            if (typeof file === 'string') {
                const gatewayTools = new IPFSGatewayTools()
                const { cid, containsCid } = gatewayTools.containsCID(file)
                return containsCid ? cid : undefined
              }
              const formData = new FormData()
              formData.append('file', file)
              formData.append('protected', options?.protected ? 'true' : 'false')
              const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
              })
              const result = await response.json()
              if(response.ok){
                return result.cid
              }else{
                throw new Error(response.statusText)
              }
        }catch(e){
            console.error(e)
        }
    },
    [uploadUrl],
  )

  return [upload]
}