import { Box, Button, Flex, SimpleGrid, Heading } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import invariant from 'ts-invariant'
import Head from '../../../components/Head'
import UserProfileTemplate from '../../../components/Profile'
import {
  convertAsset,
  convertAuctionWithBestBid,
  convertFullUser,
  convertSale,
  convertUser,
} from '../../../convert'
import environment from '../../../environment'
import {
  AssetsOrderBy,
  useFetchCreatedCollectionsQuery,
} from '../../../graphql'
import useEagerConnect from '../../../hooks/useEagerConnect'
import useExecuteOnAccountChange from '../../../hooks/useExecuteOnAccountChange'
import useOrderByQuery from '../../../hooks/useOrderByQuery'
import usePaginateQuery from '../../../hooks/usePaginateQuery'
import useSigner from '../../../hooks/useSigner'
import LargeLayout from '../../../layouts/large'
import { wrapServerSideProps } from '../../../props'
import { connect, StreamFeed, DefaultGenerics} from 'getstream'
import Image from 'components/Image/Image'
import Link from 'components/Link/Link'
import Empty from 'components/Empty/Empty'

type Props = {
  userAddress: string
  currentAccount: string | null
  now: string
}

export const getServerSideProps = wrapServerSideProps<Props>(
  environment.GRAPHQL_URL,
  async (ctx) => {

    const userAddress: (string|null|undefined) = ctx.params?.id
      ? Array.isArray(ctx.params.id)
        ? ctx.params.id[0]?.toLowerCase()
        : ctx.params.id.toLowerCase()
      : null
    invariant(userAddress, 'userAddress is falsy')
    const now = new Date()

    return {
      props: {
        userAddress,
        currentAccount: ctx.user.address,
        now: now.toJSON(),
      },
    }
  },
)

const CreatedPage: NextPage<Props> = ({
  userAddress,
  currentAccount,
  now
}) => {
  const ready = useEagerConnect()
  const signer = useSigner()
  const { t } = useTranslation('templates')
  const { replace } = useRouter()
  const { limit, offset } = usePaginateQuery()
  const orderBy = useOrderByQuery<AssetsOrderBy>('CREATED_AT_DESC')
  const { account } = useWeb3React()

  const [streamUserToken, setStreamUserToken] = useState()
  const getStreamUserToken = async (account: (string|null|undefined)) => {
    if(account){
      void fetch(`/api/social/createUserToken/?userWalletAddress=${account}`)
      .catch(err => {
        throw(new Error(err))
      })
      .then(res=>res.json())
      .then(data => {
        setStreamUserToken(data.streamUserToken)
      })
    }
  }

  useEffect(()=>{
    if(account){
      void getStreamUserToken(account)
    }
  },[account])

  const [streamUser, setStreamUser] = useState<StreamFeed<DefaultGenerics>>()
  useEffect(()=>{
    if(streamUserToken && account){
      const streamUserClient = connect(
        environment.STREAM_API_KEY,
        streamUserToken,
        environment.STREAM_APP_ID
      )
      const streamUser = streamUserClient.feed('user', account.toUpperCase())
      setStreamUser(streamUser)
    }
  },[streamUserToken, account])

  const date = useMemo(() => new Date(now), [now])
  const { data, refetch } = useFetchCreatedCollectionsQuery({
    variables: {
        address: userAddress,
        currentAddress: (ready ? account?.toLowerCase() : currentAccount) || '',
        limit,
        offset,
        orderBy,
        now: date,
    },
  })
  useExecuteOnAccountChange(refetch, ready)

  const userAccount = useMemo(
    () => convertFullUser(data?.account || null, userAddress),
    [data, userAddress],
  )

  const assets = useMemo(
    () =>
      (data?.created?.nodes || [])
        .map((x) => ({
          ...convertAsset(x),
          auction: x.auctions?.nodes[0]
            ? convertAuctionWithBestBid(x.auctions.nodes[0])
            : undefined,
          creator: convertUser(x.creator, x.creator.address),
          sale: convertSale(x.firstSale?.nodes[0]),
          numberOfSales: x.firstSale.totalCount,
          hasMultiCurrency:
            parseInt(
              x.currencySales.aggregates?.distinctCount?.currencyId,
              10,
            ) > 1,
        })),
    [data],
  )
  const collections = useMemo(()=>(data?.collections?.nodes || [])
        .map((x)=>({
            name: x.name,
            address: x.address,
            image: x.image,
            chainId: x.chainId,
            description: x.description
        }))
  ,[data])

  useEffect(()=>{
    if (data && !data.collections) replace('/404')
  },[data])

  if (!assets) return <></>
  if (!data) return <></>
  return (
    <main id="user-collections">
      <LargeLayout>
        <Head
          title='Colecciones'
        />

        <UserProfileTemplate
          signer={signer}
          currentAccount={account}
          account={userAccount}
          currentTab="collections"
          totals={
            new Map([
              ['created', data.created?.totalCount || 0],
              ['on-sale', data.onSale?.totalCount || 0],
              ['owned', data.owned?.totalCount || 0],
              ['collections', data.collections?.totalCount || 0]
            ])
          }
          streamUser={streamUser}
        >
            {collections.length > 0
                ? 
                <SimpleGrid
                    flexWrap="wrap"
                    spacing={{ base: 4, lg: 3, xl: 4 }}
                    columns={{ base: 1, sm: 2, md: 4 }}
                    py={6}
                >
                {
                    collections.map((c)=>{
                        return (
                            <Flex key={c.address} justify="center">
                                <Flex 
                                    direction="column"
                                    w="full"
                                    maxW='280px'
                                    align="stretch"
                                    overflow="hidden"
                                    rounded="xl"
                                    borderWidth="1px"
                                    borderColor="gray.200"
                                    bgColor="white"
                                    _hover={{
                                        shadow: '1px 0px 8px 6px #f2f2f2'
                                }}>
                                    <Box position='relative' h='280px'>
                                        {c.image 
                                        ?
                                            <Image src={c.image} layout='fill'/>
                                        :
                                            <Image src={`/no-image.jpg`} layout='fill'/>
                                        }
                                    </Box>
                                    <Flex gap={6} p={6} flexDir='column'>
                                        <Heading
                                            as="h4"
                                            variant="heading2"
                                            color="brand.black"
                                            title={c.name}
                                            isTruncated
                                        >
                                            {c.name}
                                        </Heading>
                                        <Button as={Link} href={`/collection/${c.chainId}/${c.address}`}>
                                            {t('user.created-collections.view')}
                                        </Button>
                                    </Flex>
                                </Flex>
                            </Flex>
                        )
                    })
                }
            </SimpleGrid>
            :
                <Empty
                    title='No Collections'
                    description='You have no Collections yet'
                    button='Explore Collections'
                    href="/explore/collections"
                />
            }
        </UserProfileTemplate>
      </LargeLayout>
    </main>
  )
}

export default CreatedPage
