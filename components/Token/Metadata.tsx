import { Flex, Heading, Icon, Stack, Text } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { IoImageOutline } from '@react-icons/all-files/io5/IoImageOutline'
import useTranslation from 'next-translate/useTranslation'
import { VFC } from 'react'
import { Standard } from '../../graphql'
import Avatar from '../User/Avatar'
import OwnersModal from './Owners/Modal'
import Supply from './Supply'

export type Props = {
  assetId: string
  standard: Standard
  creator:
    | {
        address: string
        name: string | null | undefined
        image: string | null | undefined
        verified: boolean
      }
    | undefined
  owners: {
    address: string
    image: string | null | undefined
    name: string | null | undefined
    verified: boolean
    quantity: string
  }[]
  numberOfOwners: number
  saleSupply: BigNumber
  totalSupply: BigNumber | null | undefined
  hideOwner?: boolean
}

const TokenMetadata: VFC<Props> = ({
  assetId,
  standard,
  creator,
  owners,
  numberOfOwners,
  saleSupply,
  totalSupply,
  hideOwner
}) => {
  const { t } = useTranslation('components')
  return (
    <Flex
      wrap="wrap"
      flexDirection='row'
      alignItems='center'
      justifyContent={{base: 'center', md: 'flex-start'}}
      gap={6}
    >
      {creator && (
        <Stack spacing={3}>
          <Heading as="h5" variant="heading3" color="gray.500" textAlign={{base: 'center', md: 'left'}} fontSize={{base: 'xs', md: 'sm'}} fontWeight={{base: 'bold', md: 'normal'}}>
            {t('token.metadata.creator')}
          </Heading>
          <Avatar
            address={creator.address}
            image={creator.image}
            name={creator.name}
            verified={creator.verified}
          />
        </Stack>
      )}
      {!hideOwner && numberOfOwners === 1 && owners[0] && (
        <Stack spacing={3}>
          <Heading as="h5" variant="heading3" color="gray.500" textAlign={{base: 'center', md: 'left'}} fontSize={{base: 'xs', md: 'sm'}} fontWeight={{base: 'bold', md: 'normal'}}>
            {t('token.metadata.owner')}
          </Heading>
          <Avatar
            address={owners[0].address}
            image={owners[0].image}
            name={owners[0].name}
            verified={owners[0].verified}
          />
        </Stack>
      )}
      {!hideOwner && numberOfOwners > 1 && (
        <Stack spacing={3}>
          <Heading as="h5" variant="heading3" color="gray.500" textAlign={{base: 'center', md: 'left'}} fontSize={{base: 'xs', md: 'sm'}} fontWeight={{base: 'bold', md: 'normal'}}>
            {t('token.metadata.owners')}
          </Heading>
          <OwnersModal
            assetId={assetId}
            ownersPreview={owners}
            numberOfOwners={numberOfOwners}
          />
        </Stack>
      )}
      {standard === 'ERC721' && (
        <Stack spacing={3}>
          <Heading as="h5" variant="heading3" color="gray.500" textAlign={{base: 'center', md: 'left'}} fontSize={{base: 'xs', md: 'sm'}} fontWeight={{base: 'bold', md: 'normal'}}>
            {t('token.metadata.edition')}
          </Heading>
          <Flex align="center" display="inline-flex" h="full">
            <Icon as={IoImageOutline} mr={2} h={4} w={4} color="gray.500" />
            <Text as="span" variant="subtitle2" color="gray.500">
              {t('token.metadata.single')}
            </Text>
          </Flex>
        </Stack>
      )}
      {standard === 'ERC1155' && (
        <Stack spacing={3}>
          <Heading as="h5" variant="heading3" color="gray.500" textAlign={{base: 'center', md: 'left'}} fontSize={{base: 'xs', md: 'sm'}} fontWeight={{base: 'bold', md: 'normal'}}>
            {t('token.metadata.edition')}
          </Heading>
          <Supply
            small
            current={saleSupply}
            total={totalSupply || BigNumber.from('0')}
          />
        </Stack>
      )}
    </Flex>
  )
}

export default TokenMetadata
