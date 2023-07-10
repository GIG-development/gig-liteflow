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
  useBreakpointValue
} from '@chakra-ui/react'
import { HiArrowNarrowRight } from '@react-icons/all-files/hi/HiArrowNarrowRight'
import { useWeb3React } from '@web3-react/core'
import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useMemo } from 'react'
import Link from '../components/Link/Link'
import Slider from '../components/Slider/Slider'
import TokenCard from '../components/Token/Card'
import {
  convertAsset,
  convertAuctionWithBestBid,
  convertSale,
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
import useEagerConnect from '../hooks/useEagerConnect'
import useOrderById from '../hooks/useOrderById'
import LargeLayout from '../layouts/large'
import FullLayout from '../layouts/full'
import Head from '../components/Head'
import Hero from '../components/Hero/Hero'
import SecondaryHero from '../components/Hero/SecondaryHero'
import Banner from '../components/Banner/Block'
import Image from 'components/Image/Image'
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

    const artists = await client.query<FetchExploreUsersQuery>({
      query: FetchExploreUsersDocument,
      variables: { limit: 20, offset: 0, filter: [{verification:{status:{equalTo:'VALIDATED'}}} as AccountFilter] },
    })
    if (artists?.error) throw error
    if (!artists?.data) throw new Error('data is falsy')

    return {
      props: {
        now: now.toJSON(),
        limit: environment.PAGINATION_LIMIT,
        featuredTokens: environment.FEATURED_TOKEN,
        tokens: tokensToRender,
        currentAccount: ctx.user.address,
        artists: artists
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
  const verifiedArtists = artists.data.users.nodes.filter((user:any)=>user.verification?.status === "VALIDATED").sort(() => Math.random() - 0.5)
  const ready = useEagerConnect()
  const { t } = useTranslation('templates')
  const { account } = useWeb3React()
  const toast = useToast()
  const date = useMemo(() => new Date(now), [now])
  const { data, error } = useFetchHomePageQuery({
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

  const featured = useOrderById(featuredTokens, data?.featured?.nodes)
  const assets = useOrderById(tokens, data?.assets?.nodes)
  const auctions = useMemo(() => data?.auctions?.nodes || [], [data])

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

        <Box
          my={6}
          textAlign='center'
          width={useBreakpointValue({base: '100%', md:'640px'}) || '640px'}
          height={useBreakpointValue({base: '54px', md:'118px'}) || '118px'}
          position='relative'
          margin='0 auto'
        >
          <Link  href='/faq' title='' isExternal>
            <Image
              src={useBreakpointValue({base: '/img/home/mint-free.gif', md:'/img/home/mint-free.gif'}) || ''}
              layout='fill'
              alt=''
            />
          </Link>
        </Box>

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
