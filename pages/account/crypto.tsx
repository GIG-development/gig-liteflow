import {
    Button,
    Flex,
    Heading
} from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { NextPage } from 'next'
import Head from '../../components/Head'
import Link from 'components/Link/Link'
import useEagerConnect from '../../hooks/useEagerConnect'
import useLoginRedirect from '../../hooks/useLoginRedirect'
import SmallLayout from '../../layouts/small'
import { useRouter } from 'next/router'
import environment from 'environment'

const CryptoPage: NextPage = () => {
  const { locale } = useRouter()
  const { account } = useWeb3React()
  const ready = useEagerConnect()
  useLoginRedirect(ready)

  if (!account) return <></>

  return (
    <main id="wallet">
      <SmallLayout>
        <Head title="Comprar Cryptomonedas - Wallet" />
        <Heading as={'h1'} variant='title'>Comprar Crypto</Heading>
        <Flex w='full' justifyContent='center'>
            <Button 
              as={Link} 
              href={(environment.CHAIN_ID === 5 && account) ? `https://buy-sandbox.moonpay.com?currencyCode=eth&colorCode=%23BE94FF&language=${locale}&apiKey=${environment.MOONPAY_API_KEY}` : '#'}
              isExternal
              size='lg'
              mt={6}>
                Comprar
            </Button>
        </Flex>
      </SmallLayout>
    </main>
  )
}

export default CryptoPage
