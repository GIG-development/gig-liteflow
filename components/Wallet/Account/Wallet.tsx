import {
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useBreakpointValue
} from '@chakra-ui/react'
import Link from 'components/Link/Link'
import environment from 'environment'
import useTranslation from 'next-translate/useTranslation'
import { FC } from 'react'
import WalletAddress from '../Address'
import WalletBalanceList from './WalletBalanceList'
import Trans from 'next-translate/Trans'

const WalletAccount: FC<{
  account: string
  currencies: {
    name: string
    id: string
    image: string
    decimals: number
    symbol: string
  }[]
  networkName: string
}> = ({ account, currencies, networkName }) => {
  const { t } = useTranslation('components')

  return (
    <Stack spacing={12} pt={12}>
      <Stack spacing={4}>
        <div>
          <Heading as="h2" variant="subtitle" color="brand.black">
            {t('wallet.wallet.deposit.title')}
          </Heading>
          <Text as="p" variant="text" color="gray.500">
            {t('wallet.wallet.deposit.description')}
          </Text>
          <Heading variant='heading3' mt={6} textAlign='center'>
            {t('wallet.wallet.network')}<br/>
            <Text fontWeight={'bold'}>{networkName}</Text>
          </Heading>
        </div>
        <Button variant="outline" colorScheme="gray" isFullWidth>
          <Text as="span" isTruncated>
            <WalletAddress address={account} isCopyable isShort={useBreakpointValue({base: true, md: false})} />
          </Text>
        </Button>
        <Flex flexDirection='column' align='center' justify='center'>
          <Button as={Link} className='btn' href={`${environment.BLOCKCHAIN_EXPLORER_URL}/address/${account}`} maxW='300px' isExternal>
            {t('wallet.wallet.transactions')}
          </Button>
          <Text variant='text-sm' pt={2} textAlign='center'>
            <Trans
              ns="components"
              i18nKey={'wallet.magic.export'}
              components={[
                <Link href='https://reveal.magic.link/gig' textDecoration='underline' isExternal key='exportMagicWallet'/>
              ]}
            />
          </Text>
        </Flex>
        {/*
        <Alert status="warning" borderRadius="xl">
          <AlertIcon />
          <Box fontSize="sm">
            <AlertTitle>
              {t('wallet.wallet.banner.title', { networkName })}
            </AlertTitle>
            <AlertDescription>
              {t('wallet.wallet.banner.description', { networkName })}
            </AlertDescription>
          </Box>
        </Alert>
        */}
      </Stack>
      <hr />
      <Stack spacing={6}>
        <Heading as="h2" variant="subtitle" color="brand.black">
          {t('wallet.wallet.balances')}
        </Heading>
        <WalletBalanceList currencies={currencies} account={account} />
      </Stack>
    </Stack>
  )
}

export default WalletAccount
