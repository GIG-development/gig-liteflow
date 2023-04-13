import {
    AspectRatio,
    Box,
    Flex,
    Heading,
    HStack,
    Icon,
    Stack,
    Text,
  } from '@chakra-ui/react'
  import { BigNumber } from '@ethersproject/bignumber'
  import { HiClock } from '@react-icons/all-files/hi/HiClock'
  import Countdown from 'components/Countdown/Countdown'
  import { useMemo, useState, VFC } from 'react'
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
      collection: {
        address: string
        name: string
        chainId: number
      }
      image: string
      unlockedContent: { url: string; mimetype: string | null } | null
      animationUrl: string | null | undefined
      owned: BigNumber
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
          id: string
          unitPrice: BigNumber
          currency: {
            decimals: number
            symbol: string
          }
        }
      | undefined
    numberOfSales: number
    displayCreator?: boolean
    hasMultiCurrency: boolean
    isPreview?: boolean
  }
  
  const TokenListRow: VFC<Props> = ({
    asset,
    creator,
    auction,
    sale,
    numberOfSales,
    displayCreator = false,
    hasMultiCurrency,
    isPreview
  }) => {
    const href = asset.id ? `/tokens/${asset.id}` : '#'
    const isOwner = useMemo(() => asset.owned.gt('0'), [asset])
    const [isHovered, setIsHovered] = useState(false)
    const footer = useMemo(() => {
      if (isPreview) return
      if (auction)
        return (
          <SaleAuctionCardFooter
            assetId={asset.id}
            bestBid={auction.bestBid}
            isOwner={isOwner}
            showButton={isHovered}
          />
        )
      if (sale)
        return (
          <SaleDirectCardFooter
            saleId={sale.id}
            unitPrice={sale.unitPrice}
            currency={sale.currency}
            numberOfSales={numberOfSales}
            hasMultiCurrency={hasMultiCurrency}
            isOwner={isOwner}
            showButton={isHovered}
          />
        )
      return (
        <SaleOpenCardFooter
          assetId={asset.id}
          bestBid={asset.bestBid}
          isOwner={isOwner}
          showButton={isHovered}
        />
      )
    }, [
      auction,
      asset.id,
      asset.bestBid,
      isOwner,
      isHovered,
      sale,
      numberOfSales,
      hasMultiCurrency,
      isPreview
    ])
  
    // TODO: is the width correct?
    return (
      <Flex
        direction="row"
        w="full"
        overflow="hidden"
        rounded="xl"
        borderWidth="1px"
        borderColor="gray.200"
        bgColor="white"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        _hover={{
          shadow: '1px 0px 8px 6px #f2f2f2'
        }}
      >
        <Flex as={Link} href={href} w="100px" position="relative">
          <AspectRatio w="100px" ratio={1}>
            <TokenMedia
              image={asset.image}
              animationUrl={asset.animationUrl}
              unlockedContent={asset.unlockedContent}
              defaultText={asset.name}
              // sizes determined from the explorer page
              sizes="
              (min-width: 80em) 292px,
              (min-width: 62em) 25vw,
              (min-width: 48em) 33vw,
              (min-width: 30em) 50vw,
              100vw"
            />
          </AspectRatio>
          {auction && (
            <HStack
              position="absolute"
              left={4}
              right={4}
              bottom={4}
              bgColor="white"
              rounded="full"
              justify="center"
              spacing={1}
              px={4}
              py={0.5}
            >
              <Icon as={HiClock} h={5} w={5} color="gray.500" />
              <Text as="span" variant="subtitle2" color="gray.500">
                <Countdown date={auction.endAt} hideSeconds />
              </Text>
            </HStack>
          )}
        </Flex>
        <Flex justify="space-between" w='full' p={6} align="start">
          <Stack spacing={2} w="auto">
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
            {displayCreator ? (
              <Avatar
                address={creator.address}
                image={creator.image}
                name={creator.name}
                verified={creator.verified}
                size={5}
              />
            ) : (
              <Link
                href={`/collection/${asset.collection.chainId}/${asset.collection.address}`}
              >
                <Text variant="subtitle2" color="gray.500" isTruncated>
                  {asset.collection.name}
                </Text>
              </Link>
            )}
          </Stack>
            <Box w='auto' h='50px' mr='-20px' pt={2}>
                {footer && footer}
            </Box>
        </Flex>
      </Flex>
    )
  }
  
  export default TokenListRow
  