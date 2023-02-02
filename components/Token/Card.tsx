import { Flex, Heading, Stack } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { useMemo, VFC } from 'react'
import Link from '../Link/Link'
import SaleAuctionCardFooter from '../Sales/Auction/CardFooter'
import SaleDirectCardFooter from '../Sales/Direct/CardFooter'
import SaleOpenCardFooter from '../Sales/Open/CardFooter'
import Avatar from '../User/Avatar'
import TokenMedia from './StaticMedia'

export type Props = {
  asset: {
    id: string
    name: string
    image: string
    unlockedContent: { url: string; mimetype: string | null } | null
    animationUrl: string | null | undefined
  }
  creator: {
    address: string
    name: string | null | undefined
    image: string | null | undefined
    verified: boolean
  }
  auction:
    | {
        endAt: Date
        bestBid:
          | {
              unitPrice: BigNumber
              currency: {
                decimals: number
                symbol: string
              }
            }
          | undefined
      }
    | undefined
  sale:
    | {
        unitPrice: BigNumber
        currency: {
          decimals: number
          symbol: string
        }
      }
    | undefined
  numberOfSales: number
  hasMultiCurrency: boolean
  isPreview?: boolean
}

const TokenCard: VFC<Props> = ({
  asset,
  creator,
  auction,
  sale,
  numberOfSales,
  hasMultiCurrency,
  isPreview
}) => {
  const href = asset.id ? `/tokens/${asset.id}` : '#'
  const footer = useMemo(() => {
    if (isPreview) return
    if (auction)
      return (
        <SaleAuctionCardFooter
          href={href}
          endAt={auction.endAt}
          bestBid={auction.bestBid}
        />
      )
    if (sale)
      return (
        <SaleDirectCardFooter
          href={href}
          unitPrice={sale.unitPrice}
          currency={sale.currency}
          numberOfSales={numberOfSales}
          hasMultiCurrency={hasMultiCurrency}
        />
      )
    return <SaleOpenCardFooter href={href} />
  }, [auction, sale, numberOfSales, hasMultiCurrency, isPreview, href])

  // TODO: is the width correct?
  return (
    <Flex
      direction="column"
      h="min-content"
      w={72}
      maxW={72}
      align="stretch"
      overflow="hidden"
      rounded="xl"
      borderWidth="1px"
      borderColor="gray.200"
      bgColor="white"
      position='relative'
    >
      <Flex
        as={Link}
        href={href}
        h={72}
        minW={72}
        overflow='hidden'
        style={{position: 'absolute', left: '50%', transform: 'translateX(-50%)'}}
      >
        <TokenMedia
          image={asset.image}
          animationUrl={asset.animationUrl}
          unlockedContent={asset.unlockedContent}
          defaultText={asset.name}
          objectFit="cover"
          width={288}
          height={288}
          layout="fixed"
        />
      </Flex>
      <Stack spacing={3} p={6} mt={72}>
        <Link href={href}>
          <Heading
            as="h4"
            variant="heading2"
            color="brand.black"
            title={asset.name}
            isTruncated
          >
            {asset.name}
          </Heading>
        </Link>
        <Avatar
          address={creator.address}
          image={creator.image}
          name={creator.name}
          verified={creator.verified}
        />
        {footer && footer}
      </Stack>
    </Flex>
  )
}

export default TokenCard
