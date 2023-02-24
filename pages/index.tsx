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
import { useCallback, useEffect, useMemo } from 'react'
import Link from '../components/Link/Link'
import Slider from '../components/Slider/Slider'
import TokenCard from '../components/Token/Card'
import TokenHeader from '../components/Token/Header'
import {
  convertAsset,
  convertAssetWithSupplies,
  convertAuctionFull,
  convertAuctionWithBestBid,
  convertBid,
  convertOwnership,
  convertSale,
  convertSaleFull,
  convertUser,
} from '../convert'
import environment from '../environment'
import {
  FetchDefaultAssetIdsDocument,
  FetchDefaultAssetIdsQuery,
  FetchHomePageDocument,
  FetchHomePageQuery,
  useFetchHomePageQuery,
} from '../graphql'
import useBlockExplorer from '../hooks/useBlockExplorer'
import useEagerConnect from '../hooks/useEagerConnect'
import useOrderById from '../hooks/useOrderById'
import useSigner from '../hooks/useSigner'
import LargeLayout from '../layouts/large'
import FullLayout from '../layouts/full'
import Head from '../components/Head'
import Artist from 'components/Artist/Artist';
//import Drop from '../components/Drop/Drop'
import Hero from '../components/Hero/Hero'
import SecondaryHero from '../components/Hero/SecondaryHero'
import Banner from '../components/Banner/Block'
import { wrapServerSideProps } from '../props'

type Props = {
  now: string
  featuredTokens: string[]
  limit: number
  tokens: string[]
  currentAccount: string | null
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

    let randomizedFeaturedTokens = environment.FEATURED_TOKEN.sort(
      () => Math.random() - 0.5,
    ).slice(0, environment.PAGINATION_LIMIT)

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
    return {
      props: {
        now: now.toJSON(),
        limit: environment.PAGINATION_LIMIT,
        featuredTokens: environment.FEATURED_TOKEN,
        tokens: tokensToRender,
        currentAccount: ctx.user.address,
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
}) => {
  const ready = useEagerConnect()
  const signer = useSigner()
  const { t } = useTranslation('templates')
  const { account } = useWeb3React()
  const toast = useToast()
  const date = useMemo(() => new Date(now), [now])
  const { data, refetch, error } = useFetchHomePageQuery({
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

  const blockExplorer = useBlockExplorer(
    environment.BLOCKCHAIN_EXPLORER_NAME,
    environment.BLOCKCHAIN_EXPLORER_URL,
  )

  const featured = useOrderById(featuredTokens, data?.featured?.nodes)
  const assets = useOrderById(tokens, data?.assets?.nodes)
  const currencies = useMemo(() => data?.currencies?.nodes || [], [data])
  const auctions = useMemo(() => data?.auctions?.nodes || [], [data])

  const reloadInfo = useCallback(async () => {
    void refetch()
  }, [refetch])

  const featuredAssets = useMemo(
    () =>
      featured?.map((asset) => (
        <TokenHeader
          key={asset.id}
          blockExplorer={blockExplorer}
          asset={convertAssetWithSupplies(asset)}
          currencies={currencies}
          auction={
            asset.auctions.nodes[0]
              ? convertAuctionFull(asset.auctions.nodes[0])
              : undefined
          }
          bestBid={
            asset.auctions.nodes[0]?.bestBid?.nodes[0]
              ? convertBid(asset.auctions.nodes[0]?.bestBid?.nodes[0])
              : undefined
          }
          sales={asset.sales.nodes.map(convertSaleFull)}
          creator={convertUser(asset.creator, asset.creator.address)}
          owners={asset.ownerships.nodes.map(convertOwnership)}
          numberOfOwners={asset.ownerships.totalCount}
          isHomepage={true}
          signer={signer}
          currentAccount={account?.toLowerCase()}
          onOfferCanceled={reloadInfo}
          onAuctionAccepted={reloadInfo}
        />
      )),
    [featured, blockExplorer, account, signer, reloadInfo, currencies],
  )
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
        image={'/img/home/main_hero_img_600px.png'}
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

        {featuredAssets && featuredAssets.length > 0 && (
          <header>

            <Heading as="h2" variant="title" color="brand.black">
            {t('home.featured')}
            </Heading>
            {featuredAssets.length === 1 ? (
              featuredAssets
            ) : (
              <Flex as={Slider}>{featuredAssets}</Flex>
            )}
          </header>
        )}

        <Stack spacing={6} mt={20}>
          <Heading as="h2" variant="title" color="brand.black">
            {t('home.featuredArtists.title')}
          </Heading>
          <Slider items={9}>
            <Artist 
              name='ilithya'
              handle='@ilithya_rocks'
              description='Artista multidisciplinaria de México, radicada en Alemania.
              Experimentando con arte de los nuevos medios inspirado en la ilustración, música y el arte urbano.
              🙂 ⚡️✌🏽'
              tags={['arte generativo','arte digital']}
              image='/img/artistas/ilithya2.jpg'
              link={'/0x3ddf4bcb457d321786db72dc67ca0db13388b4e4'}
            />
            <Artist 
              name='Cotama'
              handle='@pablocotama'
              description='A monkey that paints with his hands'
              tags={['diseño', 'arte digital', 'animación']}
              image='/img/artistas/cotama.jpg'
              link={'/0xa4b7f2a571281a8d57be04623695fa6967103d60'}
            />
            <Artist 
              name='Ocote'
              handle='@el_ocote'
              description='🌵🗿📡Artesanía digital👇🏼'
              tags={['arte digital','animación','street art']}
              image='/img/artistas/ocote.jpg'
              link={'/0xed9dae268cbedacf5ade8db9b64482639f6f9f73'}
            />
            <Artist 
              name='Red Sannto'
              handle='@red_sannto'
              description='Es un artista visual influenciado por el misticismo presente en el arte urbano contemporáneo y en un fanatismo por los elementos gráficos del movimiento skateboarding de los 90s.'
              tags={['arte digital','ilustración','animación']}
              image='/img/artistas/redsannto.jpg'
              link={'/0xdefcbcb7dc1d99dc98fbe215872d86e57848fc1c'}
            />
            <Artist 
              name='Camote Toys'
              handle='@camote.toys'
              description='Artista argentino enfocado en art toys y cerámica ritual con impronta latinoamericana'
              tags={['art toys','ilustración', 'arte digital']}
              image='/img/artistas/camotetoys.png'
              link={'/0x6793ff7cd05b8f3e88ed6440188daacd421db9c7'}
            />
            <Artist 
              name='Y Griega'
              handle='@@ygriega.eth'
              description='Originario de Tenochtitlan, artista digital nativo //
              Glitch, Pixel art, Coding, AI //
              Active member of the Cryptoart Cvlt'
              tags={['arte digital', 'animación', 'pixel art']}
              image='/img/artistas/y-griega.jpg'
              link={'/0xc80d9fa67e2ea464b0a58a7095a37c08afb339e5'}
            />
            <Artist 
              name='Youkonejo'
              handle='@youkonejo'
              description='Mitad japonesa, mitad mexicana, mitad hombreosocerdo. ** Half Japanese, half Mexican, half manbearpig.'
              tags={['arte digital', 'ilustración', 'muralista']}
              image='/img/artistas/youko.jpg'
              link={'/0x4bb585d350452384b092c90552034ed6a5fd76ee'}
            />
            <Artist 
              name='chacalall'
              handle='@chacalall'
              description='Artist gif based on Mexico city since 2009, glitch and nature using the same language.'
              tags={['arte digital', 'animación', 'glitch art']}
              image='/img/artistas/chacalall.jpg'
              link={'/0x7ecf613b0350b0f47cadf85396a98ccd1b0e8d55'}
            />
            <Artist 
              name='GIG Oficial'
              handle='@holagig'
              description='Perfil oficial de GIG.io.'
              tags={['arte digital','animación', 'accesos']}
              image='/img/artistas/gig.jpg'
              link={'/0x750519ace128bf440a31046c39a45394b344dc21'}
            />
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


        {/* <Stack spacing={12} mb={40}>
          <Heading as="h2" variant="subtitle" color="brand.black" mt={40} mb={10}>
            {t('home.gigDrops.title')}
          </Heading>
          <Drop
            title='GIG Series - Génesis'
            date='9 de Enero 2023'
            description='GIG Génesis es la primera colección de la familia GIG que trae una misión: Empoderar almas creativas empezando por LATAM a través de la conexión con líderes de la industria creativa y Web3.'
            image='/img/drops/drop-gig-genesis.jpg'
            link='https://gig.io'
          />
          <Drop
            title='Maxas Génesis'
            date={t('home.gigDrops.comingSoon')}
            description=''
            image='/img/drops/drop-maxas-genesis.jpg'
            link='https://maxas.xyz'
          />
        </Stack> */}

      </LargeLayout>

      <FullLayout backgroundColor={'gray.100'} hasBottomCaret={true}>
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
