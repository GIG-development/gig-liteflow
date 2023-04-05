import { Button, Flex, Text } from '@chakra-ui/react'
import { Signer } from '@ethersproject/abstract-signer'
import { HiArrowNarrowRight } from '@react-icons/all-files/hi/HiArrowNarrowRight'
import environment from 'environment'
import useTranslation from 'next-translate/useTranslation'
import { useState, useEffect, useMemo, VFC, useCallback } from 'react'
import { BlockExplorer } from '../../../hooks/useBlockExplorer'
import Link from '../../Link/Link'
import type { Props as ModalProps } from './Modal'
import SaleDirectModal from './Modal'

export type Props = {
  assetId: string
  blockExplorer: BlockExplorer
  isHomepage: boolean
  sales: ModalProps['sales']
  signer: Signer | undefined
  currentAccount: string | null | undefined
  ownAllSupply: boolean
  onOfferCanceled: (id: string) => Promise<void>
}

const SaleDirectButton: VFC<Props> = ({
  assetId,
  blockExplorer,
  isHomepage,
  sales,
  signer,
  currentAccount,
  ownAllSupply,
  onOfferCanceled,
}) => {
  const { t } = useTranslation('components')
  const [moonpaySignedUrl, setMoonpaySignedUrl] = useState('')

  const getMoonpaySignerUrl = useCallback( () => {
    if(signer && assetId){
      signer.getAddress().then( walletAddress  => {
        const urlParamsForWidget = `/nft?apiKey=${environment.MOONPAY_API_KEY}&contractAddress=${assetId.split("-")[1]}&tokenId=${assetId.split("-")[2]}&listingId=${assetId}&walletAddress=${walletAddress}`
        fetch(`https://testnet.gig.io/api/mp/sign?url=${encodeURIComponent(urlParamsForWidget.toString())}`)
          .then(res => res?.json())
          .then(data => {
            console.log(`Sent URL params: ${data?.params}`)
            console.log(`Widget URL request before sign: https://testnet.gig.io/api/mp/sign?url=${encodeURIComponent(urlParamsForWidget.toString())}`)
            console.log(`Signature: ${data?.signature}`)
            console.log(`Signed widget URL: https://buy-sandbox.moonpay.com${urlParamsForWidget}?signature=${data?.signature}`)
            setMoonpaySignedUrl(`https://buy-sandbox.moonpay.com${urlParamsForWidget}?signature=${data?.signature}`)
          })
          .catch(e => console.error(e))
      })
      .catch(e => console.error(e))
    }
  }, [assetId,signer])

  useEffect(()=>{
    if(environment.CHAIN_ID === 5){
      getMoonpaySignerUrl()
    }
  },[getMoonpaySignerUrl])

  const bid = useMemo(() => {
    if (ownAllSupply) return
    return (
      <Button
        as={Link}
        href={`/tokens/${assetId}/bid`}
        variant="outline"
        colorScheme="gray"
        border='1px solid'
        borderColor='gray.100'
        size="full"
        p={3}
        fontSize={{base: 'xs', md: 'sm'}}
        isFullWidth
      >
        <Text as="span" isTruncated>
          {t('sales.direct.button.place-bid')}
        </Text>
      </Button>
    )
  }, [ownAllSupply, assetId, t])

  const buyNow = useMemo(() => {
    if (sales.length !== 1) return
    if (!sales[0]) return
    if (ownAllSupply) return
    return (
      <>
      <Button as={Link} href={`/checkout/${sales[0].id}`} size="full" className='btn'>
        <Text as="span" isTruncated>
          {t('sales.direct.button.buy')}
        </Text>
      </Button>
      {(moonpaySignedUrl && signer) &&
        <Button as={Link} href={moonpaySignedUrl} isExternal size="full" className='btn'>
          <Text as="span" isTruncated>
            {t('sales.direct.button.moonpay')}
          </Text>
        </Button>
      }
      </>
    )
  }, [sales, ownAllSupply, t, moonpaySignedUrl, signer])

  const seeOffers = useMemo(() => {
    if (sales.length <= 1) return
    return (
      <SaleDirectModal
        blockExplorer={blockExplorer}
        signer={signer}
        currentAccount={currentAccount}
        sales={sales}
        onOfferCanceled={onOfferCanceled}
      />
    )
  }, [sales, currentAccount, signer, onOfferCanceled, blockExplorer])

  if (ownAllSupply && isHomepage)
    return (
      <Button
        as={Link}
        href={`/tokens/${assetId}`}
        variant="outline"
        colorScheme="gray"
        size="full"
        bgColor="white"
        border='1px solid'
        borderColor='gray.100'
        isFullWidth
        rightIcon={<HiArrowNarrowRight />}
      >
        <Text as="span" isTruncated>
          {t('sales.direct.button.view')}
        </Text>
      </Button>
    )

  if (!bid && !buyNow && !seeOffers) return null

  return (
    <Flex gap={6} direction={{ base: 'column', md: 'row' }}>
      {bid}
      {buyNow}
      {seeOffers}
    </Flex>
  )
}

export default SaleDirectButton
