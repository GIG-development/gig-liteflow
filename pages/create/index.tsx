import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  Spinner,
  Stack,
  Text,
  useToast
} from '@chakra-ui/react'
import { BsFillPersonCheckFill } from '@react-icons/all-files/bs/BsFillPersonCheckFill'
import { HiExclamationCircle } from '@react-icons/all-files/hi/HiExclamationCircle'
import { IoImageOutline } from '@react-icons/all-files/io5/IoImageOutline'
import { IoImagesOutline } from '@react-icons/all-files/io5/IoImagesOutline'
import { useWeb3React } from '@web3-react/core'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import React, { useState, FC, PropsWithChildren, useEffect } from 'react'
import Empty from '../../components/Empty/Empty'
import Head from '../../components/Head'
import Link from '../../components/Link/Link'
import BackButton from '../../components/Navbar/BackButton'
import environment from '../../environment'
import {
  CollectionFilter,
  FetchCollectionsAndAccountVerificationStatusDocument,
  FetchCollectionsAndAccountVerificationStatusQuery,
  FetchCollectionsAndAccountVerificationStatusQueryVariables,
  useFetchCollectionsAndAccountVerificationStatusQuery,
} from '../../graphql'
import useSigner from '../../hooks/useSigner'
import { useVerifyAccount } from '@nft/hooks'
import useEagerConnect from '../../hooks/useEagerConnect'
import SmallLayout from '../../layouts/small'
import { wrapServerSideProps } from '../../props'
import {event} from 'nextjs-google-analytics'

const collectionsFilter = {
  or: environment.MINTABLE_COLLECTIONS.map(({ chainId, address }) => ({
    chainId: { equalTo: chainId },
    address: { equalTo: address },
  })),
} as CollectionFilter

export const getServerSideProps = wrapServerSideProps(
  environment.GRAPHQL_URL,
  async (context, client) => {
    const { data, error } = await client.query<
      FetchCollectionsAndAccountVerificationStatusQuery,
      FetchCollectionsAndAccountVerificationStatusQueryVariables
    >({
      query: FetchCollectionsAndAccountVerificationStatusDocument,
      variables: {
        account: context.user.address || '',
        collectionFilter: collectionsFilter,
        fetchCollections: environment.MINTABLE_COLLECTIONS.length > 0,
      },
    })
    if (error) throw error
    if (!data) throw new Error('data is falsy')
    return {
      props: {},
    }
  },
)

const Layout = ({ children }: { children: React.ReactNode }) => (
  <SmallLayout>
    <Head
      title="Crear un NFT"
      description="Convierte tu talento en NFTs almacenados en la blockchain"
    >
      <script src="//embed.typeform.com/next/embed.js"></script>
    </Head>
    {children}
  </SmallLayout>
)

const CreatePage: NextPage = () => {
  const ready = useEagerConnect()
  const { t } = useTranslation('templates')
  const { back } = useRouter()
  const { account } = useWeb3React()
  const signer = useSigner()
  const [verifyAccount, { loading }] = useVerifyAccount(signer)
  const toast = useToast()
  const { data, called } = useFetchCollectionsAndAccountVerificationStatusQuery(
    {
      variables: {
        account: account?.toLowerCase() || '',
        collectionFilter: collectionsFilter,
        fetchCollections: environment.MINTABLE_COLLECTIONS.length > 0,
      },
      skip: !ready,
    },
  )

  const [requested, setRequested] = useState(false)
  const [loadedUser, setLoadedUser] = useState(false)

  useEffect(()=>{
    if(signer){
      setLoadedUser(true)
    }else{
      if(!data?.account){
        location.href = "/login"
      }
    }
  },[signer, data])

  const handleVerificationRequest = async () => {
    //If user has requested verification already
    if(data?.account?.verification?.status === 'PENDING' || requested){
      toast({
        title: t('asset.restricted.requested.title'),
        description: t('asset.restricted.requested.again'),
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
      return
    }

    if(signer){
      void requestVerification()
    }else{
      document.location = '/login'
    }
  }

  const requestVerification = async () => {
    try{
      await verifyAccount() 
      .then(status=>{
        if(status==='PENDING'){
          setRequested(true)
          toast({
            title: t('asset.restricted.requested.title'),
            description: t('asset.restricted.requested.first'),
            status: 'success',
            duration: 5000,
            isClosable: true
          })
          event("UserVerificationRequest", {
            category: "Contact",
            label: data?.account?.address.toString().toLowerCase() || '0x'
          })
        }
      })
    } catch (e) {
      toast({
        title: "Error",
        description: t('asset.restricted.requested.error'),
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      console.error(e)
    }
  }

  if(!loadedUser){
    return (
      <Stack align="center" spacing={6} my={40}>
        <Spinner
          color="brand.500"
          h={6}
          w={6}
          thickness="2px"
          speed="0.65s"
        />
      </Stack>
    )
  }

  if(loading){
    return (
      <Stack align="center" spacing={6} my={40}>
        <Heading variant="heading1">{t('asset.restricted.requested.loading')}</Heading>
        <Spinner
          color="brand.500"
          h={6}
          w={6}
          thickness="2px"
          speed="0.65s"
        />
      </Stack>
    )
  }

  if (
    ( environment.RESTRICT_TO_VERIFIED_ACCOUNT &&
    data?.account?.verification?.status === 'PENDING' ) ||
    requested
  ){
    return (
      <Layout>
        <BackButton onClick={back} />
        <Heading as="h1" variant="title" color="brand.black" mt={6} mb={12}>
          {t('asset.typeSelector.title')}
        </Heading>
        <Stack align="center" spacing={6} mb={40}>

          <Heading variant="heading1">{t('asset.restricted.requested.title')}</Heading>
          <Text pb={2} color="gray.500">{t('asset.restricted.requested.again')}</Text>
          <Alert
            status="info"
            rounded="xl"
            borderWidth="1px"
            borderColor="blue.300"
          >
            <AlertIcon />
            <Text variant="subtitle2">{t('asset.restricted.requested.reminder')}</Text>
          </Alert>
        </Stack>
      </Layout>
    )
  }

  if (
    environment.RESTRICT_TO_VERIFIED_ACCOUNT &&
    data?.account?.verification?.status !== 'VALIDATED'
  )
    return (
      <Layout>
        <BackButton onClick={back} />
        <Heading as="h1" variant="title" color="brand.black" mt={6} mb={12}>
          {t('asset.typeSelector.title')}
        </Heading>
        <Stack align="center" spacing={6} mb={40}>
          <Center bgColor="brand.50" w={12} h={12} rounded="full">
            <Icon as={BsFillPersonCheckFill} color="brand.500" w={6} h={6} />
          </Center>
          <Stack textAlign="center">
            <Heading variant="heading1">{t('asset.restricted.title')}</Heading>
            <Flex
              flexDirection={{base: 'column', md: 'row'}}
              gap={2}
              pb={6}
            >
              <Box
                as={Flex}
                flexDirection={{base: "column"}}
                alignItems='center'
                p={6}
                rounded="xl"
                border="1px"
                borderColor="gray.200"
                borderStyle="solid"
                shadow="sm"
                _hover={{ shadow: 'md' }}
              >
                <NumberedCircle number='1'/>
                <Text py={6} fontSize='xs'>
                  {t('asset.restricted.description')}
                </Text>
                <button
                  data-tf-popup={t('creadores.formId')}
                  data-tf-iframe-props="title=Registration Form"
                  data-tf-medium="snippet"
                  data-tf-hide-headers
                  className="btn"
                  onClick={()=>{
                    event("InitCreatorsForm", {
                      category: "Contact",
                      label: "Se inicio el formulario de creadores"
                    })
                  }}
                >
                  {t('creadores.hero.button')}
                </button>
              </Box>
              <Box
                as={Flex}
                flexDirection={{base: "column"}}
                alignItems='center'
                p={6}
                rounded="xl"
                border="1px"
                borderColor="gray.200"
                borderStyle="solid"
                shadow="sm"
                _hover={{ shadow: 'md' }}
              >
                <NumberedCircle number='2'/>
                <Text py={6} fontSize='xs'>
                  {t('asset.restricted.request')}
                </Text>
                <Button
                  fontWeight='bold'
                  onClick={handleVerificationRequest}
                  disabled={loading}
                >
                  {t('asset.restricted.requestButton')}
                </Button>
              </Box>
            </Flex>
            <Alert
              status="info"
              rounded="xl"
              borderWidth="1px"
              borderColor="blue.200"
            >
              <AlertIcon />
              <Text variant="subtitle2" color="gray.500">{t('asset.restricted.info')}</Text>
            </Alert>
          </Stack>
        </Stack>
      </Layout>
    )

  return (
    <Layout>
      <BackButton onClick={back} />
      <Heading as="h1" variant="title" color="brand.black" mt={6}>
        {t('asset.typeSelector.title')}
      </Heading>
      <Text as="p" variant="text" color="gray.500" mt={3}>
        {t('asset.typeSelector.description')}
      </Text>
      <Flex
        mt={12}
        flexWrap="wrap"
        justify="center"
        align={{ base: 'center', md: 'inherit' }}
        gap={6}
      >
        {data?.collections?.nodes.map(({ address, chainId, standard }) => (
          <Link
            href={`/create/${chainId}/${address}`}
            key={`${chainId}/${address}`}
          >
            <Stack
              as="a"
              w={64}
              align="center"
              justify="center"
              spacing={8}
              rounded="xl"
              border="1px"
              borderColor="gray.200"
              borderStyle="solid"
              bg="white"
              p={12}
              shadow="sm"
              _hover={{ shadow: 'md' }}
              cursor="pointer"
            >
              <Flex
                align="center"
                justify="center"
                mx="auto"
                h={36}
                w={36}
                rounded="full"
                bgColor={standard === 'ERC721' ? 'blue.50' : 'green.50'}
                color={standard === 'ERC721' ? 'blue.500' : 'green.500'}
              >
                {standard === 'ERC721' ? (
                  <Icon as={IoImageOutline} h={10} w={10} />
                ) : (
                  <Icon as={IoImagesOutline} h={10} w={10} />
                )}
              </Flex>
              <Box textAlign="center">
                <Heading as="h3" variant="heading1" color="brand.black">
                  {standard === 'ERC721'
                    ? t('asset.typeSelector.single.title')
                    : t('asset.typeSelector.multiple.title')}
                </Heading>
                <Heading as="h5" variant="heading3" color="gray.500" mt={2}>
                  {standard === 'ERC721'
                    ? t('asset.typeSelector.single.type')
                    : t('asset.typeSelector.multiple.type')}
                </Heading>
              </Box>
            </Stack>
          </Link>
        ))}
        {called && !data?.collections && (
          <Empty
            title={t('asset.typeSelector.empty.title')}
            description={t('asset.typeSelector.empty.description')}
            icon={
              <Icon as={HiExclamationCircle} w={8} h={8} color="gray.400" />
            }
          />
        )}
      </Flex>
    </Layout>
  )
}

export default CreatePage

type NumberedCircleProps = {
  number: string
}
const NumberedCircle : FC<PropsWithChildren<NumberedCircleProps>> = ({
  number
}) => {
  return (
    <Flex w={20} h={20} border='2px solid' rounded='full' align='center' justify='center' p={4} color='gray.800'>
      <Heading variant='title' color='gray.800'>{number}</Heading>
    </Flex>
  )
}