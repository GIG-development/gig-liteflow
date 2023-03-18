import {
    Button,
    Flex,
    Heading
} from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { NextPage } from 'next'
import Head from '../../components/Head'
import useEagerConnect from '../../hooks/useEagerConnect'
import useLoginRedirect from '../../hooks/useLoginRedirect'
import SmallLayout from '../../layouts/small'
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { event } from 'nextjs-google-analytics'
import environment from 'environment'

const CryptoPage: NextPage = () => {
  const ready = useEagerConnect()
  const { account } = useWeb3React()
  useLoginRedirect(ready)
  const router = useRouter()

  useEffect(()=>{
    if(environment.CHAIN_ID === 5 && account){
        new RampInstantSDK({
            hostAppName: 'GIG Marketplace',
            hostLogoUrl: 'https://gig.io/logo_beta_bn.png',
            hostApiKey: '954gafgagmkm6awk2xyqhnmxm86m9jctbj3rmu5g',
            defaultFlow: 'ONRAMP',
            enabledFlows: ['ONRAMP'],
            fiatCurrency: 'USD',
            selectedCountryCode: 'MX',
            //swapAsset: 'ETH_',
            defaultAsset: 'ETH_ETH',
            userAddress: account ? account : undefined,
            url: 'https://app.demo.ramp.network',
        })
        .on('*', (e) => {
            event("CryptoPurchase", {
                category: "On-Ramp Crypto Purchase",
                label: JSON.stringify(e)
            })
        })
        .show()
    }
  },[account])

  if (!account) return <></>

  return (
    <main id="wallet">
      <SmallLayout>
        <Head title="Comprar Cryptomonedas - Wallet" />
        <Heading as={'h1'} variant='title'>Comprar Crypto</Heading>
        <Flex w='full' justifyContent='center'>
            <Button size='lg' onClick={router.reload} mt={6}>
                Comprar
            </Button>
        </Flex>
      </SmallLayout>
    </main>
  )
}

export default CryptoPage
