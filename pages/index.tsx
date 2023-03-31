import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { HiArrowNarrowRight } from '@react-icons/all-files/hi/HiArrowNarrowRight'
import { useWeb3React } from '@web3-react/core'
import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import { /*useCallback,*/ useEffect, useMemo } from 'react'
import Link from '../components/Link/Link'
import Slider from '../components/Slider/Slider'
import TokenCard from '../components/Token/Card'
//import TokenHeader from '../components/Token/Header'
import {
  convertAsset,
  //convertAssetWithSupplies,
  //convertAuctionFull,
  convertAuctionWithBestBid,
  //convertBid,
  //convertOwnership,
  convertSale,
  //convertSaleFull,
  convertUser,
} from '../convert'
import environment from '../environment'
import {
  AccountFilter,
  FetchDefaultAssetIdsDocument,
  FetchDefaultAssetIdsQuery,
  FetchHomePageDocument,
  FetchHomePageQuery,
  useFetchHomePageQuery,
  FetchExploreUsersDocument,
  FetchExploreUsersQuery,
} from '../graphql'
//import useBlockExplorer from '../hooks/useBlockExplorer'
import useEagerConnect from '../hooks/useEagerConnect'
import useOrderById from '../hooks/useOrderById'
//import useSigner from '../hooks/useSigner'
import LargeLayout from '../layouts/large'
import FullLayout from '../layouts/full'
import Head from '../components/Head'
import Hero from '../components/Hero/Hero'
import SecondaryHero from '../components/Hero/SecondaryHero'
import Banner from '../components/Banner/Block'
import { wrapServerSideProps } from '../props'
import UserCard from '../components/User/UserCard'
import { convertUserWithCover } from '../convert'

type Props = {
  now: string
  featuredTokens: string[]
  limit: number
  tokens: string[]
  currentAccount: string | null
  artists: any
}

export const getServerSideProps = wrapServerSideProps<Props>(
  environment.GRAPHQL_URL,
  async (ctx, client) => {
    const now = new Date()
    let tokensToRender
    if (environment.HOME_TOKENS) {
      // Randomize list of assets to display
      tokensToRender = environment.HOME_TOKENS.sort(
        () => Math.random() - 0.5,
      ).slice(0, environment.PAGINATION_LIMIT)
    } else {
      // Fallback to default list of assets
      const res = await client.query<FetchDefaultAssetIdsQuery>({
        query: FetchDefaultAssetIdsDocument,
        variables: {
          limit: environment.PAGINATION_LIMIT,
        },
      })
      tokensToRender = res.data.assets?.nodes.map((x) => x.id) || []
    }

    const randomizedFeaturedTokens = environment.FEATURED_TOKEN ? 
      environment.FEATURED_TOKEN.sort(
        () => Math.random() - 0.5,
      ).slice(0, environment.PAGINATION_LIMIT)
      : ''

    const { data, error } = await client.query<FetchHomePageQuery>({
      query: FetchHomePageDocument,
      variables: {
        featuredIds: randomizedFeaturedTokens,
        now,
        limit: environment.PAGINATION_LIMIT,
        assetIds: tokensToRender,
        address: ctx.user.address || '',
      },
    })
    if (error) throw error
    if (!data) throw new Error('data is falsy')

    const res = await client.query<FetchExploreUsersQuery>({
      query: FetchExploreUsersDocument,
      variables: { limit: 20, offset: 0, filter: [{verification:{status:{equalTo:'VALIDATED'}}} as AccountFilter] },
    })
    if (error) throw error
    if (!data) throw new Error('data is falsy')

    return {
      props: {
        now: now.toJSON(),
        limit: environment.PAGINATION_LIMIT,
        featuredTokens: environment.FEATURED_TOKEN,
        tokens: tokensToRender,
        currentAccount: ctx.user.address,
        artists: res
      },
    }
  },
)

const HomePage: NextPage<Props> = ({
  currentAccount,
  featuredTokens,
  limit,
  now,
  tokens,
  artists
}) => {
  const verifiedArtists = artists.data.users.nodes.filter((user:any)=>user.verification?.status === "VALIDATED")
  const ready = useEagerConnect()
  //const signer = useSigner()
  const { t } = useTranslation('templates')
  const { account } = useWeb3React()
  const toast = useToast()
  const date = useMemo(() => new Date(now), [now])
  const { data, /*refetch,*/ error } = useFetchHomePageQuery({
    variables: {
      featuredIds: featuredTokens,
      now: date,
      limit,
      assetIds: tokens,
      address: (ready ? account?.toLowerCase() : currentAccount) || '',
    },
  })

  useEffect(() => {
    if (!error) return
    console.error(error)
    toast({
      title: t('error.500'),
      status: 'error',
    })
  }, [error, t, toast])

  // const blockExplorer = useBlockExplorer(
  //   environment.BLOCKCHAIN_EXPLORER_NAME,
  //   environment.BLOCKCHAIN_EXPLORER_URL,
  // )

  const featured = useOrderById(featuredTokens, data?.featured?.nodes)
  const assets = useOrderById(tokens, data?.assets?.nodes)
  //const currencies = useMemo(() => data?.currencies?.nodes || [], [data])
  const auctions = useMemo(() => data?.auctions?.nodes || [], [data])

  // const reloadInfo = useCallback(async () => {
  //   void refetch()
  // }, [refetch])

  // const featuredAssets = useMemo(
  //   () =>
  //     featured?.map((asset) => (
  //       <TokenHeader
  //         key={asset.id}
  //         blockExplorer={blockExplorer}
  //         asset={convertAssetWithSupplies(asset)}
  //         currencies={currencies}
  //         auction={
  //           asset.auctions.nodes[0]
  //             ? convertAuctionFull(asset.auctions.nodes[0])
  //             : undefined
  //         }
  //         bestBid={
  //           asset.auctions.nodes[0]?.bestBid?.nodes[0]
  //             ? convertBid(asset.auctions.nodes[0]?.bestBid?.nodes[0])
  //             : undefined
  //         }
  //         sales={asset.sales.nodes.map(convertSaleFull)}
  //         creator={convertUser(asset.creator, asset.creator.address)}
  //         owners={asset.ownerships.nodes.map(convertOwnership)}
  //         numberOfOwners={asset.ownerships.totalCount}
  //         isHomepage={true}
  //         signer={signer}
  //         currentAccount={account?.toLowerCase()}
  //         onOfferCanceled={reloadInfo}
  //         onAuctionAccepted={reloadInfo}
  //       />
  //     )),
  //   [featured, blockExplorer, account, signer, reloadInfo, currencies],
  // )

  return (
    <main id="home">
      <Head
          title="GIG"
      />
      <Hero 
        bg={'/img/home/main_hero_bg.jpg'}
        ctaLine_1={t('home.mainHero.ctaLine1')}
        ctaLine_2={t('home.mainHero.ctaLine2')}
        description={t('home.mainHero.description')}
        button_1={t('home.mainHero.button')}
        button_1_link={'/explore'}
        //image={'/img/home/main_hero_img_600px.png'}
        featuredItems={featured}
      />
      
      <LargeLayout>

        {/* <Box my={6} textAlign='center'>
          <Link  href='' title='' isExternal>
            <Image
              src={useBreakpointValue({base: '', md:''}) || ''}
              width={useBreakpointValue({base: '360', md:'1280'}) || '1280'}
              height={useBreakpointValue({base: '240', md:'160'}) || '160'}
              layout='fill'
              alt=''
            />
          </Link>
        </Box> */}


        {/* {featuredAssets && featuredAssets.length > 0 && (
          <header>

            <Heading as="h2" variant="title" color="brand.black" mt={6}>
            {t('home.featured')}
            </Heading>
            {featuredAssets.length === 1 ? (
              featuredAssets
            ) : (
              <Flex as={Slider}>{featuredAssets}</Flex>
            )}
          </header>
        )} */}

        <Stack spacing={6} mt={20}>
          <Heading as="h2" variant="title" color="brand.black">
            {t('home.featuredArtists.title')}
          </Heading>
          <Slider items={verifiedArtists.length}>
            {verifiedArtists.map((artist:any, i: number)=>{
              return (
                <Flex
                  key={i}
                  className="slider__slide"
                  px={4}
                  maxW='240px'
                >
                  <UserCard
                    user={convertUserWithCover(artist, artist.address)}
                  />
                </Flex>
              )
            })}
          </Slider>
        </Stack>

        {auctions.length > 0 && (
          <Stack spacing={6} mt={12}>
            <Heading as="h2" variant="title" color="brand.black">
              {t('home.auctions')}
            </Heading>
            <Slider>
              {auctions.map((x, i) => (
                <Flex
                  key={i}
                  grow={0}
                  shrink={0}
                  basis={{
                    base: '100%',
                    sm: '50%',
                    md: '33.33%',
                    lg: '25%',
                  }}
                  p="10px"
                  justify={'center'}
                >
                  <TokenCard
                    asset={convertAsset(x.asset)}
                    creator={convertUser(
                      x.asset.creator,
                      x.asset.creator.address,
                    )}
                    auction={convertAuctionWithBestBid(x)}
                    sale={undefined}
                    numberOfSales={0}
                    hasMultiCurrency={false}
                    displayCreator
                  />
                </Flex>
              ))}
            </Slider>
          </Stack>
        )}

        {assets.length > 0 && (
          <Stack spacing={6} my={12}>
            <Flex flexWrap="wrap" justify="space-between" gap={4}>
              <Heading as="h2" variant="title" color="brand.black">
                {t('home.latest')}
              </Heading>
              <Link href="/explore">
                <Button
                  variant="outline"
                  colorScheme="gray"
                  rightIcon={<Icon as={HiArrowNarrowRight} h={5} w={5} />}
                  iconSpacing="10px"
                >
                  <Text as="span" isTruncated>
                    {t('home.explore')}
                  </Text>
                </Button>
              </Link>
            </Flex>
            
            <SimpleGrid spacing={6} columns={{ sm: 2, md: 3, lg: 4 }}>
              {assets.map((x, i) => (
                <Flex key={i} justify="center">
                  <TokenCard
                    asset={convertAsset(x)}
                    creator={convertUser(x.creator, x.creator.address)}
                    sale={convertSale(x.firstSale.nodes[0])}
                    auction={
                      x.auctions.nodes[0]
                        ? convertAuctionWithBestBid(x.auctions.nodes[0])
                        : undefined
                    }
                    numberOfSales={x.firstSale.totalCount}
                    hasMultiCurrency={
                      parseInt(
                        x.currencySales.aggregates?.distinctCount?.currencyId,
                        10,
                      ) > 1
                    }
                    displayCreator
                  />
                </Flex>
              ))}
            </SimpleGrid>

            <Box w={'full'} textAlign='center' pt={12}>
              <Heading as="h2" variant="title" color="brand.black">
                {t('home.keepExploring')}
              </Heading>
              <Button
                as={Link}
                href='/explore'
                size='lg'
                mt={6}
              >
                {t('home.mainHero.button')}
              </Button>
            </Box>
          </Stack>
        )}
      </LargeLayout>

      <FullLayout backgroundColor={'gray.100'} hasBottomCaret={true} padding={{mobile: '0', desktop: '0'}}>
        <LargeLayout>
          <Heading as="h2" variant="subtitle" color="black">
              {t('home.secondaryHero.title')}
          </Heading>
          <SecondaryHero 
            ctaLine_1={t('home.secondaryHero.ctaLine1')}
            ctaLine_2={t('home.secondaryHero.ctaLine2')}
            description={t('home.secondaryHero.description')}
            button_1={t('home.secondaryHero.button')}
            button_1_link='/nosotros'
            image='/img/home/video.jpg'
          />
        </LargeLayout>
      </FullLayout>
  
      <LargeLayout>
        <Banner
          cta={t('home.banner.title')}
          description={t('home.banner.text')}
          button1={t('home.banner.button1')}
          button2={t('home.banner.button2')}
        />
      </LargeLayout>
    </main>
  )
}

export default HomePage
