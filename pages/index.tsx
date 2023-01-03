import {
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
import Artist from 'components/Artist/Artist';
import Drop from '../components/Drop/Drop'
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

    const { data, error } = await client.query<FetchHomePageQuery>({
      query: FetchHomePageDocument,
      variables: {
        featuredIds: environment.FEATURED_TOKEN,
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
    <div id="home">
      <Hero 
        bg={'/img/home/main_hero_bg.jpg'}
        ctaLine_1={t('home.mainHero.ctaLine1')}
        ctaLine_2={t('home.mainHero.ctaLine2')}
        description={t('home.mainHero.description')}
        button_1={t('home.mainHero.button')}
        button_1_link={'/explore'}
        image={'/img/home/main_hero_img.png'}
      />
      <LargeLayout>
        <Stack spacing={6} mt={20} mb={40}>
            <Heading as="h2" variant="subtitle" color="brand.black">
              {t('home.featuredArtists.title')}
            </Heading>
            <Slider>
              <Artist 
                name='ilithya'
                handle='@ilithya_rocks'
                description='Music inspired art + tech 🤘🏽
                💫 Creations with programming + algorithms
                🖤 Mexican based in Hamburg'
                tags={['música','multimedia','creative coding']}
                image='https://gig-io.vercel.app/_next/image?url=https%3A%2F%2Fgig.mypinata.cloud%2Fipfs%2FQmQCSR8mayBTYsR4aWQV8pExSWQVGiqFXGWr63kyepR9GH%2Fnft.png&w=640&q=75'
                link={'/users/0x3ddf4bcb457d321786db72dc67ca0db13388b4e4'}
              />
              <Artist 
                name='p1xelfool'
                handle='@p1xelfool'
                description='Internet artist since 3001 */ father of multidimentional entities'
                tags={['arte digital','animación']}
                image='https://p1xelfool.com/images/soul.gif'
                link={'/users/0x6458a79eb4ef3f6982ff4fe270f43fd6ec9f30c1'}
              />
              <Artist 
                name='Camote Toys'
                handle='@camote.toys'
                description='Artista argentino enfocado en art toys y cerámica ritual con impronta latinoamericana'
                tags={['art toys','diseño', 'cerámica']}
                image='https://prod-cdn-05.storenvy.com/stores/avatars/1235223/medium/Camote_Logo.png?1637193683'
                link={'/users/0x6793ff7cd05b8f3e88ed6440188daacd421db9c7'}
              />
              <Artist 
                name='Cotama'
                handle='@pablocotama'
                description='A monkey that paints with his hands'
                tags={['diseño', 'arte digital']}
                image='https://pbs.twimg.com/media/FliQUNKXwAA4Hli?format=jpg&name=medium'
                link={'/users/0xa4b7f2a571281a8d57be04623695fa6967103d60'}
              />
              <Artist 
                name='Ocote'
                handle='@el_ocote'
                description='🌵🗿📡Artesanía digital👇🏼'
                tags={['arte digital','gráfica','street art']}
                image='https://static.wixstatic.com/media/c3f0a4_a145f2389cc94bb6abe7606468d67129~mv2.jpg/v1/crop/x_74,y_67,w_2213,h_2203/fill/w_565,h_565,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/19_Territorio.jpg'
                link={'/users/0x6458a79eb4ef3f6982ff4fe270f43fd6ec9f30c1'}
              />

            </Slider>
        </Stack>

        {featuredAssets && featuredAssets.length > 0 && (
          <header>
            {featuredAssets.length === 1 ? (
              featuredAssets
            ) : (
              <Flex as={Slider}>{featuredAssets}</Flex>
            )}
          </header>
        )}

        {auctions.length > 0 && (
          <Stack spacing={6} mt={12}>
            <Heading as="h2" variant="subtitle" color="brand.black">
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
                  />
                </Flex>
              ))}
            </Slider>
          </Stack>
        )}

        {assets.length > 0 && (
          <Stack spacing={6} mt={12}>
            <Flex flexWrap="wrap" justify="space-between" gap={4}>
              <Heading as="h2" variant="subtitle" color="brand.black">
                {t('home.featured')}
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
                  />
                </Flex>
              ))}
            </SimpleGrid>
          </Stack>
        )}


        <Stack spacing={12} mb={40}>
            <Heading as="h2" variant="subtitle" color="brand.black" mt={40} mb={10}>
              {t('home.gigDrops.title')}
            </Heading>
            <Drop
              title='GIG Series - Génesis'
              date='1 de Enero 2023'
              description='GIG Génesis es la primera colección de la familia GIG que trae una misión: Empoderar almas creativas empezando por LATAM a través de la conexión con líderes de la industria creativa y Web3.'
              image='/img/drops/drop-gig-genesis.jpg'
              link='https://gig.io'
            />
            <Drop
              title='Maxas Génesis'
              date='10 de Febrero 2023'
              description=''
              image='/img/drops/drop-maxas-genesis.jpg'
              link='https://maxas.xyz'
            />
        </Stack>
      </LargeLayout>
      <Stack spacing={12} mb={10} backgroundColor={'gray.100'} w={'full'} id='home__section-video'>
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
          image='./img/home/video.jpg'
        />
      </LargeLayout>
    </Stack>
    
    <Banner
      cta={t('home.banner.title')}
      description={t('home.banner.text')}
      button1={t('home.banner.button1')}
      button2={t('home.banner.button2')}
    />
  </div>
  )
}

export default HomePage
