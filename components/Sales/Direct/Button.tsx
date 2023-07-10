import { 
  Button, 
  Flex, 
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { Signer } from '@ethersproject/abstract-signer'
import { HiArrowNarrowRight } from '@react-icons/all-files/hi/HiArrowNarrowRight'
import { HiOutlineChevronDown } from '@react-icons/all-files/hi/HiOutlineChevronDown'
import { BsCreditCard } from '@react-icons/all-files/bs/BsCreditCard' 
import { FaEthereum } from '@react-icons/all-files/fa/FaEthereum'
import environment from 'environment'
import useTranslation from 'next-translate/useTranslation'
import { useState, useEffect, useMemo, VFC } from 'react'
import { BlockExplorer } from '../../../hooks/useBlockExplorer'
import useMoonpayCheckout from 'hooks/useMoonpayCheckout'
import Link from '../../Link/Link'
import type { Props as ModalProps } from './Modal'
import SaleDirectModal from './Modal'
import { CrossmintPayButton } from '@crossmint/client-sdk-react-ui'

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
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [moonpaySignedUrl, setMoonpaySignedUrl] = useState('')
  const getMoonpaySignerUrl = useMoonpayCheckout()
  useEffect(()=>{
    if(environment.CHAIN_ID === 5){
      setMoonpaySignedUrl(getMoonpaySignerUrl(assetId,signer))
    }
  },[getMoonpaySignerUrl, assetId, signer])

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
        px={6}
        py={3}
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

    if (moonpaySignedUrl && signer){
      return (
        <Menu>
          <MenuButton as={Button} size='full' px={6} py={3} rightIcon={<HiOutlineChevronDown/>}>
            {t('sales.direct.button.buy')}
          </MenuButton>
          <MenuList>
            <MenuItem as={Link} href={`/checkout/${sales[0].id}`}>
              <FaEthereum/>
              <Text as="span" isTruncated pl={2}>
                {t('sales.direct.button.crypto')}
              </Text>
            </MenuItem>
            <MenuItem onClick={onOpen}>
              {/* <BsCreditCard/>
               <Text as="span" isTruncated pl={2}>
                {t('sales.direct.button.moonpay')}
                <br/>
                <Text fontSize={10}>
                  {t('sales.direct.button.moonpayLink')}
                </Text>
              </Text> */}
              <CrossmintPayButton 
                clientId="9d29e69d-df58-4d8b-b377-bee4c15da8e2"
                mintConfig={{
                  type: "reservoir-secondary-eth",
                  contractAddress: assetId.split('-')[1],
                  tokenId: assetId
                }}
                environment="staging"
              />
            </MenuItem>
          </MenuList>
        </Menu>
      )
    }

    return (
      <>
      <Button as={Link} href={`/checkout/${sales[0].id}`} size="full" className='btn'>
        <Text as="span" isTruncated>
          {t('sales.direct.button.buy')}
        </Text>
      </Button>
      { environment.CHAIN_ID === 5 &&
      <CrossmintPayButton 
      clientId="9d29e69d-df58-4d8b-b377-bee4c15da8e2"
      mintConfig={{
        type: "reservoir-secondary-eth",
        contractAddress: assetId.split('-')[1],
        tokenId: assetId
      }}
      environment="staging"
    />
      }
      </>
    )
  }, [sales, ownAllSupply, t, moonpaySignedUrl, signer, onOpen])

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
  <>
    <Flex gap={6} direction={{ base: 'column', md: 'row' }}>
      {bid}
      {buyNow}
      {seeOffers}
    </Flex>
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent minW={'475px'} minH={'650px'}>
          <ModalBody>
            <iframe src={moonpaySignedUrl} style={{width: '100%', height: '650px'}}/>
          </ModalBody>
      </ModalContent>
    </Modal>
  </>
  )
}

export default SaleDirectButton
