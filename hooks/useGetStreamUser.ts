import { useCallback, useState } from 'react'
import { connect, StreamFeed, DefaultGenerics} from 'getstream'
import environment from 'environment'

export default function useGetStreamUser(): (account: string) => any  {
    const [streamUser, setStreamUser] = useState<StreamFeed<DefaultGenerics>>()
    const getStreamUser = useCallback(
        (account): any => {
            if(account){
                void fetch(`/api/social/createUserToken/?userWalletAddress=${account}`)
                .catch(err => {
                    throw(new Error(err))
                })
                .then(res=>res.json())
                .then(data => {
                    const streamUserClient = connect(
                        environment.STREAM_API_KEY,
                        data.streamUserToken,
                        environment.STREAM_APP_ID
                      )
                      const streamUser = streamUserClient.feed('user', account || '')
                      setStreamUser(streamUser)
                        return streamUser
                })
            }
        }, 
        [streamUser]
      )
    return getStreamUser
}