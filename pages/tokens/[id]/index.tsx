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
  Input,
  InputGroup,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  NumberInput,
  NumberInputField,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
  SimpleGrid,
  Switch,
  Tab,
  TabList,
  Tabs,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { formatError } from '@nft/hooks'
import { FaInfoCircle } from '@react-icons/all-files/fa/FaInfoCircle'
import { HiOutlineDotsHorizontal } from '@react-icons/all-files/hi/HiOutlineDotsHorizontal'
import { HiOutlineExternalLink } from '@react-icons/all-files/hi/HiOutlineExternalLink'
import { HiOutlineChevronDown } from '@react-icons/all-files/hi/HiOutlineChevronDown'
import { useWeb3React } from '@web3-react/core'
import useRefreshAsset from 'hooks/useRefreshAsset'
import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { ethers } from 'ethers'
import invariant from 'ts-invariant'
import BidList from '../../../components/Bid/BidList'
import Head from '../../../components/Head'
import HistoryList from '../../../components/History/HistoryList'
import ChakraLink from '../../../components/Link/Link'
import SaleDetail from '../../../components/Sales/Detail'
import TokenMedia from '../../../components/Token/Media'
import TokenMetadata from '../../../components/Token/Metadata'
import TraitList from '../../../components/Trait/TraitList'
import ShareModal from '../../../components/Modal/Share'
import { FaShare } from '@react-icons/all-files/fa/FaShare'
import {
  convertAuctionFull,
  convertBidFull,
  convertHistories,
  convertOwnership,
  convertSaleFull,
  convertTraits,
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
import useTransferAsset from '../../../hooks/useTransferAsset'
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
  const {
    isOpen: isOpenTransfer,
    onOpen: onOpenTransfer,
    onClose: onCloseTransfer
  } = useDisclosure()
  const {
    isOpen: isOpenShare,
    onOpen: onOpenShare,
    onClose: onCloseShare
  } = useDisclosure()
  const toast = useToast()
  const { account } = useWeb3React()
  const { query } = useRouter()
  const blockExplorer = useBlockExplorer(
    environment.BLOCKCHAIN_EXPLORER_NAME,
    environment.BLOCKCHAIN_EXPLORER_URL,
  )
  const [showPreview, setShowPreview] = useState(false)
  const [amountToSend, setAmountToSend] = useState('1')
  const [accountToSend, setAccountToSend] = useState('')

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

  const totalOwned = useMemo(
    () => BigNumber.from(asset?.owned.aggregates?.sum?.quantity || '0'),
    [asset],
  )
  const isOwner = useMemo(() => totalOwned.gt('0'), [totalOwned])
  const ownAllSupply = useMemo(
    () =>
      totalOwned.gte(
        BigNumber.from(asset?.ownerships.aggregates?.sum?.quantity || '0'),
      ),
    [asset, totalOwned],
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
    () =>
      asset &&
      asset.traits.nodes.length > 0 &&
      asset.collection.traits &&
      convertTraits(asset),
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

  // const convertedPrice = (priceConversion && priceConversion.data && priceConversion.data[0].quote)
  //                          ? priceConversion.data[0]?.quote?.USD.price
  //                          : undefined

  const convertedPrice = useMemo(
    () => priceConversion && priceConversion.data && priceConversion.data[0].quote && priceConversion.data[0].quote.USD.price,
    [priceConversion],
  )

  const refreshAsset = useRefreshAsset()
  const refreshMetadata = useCallback(
    async (assetId: string) => {
      try {
        await refreshAsset(assetId)
        await refetch()
        toast({
          title: t('asset.detail.menu.refresh-metadata-success'),
          status: 'success',
        })
      } catch (e) {
        toast({
          title: formatError(e),
          status: 'error',
        })
      }
    },
    [refetch, refreshAsset, toast, t],
  )

  const transferAsset = useTransferAsset()
  const handleTransfer = useCallback(
    async (assetId: string, from: string, to: string, quantity: string) => {
      try{
        const { createTransferAssetTransaction }  = await transferAsset(assetId, from, to, quantity)
        if(signer){
          signer.getGasPrice()
          .then(async gas => {
            const tx = await signer.sendTransaction({
                to: createTransferAssetTransaction.to,
                from: createTransferAssetTransaction.from,
                data: createTransferAssetTransaction.data,
                gasPrice: gas
            })
            if(tx){
                onCloseTransfer()
                toast({
                  title: t('asset.detail.menu.transfer.transactionSent'),
                  description: tx.hash,
                  status: 'success'
                })
            }
          })
          .catch(e => {
            toast({
              title: "Error",
              description: String(e),
              status: "error"
            })
            console.error(e)
          })
        }else{
          toast({
            title: "Error",
            description: t('asset.detail.menu.transfer.signerError'),
            status: "error"
          })
        }
      } catch(e){
        toast({
          title: "Error",
          description: String(e),
          status: "error"
        })
        console.error(e)
      }
    },
  [transferAsset, toast, t, onCloseTransfer, signer]
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
              <TokenMedia
                image={asset.image}
                animationUrl={asset.animationUrl}
                unlockedContent={showPreview ? undefined : asset.unlockedContent}
                defaultText={asset.name}
                controls
                sizes="
                (min-width: 80em) 500px,
                (min-width: 48em) 50vw,
                100vw"
              />
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
          <Flex direction="column" my="auto" gap={8} p={0}>
            <Flex justify="space-between">
              <Box>
                {asset.collection.name && (
                  <Heading as="p" variant="heading2" color="gray.500">
                    <Link
                      href={`/collection/${asset.collection.chainId}/${asset.collection.address}`}
                    >
                      {asset.collection.name}
                    </Link>
                  </Heading>
                )}
                <Heading as="h1" variant="title" color="brand.black">
                  {asset.name}
                </Heading>
              </Box>
              <Flex direction="row" align="flex-start" gap={3}>
                <Button onClick={onOpenShare} fontSize={14} variant='icon' color='brand.black' rightIcon={<FaShare/>} />
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
                      <MenuItem onClick={onOpenTransfer}>
                        {t('asset.detail.menu.transfer.label')}
                      </MenuItem>
                    }
                    </>)
                    }
                    <MenuItem onClick={() => refreshMetadata(asset.id)}>
                      {t('asset.detail.menu.refresh-metadata')}
                    </MenuItem>
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
            assetId={asset.id}
            creator={creator}
            owners={owners}
            numberOfOwners={asset.ownerships.totalCount}
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
              {asset.animationUrl
              ?
              <Menu>
                <MenuButton as={Button} size='full' px={6} py={3} rightIcon={<HiOutlineChevronDown/>}>
                {t('asset.detail.ipfsLink')}
                </MenuButton>
                <MenuList>
                  <MenuItem as={Link} isExternal href={asset.image}>
                    <Text as="span" isTruncated pl={2}>
                      {t('asset.detail.ipfsLink')}
                    </Text>
                    <HiOutlineExternalLink />
                  </MenuItem>
                  <MenuItem as={Link} isExternal href={asset.animationUrl}>
                    <Text as="span" isTruncated pl={2}>
                      {t('asset.detail.ipfsLink')}
                    </Text>
                    <HiOutlineExternalLink />
                  </MenuItem>
                </MenuList>
              </Menu>
              :
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
              }

            </Flex>

            {traits && (
              <Box pt={8}>
                <Heading as="h4" variant="heading2" color="brand.black" pb={3}>
                  {t('asset.detail.traits')}
                </Heading>
                <TraitList traits={traits} />
              </Box>
            )}
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
                <ChakraLink
                  key={index}
                  href={tab.href}
                  whiteSpace="nowrap"
                  mr={4}
                >
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
                totalOwned={totalOwned}
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
    <Modal isOpen={isOpenTransfer} onClose={onCloseTransfer} isCentered size={'lg'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading>
              {t('asset.detail.menu.transfer.title')}
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text variant='text-sm'>
              {t('asset.detail.menu.transfer.description')}<strong>{' '+environment.NETWORK_NAME}</strong>
            </Text>
            <InputGroup>
                <label>
                  {t('asset.detail.menu.transfer.account')}
                    <Input
                      placeholder={t('asset.detail.menu.transfer.account')}
                      value={accountToSend}
                      onChange={(e) => setAccountToSend(e.target.value)}
                      size='lg'
                      fontSize={'sm'}
                    />
                </label>
            </InputGroup>
            <InputGroup>
                <label>
                  {t('asset.detail.menu.transfer.amount')}
                    <NumberInput
                    placeholder={t('asset.detail.menu.transfer.amount')}
                    size='lg'
                    w="full"
                    defaultValue={1}
                    value={amountToSend}
                    step={1}
                    clampValueOnBlur={false}
                    min={1}
                    onChange={(e) => setAmountToSend(e)}
                    >
                        <NumberInputField/>
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </label>
            </InputGroup>
            <Button
                disabled={
                  ( 
                    amountToSend === '0' ||
                    Number(amountToSend) === 0 ||
                    accountToSend==='' ||
                    !ethers.utils.isAddress(accountToSend)
                  ) 
                  ? true 
                  : false
                }
                width="full"
                my={6}
                onClick={()=>handleTransfer(asset.id, account ? account : '', accountToSend, amountToSend)}
            >
                <Text as="span" isTruncated>
                  {t('asset.detail.menu.transfer.label')}
                </Text>
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <ShareModal isOpen={isOpenShare} onClose={onCloseShare} link={environment.BASE_URL+'/tokens/'+data?.asset?.id}/>
    </main>
  )
}

export default DetailPage
