import {
  AspectRatio,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Switch,
  Tab,
  TabList,
  Tabs,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { FaInfoCircle } from '@react-icons/all-files/fa/FaInfoCircle'
import { HiOutlineDotsHorizontal } from '@react-icons/all-files/hi/HiOutlineDotsHorizontal'
import { HiOutlineExternalLink } from '@react-icons/all-files/hi/HiOutlineExternalLink'
import { useWeb3React } from '@web3-react/core'
import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { ethers } from 'ethers'
import invariant from 'ts-invariant'
import { QRCodeCanvas } from "qrcode.react";
import BidList from '../../../components/Bid/BidList'
import Head from '../../../components/Head'
import HistoryList from '../../../components/History/HistoryList'
import ChakraLink from '../../../components/Link/Link'
import SaleDetail from '../../../components/Sales/Detail'
import TokenMedia from '../../../components/Token/Media'
import TokenMetadata from '../../../components/Token/Metadata'
import TraitList from '../../../components/Trait/TraitList'
import {
  convertAuctionFull,
  convertBidFull,
  convertHistories,
  convertOwnership,
  convertSaleFull,
  convertUser,
} from '../../../convert'
import environment from '../../../environment'
import {
  FetchAssetDocument,
  FetchAssetIdFromTokenIdDocument,
  FetchAssetIdFromTokenIdQuery,
  FetchAssetIdFromTokenIdQueryVariables,
  FetchAssetQuery,
  useFetchAssetQuery,
} from '../../../graphql'
import useBlockExplorer from '../../../hooks/useBlockExplorer'
import useEagerConnect from '../../../hooks/useEagerConnect'
import useNow from '../../../hooks/useNow'
import useSigner from '../../../hooks/useSigner'
import LargeLayout from '../../../layouts/large'
import { wrapServerSideProps } from '../../../props'

type Props = {
  assetId: string
  now: string
  currentAccount: string | null
  priceConversion?: any
  meta: {
    title: string
    description: string
    image: string
  }
}

enum AssetTabs {
  bids = 'bids',
  history = 'history',
}

export const getServerSideProps = wrapServerSideProps<Props>(
  environment.GRAPHQL_URL,
  async (ctx, client) => {
    const now = new Date()
    const assetId: any  = ctx.params?.id
      ? Array.isArray(ctx.params.id)
        ? ctx.params.id[0]
        : ctx.params.id
      : null
    invariant(assetId, 'assetId is falsy')

    // check if assetId is only a tokenId
    if (!assetId.includes('-')) {
      const { data, error } = await client.query<
        FetchAssetIdFromTokenIdQuery,
        FetchAssetIdFromTokenIdQueryVariables
      >({
        query: FetchAssetIdFromTokenIdDocument,
        variables: { tokenId: assetId },
      })
      if (error) throw error
      const fullAssetId: any = data.assets?.nodes.at(0)
      if (!fullAssetId) return { notFound: true }
      return {
        redirect: {
          permanent: true,
          destination: `/tokens/${fullAssetId.id}`,
        },
      }
    }

    const { data, error } = await client.query<FetchAssetQuery>({
      query: FetchAssetDocument,
      variables: {
        id: assetId,
        now,
        address: ctx.user.address || '',
      },
    })
    if (error) throw error
    if (!data.asset) return { notFound: true }

    const salePrice: (string|undefined) = data?.asset?.sales?.nodes[0]?.unitPrice
    const auctionPrice: (string|undefined) = data?.asset?.auctions?.nodes[0]?.reserveAmount
    if((salePrice && salePrice!=='') || (auctionPrice && auctionPrice!=='')){
      const conversionAmount = (salePrice && salePrice!=='')
                               ? ethers.utils.formatEther(salePrice)
                               : (auctionPrice && auctionPrice!=='')
                               ? ethers.utils.formatEther(auctionPrice)
                               : '0'
      let conversionQuote
      if (conversionAmount !== '0'){
        const apiUrl = `https://pro-api.coinmarketcap.com/v2/tools/price-conversion?CMC_PRO_API_KEY=${environment.COINMARKETCAP_API_KEY}&amount=${conversionAmount}&symbol=ETH`
        const res = await fetch(apiUrl)
        conversionQuote = await res.json()
      }else{
        conversionQuote = undefined
      }
      //const convertedAmount = conversionQuote ? conversionQuote?.data[0]?.quote?.USD.price : ''
      return {
        props: {
          now: now.toJSON(),
          assetId,
          currentAccount: ctx.user.address,
          priceConversion: conversionQuote,
          meta: {
            title: data.asset.name,
            description: data.asset.description,
            image: data.asset.image,
          },
        },
      }
    }
    return {
      props: {
        now: now.toJSON(),
        assetId,
        currentAccount: ctx.user.address,
        priceConversion: '',
        meta: {
          title: data.asset.name,
          description: data.asset.description,
          image: data.asset.image,
        },
      },
    }
  },
)

const DetailPage: NextPage<Props> = ({
  currentAccount,
  assetId,
  priceConversion,
  now: nowProp,
  meta,
}) => {
  const ready = useEagerConnect()
  const signer = useSigner()
  const { t } = useTranslation('templates')
  const { account } = useWeb3React()
  const { query } = useRouter()
  const blockExplorer = useBlockExplorer(
    environment.BLOCKCHAIN_EXPLORER_NAME,
    environment.BLOCKCHAIN_EXPLORER_URL,
  )
  const [showPreview, setShowPreview] = useState(false)

  const date = useMemo(() => new Date(nowProp), [nowProp])
  const { data, refetch } = useFetchAssetQuery({
    variables: {
      id: assetId,
      now: date,
      address: (ready ? account?.toLowerCase() : currentAccount) || '',
    },
  })
  const asset = useMemo(() => data?.asset, [data])
  const currencies = useMemo(() => data?.currencies?.nodes || [], [data])

  const isOwner = useMemo(
    () => BigNumber.from(asset?.owned.aggregates?.sum?.quantity || '0').gt('0'),
    [asset],
  )
  const ownAllSupply = useMemo(
    () =>
      BigNumber.from(asset?.owned.aggregates?.sum?.quantity || '0').gte(
        BigNumber.from(asset?.ownerships.aggregates?.sum?.quantity || '0'),
      ),
    [asset],
  )
  const isSingle = useMemo(
    () => asset?.collection.standard === 'ERC721',
    [asset],
  )

  const tabs = [
    {
      title: t('asset.detail.tabs.bids'),
      href: `/tokens/${assetId}?filter=bids`,
      type: AssetTabs.bids,
    },
    {
      title: t('asset.detail.tabs.history'),
      href: `/tokens/${assetId}?filter=history`,
      type: AssetTabs.history,
    },
  ]

  const traits = useMemo(
    () => asset && asset.traits.nodes.length > 0 && asset.traits.nodes,
    [asset],
  )

  const defaultIndex = query.filter
    ? tabs.findIndex((tab) => tab.type === query.filter)
    : 0

  const assetExternalURL = useMemo(() => {
    if (!asset) return ''
    return blockExplorer.token(asset.collectionAddress, asset.tokenId)
  }, [asset, blockExplorer])

  const now = useNow()
  const activeAuction = useMemo(() => {
    const auction = asset?.auctions.nodes[0]
    if (!auction) return
    // check if auction is expired
    if (new Date(auction.expireAt) <= now) return
    // check if auction has a winning offer
    if (!!auction.winningOffer?.id) return
    return auction
  }, [asset, now])

  const bids = useMemo(() => {
    if (!asset) return []
    return activeAuction
      ? activeAuction.offers.nodes.map(convertBidFull)
      : asset.bids.nodes.length > 0
      ? asset.bids.nodes.map(convertBidFull)
      : []
  }, [activeAuction, asset])

  const directSales = useMemo(
    () => asset?.sales.nodes.map(convertSaleFull) || [],
    [asset],
  )

  const auction = useMemo(
    () =>
      asset?.auctions.nodes.map((auction) => convertAuctionFull(auction))[0],
    [asset],
  )

  const bestBid = useMemo(
    () => asset?.auctions.nodes[0]?.offers.nodes.map(convertBidFull)[0],
    [asset],
  )

  const creator = useMemo(
    () =>
      asset ? convertUser(asset.creator, asset.creator.address) : undefined,
    [asset],
  )

  const owners = useMemo(
    () => asset?.ownerships.nodes.map(convertOwnership) || [],
    [asset],
  )

  const histories = useMemo(
    () => asset?.histories.nodes.map(convertHistories) || [],
    [asset],
  )

  const refresh = useCallback(async () => {
    await refetch()
  }, [refetch])

  const downloadQR = () => {
    const link = document.createElement('a')
    link.download = 'GIG-QR-Code.png'
    link.href = document.querySelector('canvas')?.toDataURL("image/png").replace("image/png", "image/octet-stream") || ''
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const qrcode = (
    <QRCodeCanvas
      title={t('asset.detail.qrCode.download')}
      includeMargin={false}
      className='qr-codes'
      id='gig-qr-code'
      value={environment.BASE_URL+'/tokens/'+data?.asset?.id}
      fgColor='#212121'
      imageSettings={{src:'/favicon.png', width: 20, height: 20, excavate:true}}
      onClick={downloadQR}
    />
  )

  // const convertedPrice = (priceConversion && priceConversion.data && priceConversion.data[0].quote)
  //                          ? priceConversion.data[0]?.quote?.USD.price
  //                          : undefined

  const convertedPrice = useMemo(
    () => priceConversion && priceConversion.data && priceConversion.data[0].quote && priceConversion.data[0].quote.USD.price,
    [priceConversion],
  )

  if (!asset) return <></>
  return (
    <main id="token-info">
      <LargeLayout>
        <Head
          title={meta.title}
          description={meta.description}
          image={`${meta.image}?filename=token-metadata.jpg`}
        />
        <SimpleGrid spacing={6} columns={{ md: 2 }}>
          <AspectRatio ratio={1}>
            <Center
              flexDirection="column"
              rounded={{ md: 'xl' }}
              pr={{base: 0, md: 12}}
            >
              <Box position="relative" h="full" w="full" zIndex={1}>
                <Box
                  as={TokenMedia}
                  image={asset.image}
                  animationUrl={asset.animationUrl}
                  unlockedContent={
                    showPreview ? undefined : asset.unlockedContent
                  }
                  defaultText={asset.name}
                  mx="auto"
                  maxH="full"
                  maxW="full"
                  objectFit="contain"
                  layout="fill"
                  controls
                />
              </Box>
              {asset.hasUnlockableContent && (
                <Flex
                  w="full"
                  mt={3}
                  direction={{ base: 'column', lg: 'row' }}
                  justify={{
                    base: 'center',
                    lg: isOwner ? 'space-between' : 'center',
                  }}
                  align="center"
                  gap={4}
                >
                  <Flex align="center" gap={1.5}>
                    <Heading as="h3" variant="heading3" color="brand.black">
                      {t('asset.detail.unlockable.title')}
                    </Heading>
                    <Tooltip
                      label={
                        <Text as="span" variant="caption" color="brand.black">
                          {t('asset.detail.unlockable.tooltip')}
                        </Text>
                      }
                      placement="top"
                      rounded="xl"
                      shadow="lg"
                      p={3}
                      bg="white"
                    >
                      <span>
                        <Icon
                          as={FaInfoCircle}
                          color="gray.400"
                          h={4}
                          w={4}
                          cursor="pointer"
                        />
                      </span>
                    </Tooltip>
                  </Flex>
                  {isOwner && (
                    <Flex as={FormControl} w="auto" align="center">
                      <FormLabel mb={0} htmlFor="show-preview">
                        <Heading as="h3" variant="heading3" color="brand.black">
                          {t('asset.detail.show-preview')}
                        </Heading>
                      </FormLabel>
                      <Switch
                        id="show-preview"
                        isChecked={showPreview}
                        onChange={(event) => setShowPreview(event.target.checked)}
                      />
                    </Flex>
                  )}
                </Flex>
              )}
            </Center>
          </AspectRatio>
          <Flex direction="column" my="auto" gap={8} p={{ base: 6, md: 0 }}>
            <Flex justify="space-between">
              <Heading as="h1" variant="title" color="brand.black">
                {asset.name}
              </Heading>
              <Flex direction="row" align="flex-start" gap={3}>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    variant="outline"
                    colorScheme="gray"
                    rounded="full"
                    aria-label="activator"
                    icon={<Icon as={HiOutlineDotsHorizontal} w={5} h={5} />}
                  />
                  <MenuList>
                    { isOwner && (<>
                    {
                    // TO DO : Opciones para Transfer y Burn
                    }
                    </>)
                    }
                    <ChakraLink
                      href={`mailto:${
                        environment.REPORT_EMAIL
                      }?subject=${encodeURI(
                        t('asset.detail.menu.report.subject'),
                      )}&body=${encodeURI(
                        t('asset.detail.menu.report.body', asset),
                      )}`}
                      isExternal
                    >
                      <MenuItem>{t('asset.detail.menu.report.label')}</MenuItem>
                    </ChakraLink>
                  </MenuList>
                </Menu>
              </Flex>
            </Flex>

            <TokenMetadata
              creator={creator}
              owners={owners}
              saleSupply={BigNumber.from(
                asset.sales.aggregates?.sum?.availableQuantity || 0,
              )}
              standard={asset.collection.standard}
              totalSupply={BigNumber.from(
                asset.ownerships.aggregates?.sum?.quantity || '0',
              )}
            />
            <SaleDetail
              assetId={asset.id}
              blockExplorer={blockExplorer}
              currencies={currencies}
              signer={signer}
              currentAccount={account?.toLowerCase()}
              isSingle={isSingle}
              isHomepage={false}
              isOwner={isOwner}
              auction={auction}
              bestBid={bestBid}
              directSales={directSales}
              ownAllSupply={ownAllSupply}
              onOfferCanceled={refresh}
              onAuctionAccepted={refresh}
              priceConversion={convertedPrice}
            />
          </Flex>

          <Box p={6}>
            <Heading as="h4" variant="heading2" color="brand.black">
              {t('asset.detail.description')}
            </Heading>
            <Box textAlign='justify' color="gray.500" fontSize={'xs'} mt={3}
                dangerouslySetInnerHTML={{__html: asset.description}}>
            </Box>

            <Flex as="nav" mt={8} flexDirection={{base: 'column', md: 'row'}} justify="center" align="center" gap={3}>
              <Button
                as={Link}
                href={assetExternalURL}
                isExternal
                colorScheme="gray"
                width={48}
                justifyContent="space-between"
                rightIcon={<HiOutlineExternalLink />}
              >
                <Text as="span">
                  {t('asset.detail.explorerLink', blockExplorer)}
                </Text>
              </Button>

              <Button
                as={Link}
                href={asset.image}
                isExternal
                colorScheme="gray"
                width={48}
                justifyContent="space-between"
                rightIcon={<HiOutlineExternalLink />}
              >
                <Text as="span">
                  {t('asset.detail.ipfsLink')}
                </Text>
              </Button>
            </Flex>

            {traits && (
              <Box pt={8}>
                <Heading as="h4" variant="heading2" color="brand.black" pb={3}>
                  {t('asset.detail.traits')}
                </Heading>
                <TraitList traits={traits} />
              </Box>
            )}
            
            <Flex flexDirection='column' justifyContent={'center'} alignItems='center' pt={8}>
              {qrcode}
              <Text fontSize='8'>{t('asset.detail.qrCode.download')}</Text>
            </Flex>

          </Box>

          <div>
            <Tabs
              isManual
              defaultIndex={defaultIndex}
              colorScheme="brand"
              overflowX="auto"
              overflowY="hidden"
            >
              <TabList>
                {tabs.map((tab, index) => (
                  <ChakraLink key={index} href={tab.href} whiteSpace="nowrap">
                    <Tab as="div">
                      <Text as="span" variant="subtitle1">
                        {tab.title}
                      </Text>
                    </Tab>
                  </ChakraLink>
                ))}
              </TabList>
            </Tabs>
            <Box h={96} overflowY="auto" py={6}>
              {(!query.filter || query.filter === AssetTabs.bids) && (
                <BidList
                  bids={bids}
                  signer={signer}
                  account={account?.toLowerCase()}
                  isSingle={isSingle}
                  blockExplorer={blockExplorer}
                  preventAcceptation={!isOwner || !!activeAuction}
                  onAccepted={refresh}
                  onCanceled={refresh}
                />
              )}
              {query.filter === AssetTabs.history && (
                <HistoryList
                  histories={histories}
                  blockExplorer={blockExplorer}
                />
              )}
            </Box>
          </div>
        </SimpleGrid>
      </LargeLayout>
    </main>
  )
}

export default DetailPage
