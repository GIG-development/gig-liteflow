import {
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
import environment from 'environment'
import { useEffect } from 'react'

const CryptoPage: NextPage = () => {
  const { account } = useWeb3React()
  const ready = useEagerConnect()
  useLoginRedirect(ready)

  useEffect(()=>{
    if(account){
      new RampInstantSDK({
        hostAppName: 'GIG',
        hostLogoUrl: 'https://gig.io/logo_beta_bn.png',
        hostApiKey: environment.RAMP_API_KEY,
        userAddress: account,
        // variant: 'embedded-mobile',
        // containerNode: document.getElementById('ramp-container') || undefined,
        selectedCountryCode: 'MX',
        defaultAsset: 'GOERLI_ETH',
        url: 'https://app.demo.ramp.network'
      }).show()
    }
  },[account])

  if (!account) return <></>

  return (
    <main id="buy-crypto">
      <SmallLayout>
        <Head title="Comprar Criptomonedas - Wallet" />
        <Heading as={'h1'} variant='title'>Comprar Criptomonedas</Heading>
        <Flex w='full' justifyContent='center' 
        //id='ramp-container' minW='320px' minH='670px'
        >
        </Flex>
      </SmallLayout>
    </main>
  )
}

export default CryptoPage
