import {
  AspectRatio,
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react'
import { Signer } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import { useMemo, VFC } from 'react'
import { Standard } from '../../graphql'
import { BlockExplorer } from '../../hooks/useBlockExplorer'
import Link from '../Link/Link'
import type { Props as SaleDetailProps } from '../Sales/Detail'
import SaleDetail from '../Sales/Detail'
import TokenMedia from '../Token/StaticMedia'
import type { Props as TokenAssetProps } from '../Token/Metadata'
import TokenMetadata from '../Token/Metadata'

export type Props = {
  blockExplorer: BlockExplorer
  asset: {
    id: string
    name: string
    image: string
    animationUrl: string | null | undefined
    unlockedContent: { url: string; mimetype: string | null } | null | undefined
    saleSupply: BigNumber
    collection: {
      name: string
      address: string
      standard: Standard
      chainId: number
    }
    totalSupply: BigNumber
    owned: BigNumber
  }
  currencies: SaleDetailProps['currencies']
  creator: TokenAssetProps['creator']
  owners: TokenAssetProps['owners']
  numberOfOwners: TokenAssetProps['numberOfOwners']
  auction: SaleDetailProps['auction']
  bestBid: SaleDetailProps['bestBid']
  sales: SaleDetailProps['directSales']
  isHomepage: boolean
  signer: Signer | undefined
  currentAccount: string | null | undefined
  onOfferCanceled: (id: string) => Promise<void>
  onAuctionAccepted: (id: string) => Promise<void>
}

const TokenHeader: VFC<Props> = ({
  blockExplorer,
  asset,
  currencies,
  creator,
  owners,
  numberOfOwners,
  auction,
  bestBid,
  sales,
  isHomepage,
  signer,
  currentAccount,
  onOfferCanceled,
  onAuctionAccepted,
}) => {
  const isOwner = useMemo(() => asset.owned.gt('0'), [asset])

  const ownAllSupply = useMemo(
    () => asset.owned.gte(asset.totalSupply),
    [asset],
  )
  const isSingle = useMemo(
    () => asset.collection.standard === 'ERC721',
    [asset],
  )

  return (
    <SimpleGrid spacing={4} flex="0 0 100%" templateColumns={{ base: '1fr', md: '1fr 1fr' }} alignItems={{base: 'baseline', md: 'center'}} pr={{base: 0, lg: 6}} className="slider__slide-lg">
      <Box my="auto" p={{ base: 6, md: 12 }} textAlign="center">
        <Flex
          as={Link}
          href={`/tokens/${asset.id}`}
          mx="auto"
          maxH="sm"
          w="full"
          h="full"
          maxW="sm"
          align="center"
          justify="center"
          overflow="hidden"
          rounded="lg"
          shadow="md"
        >
          <AspectRatio w="full" ratio={1}>
            <TokenMedia
              image={asset.image}
              animationUrl={asset.animationUrl}
              unlockedContent={asset.unlockedContent}
              defaultText={asset.name}
              // sizes determined from the homepage
              sizes="
              (min-width: 30em) 384px,
              100vw"
            />
          </AspectRatio>
        </Flex>
      </Box>
      <Stack spacing={8} p={[6,12]}>
        <Stack spacing={1}>
          {asset.collection.name && (
            <Heading as="p" variant="heading1" color="gray.500" textAlign={{base: 'center', md: 'left'}}>
              <Link
                href={`/collection/${asset.collection.chainId}/${asset.collection.address}`}
              >
                {asset.collection.name}
              </Link>
            </Heading>
          )}
          <Heading as="h1" variant="title" color="brand.black" wordBreak='break-word' textAlign={{base: 'center', md: 'left'}}>
            {asset.name}
          </Heading>
        </Stack>
        <TokenMetadata
          assetId={asset.id}
          creator={creator}
          owners={owners}
          numberOfOwners={numberOfOwners}
          saleSupply={asset.saleSupply}
          standard={asset.collection.standard}
          totalSupply={asset.totalSupply}
          hideOwner
        />
        <SaleDetail
          blockExplorer={blockExplorer}
          assetId={asset.id}
          currencies={currencies}
          isHomepage={isHomepage}
          isOwner={isOwner}
          isSingle={isSingle}
          ownAllSupply={ownAllSupply}
          auction={auction}
          bestBid={bestBid}
          directSales={sales}
          signer={signer}
          currentAccount={currentAccount}
          onOfferCanceled={onOfferCanceled}
          onAuctionAccepted={onAuctionAccepted}
        />
      </Stack>
    </SimpleGrid>
  )
}

export default TokenHeader
