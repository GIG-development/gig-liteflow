import { Text } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { NextPage } from 'next'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import invariant from 'ts-invariant'
import Head from '../../../components/Head'
import UserProfileTemplate from '../../../components/Profile'
import TokenGrid from '../../../components/Token/Grid'
import {
  convertAsset,
  convertAuctionWithBestBid,
  convertFullUser,
  convertSale,
  convertUser,
} from '../../../convert'
import environment from '../../../environment'
import {
  AssetDetailFragment,
  AssetsOrderBy,
  FetchCreatedAssetsDocument,
  FetchCreatedAssetsQuery,
  useFetchCreatedAssetsQuery,
} from '../../../graphql'
import useEagerConnect from '../../../hooks/useEagerConnect'
import useExecuteOnAccountChange from '../../../hooks/useExecuteOnAccountChange'
import useOrderByQuery from '../../../hooks/useOrderByQuery'
import usePaginate from '../../../hooks/usePaginate'
import usePaginateQuery from '../../../hooks/usePaginateQuery'
import useSigner from '../../../hooks/useSigner'
import LargeLayout from '../../../layouts/large'
import { getLimit, getOffset, getOrder } from '../../../params'
import { wrapServerSideProps } from '../../../props'
import { connect, StreamFeed, DefaultGenerics} from 'getstream'

type Props = {
  userAddress: string
  currentAccount: string | null
  now: string
  meta: {
    title: string
    description: string
    image: string
  }
}

export const getServerSideProps = wrapServerSideProps<Props>(
  environment.GRAPHQL_URL,
  async (ctx, client) => {

    const userAddress: (string|null|undefined) = ctx.params?.id
      ? Array.isArray(ctx.params.id)
        ? ctx.params.id[0]?.toLowerCase()
        : ctx.params.id.toLowerCase()
      : null
    invariant(userAddress, 'userAddress is falsy')

    const limit = getLimit(ctx, environment.PAGINATION_LIMIT)
    const orderBy: any = getOrder<AssetsOrderBy>(ctx, 'CREATED_AT_DESC')
    const offset = getOffset(ctx, environment.PAGINATION_LIMIT)

    const now = new Date()
    const { data, error } = await client.query<FetchCreatedAssetsQuery>({
      query: FetchCreatedAssetsDocument,
      variables: {
        address: userAddress.toLowerCase(),
        currentAddress: ctx.user.address || '',
        now,
        limit,
        offset,
        orderBy,
      },
    })
    if (error) throw error
    if (!data) throw new Error('data is falsy')
    return {
      props: {
        userAddress,
        currentAccount: ctx.user.address,
        now: now.toJSON(),
        meta: {
          title: data.account?.name || userAddress,
          description: data.account?.description || '',
          image: data.account?.image || '',
        }
      },
    }
  },
)

const CreatedPage: NextPage<Props> = ({
  meta,
  now,
  userAddress,
  currentAccount
}) => {
  const ready = useEagerConnect()
  const signer = useSigner()
  const { t } = useTranslation('templates')
  const { pathname, replace, query } = useRouter()
  const { limit, offset, page } = usePaginateQuery()
  const orderBy = useOrderByQuery<AssetsOrderBy>('CREATED_AT_DESC')
  const [changePage, changeLimit] = usePaginate()
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
  const { data, refetch } = useFetchCreatedAssetsQuery({
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

  const changeOrder = useCallback(
    async (orderBy: any) => {
      await replace({ pathname, query: { ...query, orderBy } })
    },
    [replace, pathname, query],
  )

  const assets = useMemo(
    () =>
      (data?.created?.nodes || [])
        .filter((x): x is AssetDetailFragment => !!x)
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

  if (!assets) return <></>
  if (!data) return <></>
  return (
    <main id="user-created">
      <LargeLayout>
        <Head
          title={meta.title}
          description={meta.description}
          image={`${meta.image}?filename=artist-metadata.jpg`}
        />

        <UserProfileTemplate
          signer={signer}
          currentAccount={account}
          account={userAccount}
          currentTab="created"
          totals={
            new Map([
              ['created', data.created?.totalCount || 0],
              ['on-sale', data.onSale?.totalCount || 0],
              ['owned', data.owned?.totalCount || 0],
            ])
          }
          streamUser={streamUser}
        >
          <TokenGrid<AssetsOrderBy>
            assets={assets}
            orderBy={{
              value: orderBy,
              choices: [
                {
                  label: t('user.created-assets.orderBy.values.createdAtDesc'),
                  value: 'CREATED_AT_DESC',
                },
                {
                  label: t('user.created-assets.orderBy.values.createdAtAsc'),
                  value: 'CREATED_AT_ASC',
                },
              ],
              onSort: changeOrder,
            }}
            pagination={{
              limit,
              limits: [environment.PAGINATION_LIMIT, 24, 36, 48],
              page,
              total: data.created?.totalCount || 0,
              onPageChange: changePage,
              onLimitChange: changeLimit,
              result: {
                label: t('pagination.result.label'),
                caption: (props) => (
                  <Trans
                    ns="templates"
                    i18nKey="pagination.result.caption"
                    values={props}
                    components={[
                      <Text as="span" color="brand.black" key="text" />,
                    ]}
                  />
                ),
                pages: (props) =>
                  t('pagination.result.pages', { count: props.total }),
              },
            }}
          />
        </UserProfileTemplate>
      </LargeLayout>
    </main>
  )
}

export default CreatedPage
