import {
    Alert,
    AlertIcon,
    Box,
    Center,
    Heading,
    Icon,
    Stack,
    Text,
    useToast,
  } from '@chakra-ui/react'
  import { HiBadgeCheck } from '@react-icons/all-files/hi/HiBadgeCheck'
  import { useWeb3React } from '@web3-react/core'
  import { NextPage } from 'next'
  import Trans from 'next-translate/Trans'
  import useTranslation from 'next-translate/useTranslation'
  import { useRouter } from 'next/router'
  import React, { useCallback, useMemo } from 'react'
  import Head from '../../../components/Head'
  import Link from '../../../components/Link/Link'
  import BackButton from '../../../components/Navbar/BackButton'
  import CollectionFormCreate from '../../../components/Collection/Form/Create'
  import connectors from '../../../connectors'
  import environment from '../../../environment'
  import {
    useCheckUserVerificationStatusQuery
  } from '../../../graphql'
  import useBlockExplorer from '../../../hooks/useBlockExplorer'
  import useEagerConnect from '../../../hooks/useEagerConnect'
  import useSigner from '../../../hooks/useSigner'
  import SmallLayout from '../../../layouts/small'
  import {event} from 'nextjs-google-analytics'
  
  type Props = {
    chainId: number
    currentAccount: string | null
  }
  
  const Layout = ({ children }: { children: React.ReactNode }) => (
    <main id="create-form">
      <SmallLayout>
        <Head
          title="Create Collectible"
          description="Create Collectible securely stored on blockchain"
        />
        {children}
      </SmallLayout>
    </main>
  )
  
  const CreateCollectionPage: NextPage<Props> = ({
    currentAccount,
  }) => {
    const ready = useEagerConnect()
    const signer = useSigner()
    const { t } = useTranslation('templates')
    const { back } = useRouter()
    const { account } = useWeb3React()
    const toast = useToast()
    const { data } = useCheckUserVerificationStatusQuery({
      variables: {
        address: (ready ? account?.toLowerCase() : currentAccount) || '',
      },
    })

    const verified = useMemo(()=>{
      return data?.account?.verification?.status === 'VALIDATED' ? true : false
    },[data])
  
    const blockExplorer = useBlockExplorer(
      environment.BLOCKCHAIN_EXPLORER_NAME,
      environment.BLOCKCHAIN_EXPLORER_URL,
    )

    const onCreated = useCallback(
      async (collectionAddress: string) => {
        event("NewNFTcollectionCreated", {
          category: "Interaction",
          label: collectionAddress.toString()
        })
      },
      [t, toast, data],
    )
  
    if (environment.RESTRICT_TO_VERIFIED_ACCOUNT && !verified) {
      return (
        <Layout>
          <BackButton onClick={back} />
          <Heading as="h1" variant="title" color="brand.black" mt={6} mb={12}>
            {t('asset.form.title.collection')}
          </Heading>
          <Stack align="center" spacing={6} mb={40}>
            <Center bgColor="brand.50" w={12} h={12} rounded="full">
              <Icon as={HiBadgeCheck} color="brand.500" w={6} h={6} />
            </Center>
            <Stack textAlign="center">
              <Heading variant="heading1">{t('asset.restricted.title')}</Heading>
              <Text pb={2} color="gray.500">
                <Trans
                  ns="templates"
                  i18nKey="asset.restricted.description"
                  components={[
                    <Link
                      fontWeight="bold"
                      href={`mailto:${environment.REPORT_EMAIL}`}
                      key="report"
                    >
                      {environment.REPORT_EMAIL}
                    </Link>,
                  ]}
                />
              </Text>
            </Stack>
            <Alert
              status="info"
              rounded="xl"
              borderWidth="1px"
              borderColor="blue.300"
            >
              <AlertIcon />
              <Text variant="subtitle2">{t('asset.restricted.info')}</Text>
            </Alert>
          </Stack>
        </Layout>
      )
    }

    return (
      <Layout>
        <BackButton onClick={back} />
        <Heading as="h1" variant="title" color="brand.black" mt={6}>
            {t('asset.form.title.collection')}
        </Heading>
  
        <Box
          mt={12}
          mb={6}
          gap={12}
        >
            <CollectionFormCreate
              signer={signer}
              blockExplorer={blockExplorer}
              onCreated={onCreated}
              login={{
                ...connectors,
                networkName: environment.NETWORK_NAME,
              }}
            />
        </Box>
      </Layout>
    )
  }
  
  export default CreateCollectionPage
  