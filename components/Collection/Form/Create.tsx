import {
    Button,
    Checkbox,
    CheckboxGroup,
    Flex,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Heading,
    HStack,
    Input,
    Modal,
    ModalContent,
    ModalBody,
    ModalOverlay,
    ModalCloseButton,
    Spinner,
    Stack,
    Text,
    useDisclosure,
    useRadioGroup,
    useToast,
  } from '@chakra-ui/react'
  import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer'
  import { EmailConnector } from '@nft/email-connector'
  import { formatError } from '@nft/hooks'
  import { InjectedConnector } from '@web3-react/injected-connector'
  import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
  import { WalletLinkConnector } from '@web3-react/walletlink-connector'
  import useTranslation from 'next-translate/useTranslation'
  import Trans from 'next-translate/Trans'
  import { FC, useState } from 'react'
  import { useForm, useWatch } from 'react-hook-form'
  import { BlockExplorer } from '../../../hooks/useBlockExplorer'
  import LoginModal from '../../Modal/Login'
  import Link from 'components/Link/Link'
  import Tooltip from 'components/Tooltip/Tooltip'
  import Radio from 'components/Radio/Radio'
  import useCreateCollection from 'hooks/useCreateCollection'
  import useBlockExplorer from '../../../hooks/useBlockExplorer'
  import environment from 'environment'
  import { 
    Standard,
    MintType
  } from '../../../graphql'
  import {gql, request} from 'graphql-request'
  import Lottie from 'react-lottie-player'
  import successAnimation from 'public/img/animaciones/papache_creation_success.json'

  const CHECK_COLLECTION = gql`
  query CheckCollection($chainId: Int!, $address: Address!) {
    collection(chainId: $chainId, address: $address) {
      createdAt
    }
  }
  `
  
  export type FormData = {
    name: string
    symbol: string
    standard: Standard
    mintType: MintType
    userTermsAgreement: boolean
  }
  
  type Props = {
    signer: (Signer & TypedDataSigner) | undefined
    blockExplorer: BlockExplorer
    login: {
      email?: EmailConnector
      injected?: InjectedConnector
      coinbase?: WalletLinkConnector
      walletConnect?: WalletConnectConnector
      networkName: string
    }
    onCreated: (id: string) => void
  }

  export type CheckCollectionFunction = (
    chainId: number,
    address: string,
  ) => Promise<boolean>
  
  const CollectionFormCreate: FC<Props> = ({
    signer,
    login,
    onCreated
  }) => {
    const { t } = useTranslation('components')
    const toast = useToast()
    const { onOpen, onClose, isOpen } = useDisclosure()
    const {
      isOpen: loginIsOpen,
      onOpen: loginOnOpen,
      onClose: loginOnClose,
    } = useDisclosure()
    const {
      control,
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      setValue
    } = useForm<FormData>({
      defaultValues: {
        name: '',
        symbol: '',
        standard: undefined,
        mintType: undefined,
        userTermsAgreement: false
      },
    })
    const res = useWatch({ control })
    const createCollection = useCreateCollection()

    const blockExplorer = useBlockExplorer(
      environment.BLOCKCHAIN_EXPLORER_NAME,
      environment.BLOCKCHAIN_EXPLORER_URL,
    )

    const checkCollection = async (chainId: number, address: string) => {
        const {collection} = await request(environment.GRAPHQL_URL, CHECK_COLLECTION, {chainId: chainId, address: address})
        return collection ? true : false
    }

    // poll the api until the collection is returned
    const pollCollection = async ({
        chainId,
        address,
        max,
        interval,
      }: {
        chainId: number
        address: string
        max?: number
        interval?: number
      }) => {
        if (!max) max = 120
        if (!interval) interval = 5000
        let i = 0
        while (i < max) {
          const ready = await checkCollection(chainId, address)
          if (ready) return true
          await new Promise((resolve) => setTimeout(resolve, interval))
          i++
        }
        console.log('poll timed out')
        return false
    }

    const [isCreating,setIsCreating] = useState(false)
    const [collectionAddress,setCollectionAddress] = useState('')
    const [transactionHash,setTransactionHash] = useState('')
    const [confirmedTransaction,setConfirmedTransaction] = useState(false)

    const onSubmit = handleSubmit(async (data) => {
  
      if(!data.userTermsAgreement) return
  
      try {
        setIsCreating(true)
        const { createCollectionTransaction } = await createCollection(environment.CHAIN_ID,data.name,data.symbol,data.standard,data.mintType)
        const { collectionAddress, transaction } = createCollectionTransaction
        const gas = await signer?.getGasPrice()
        if(gas){
            const signedTransaction = await signer?.sendTransaction({
                to: transaction.to,
                from: signer.getAddress(),
                data: transaction.data,
                gasPrice: gas
            })
            if(signedTransaction?.hash){
              toast({
                title: t('collection.form.create.transactionHash')+': '+signedTransaction?.hash,
                status: 'success',
              })
              onOpen()
              setCollectionAddress(collectionAddress)
              setTransactionHash(signedTransaction?.hash)
              const isConfirmed = await pollCollection({chainId: environment.CHAIN_ID, address: collectionAddress.toLowerCase()})
              if(isConfirmed){
                setConfirmedTransaction(isConfirmed)
                onCreated(collectionAddress)
              }
            }
        }
      } catch (e) {
        setIsCreating(false)
        toast({
          title: formatError(e),
          status: 'error',
        })
      }
    })

    const { getRadioProps: getRadioPropsStandard, getRootProps: getRootPropsStandard } = useRadioGroup({
        onChange: (e: any) => setValue("standard",e),
    })

    const { getRadioProps: getRadioPropsMintType, getRootProps: getRootPropsMintType } = useRadioGroup({
        onChange: (e: any) => setValue("mintType",e),
    })
  
    if(isCreating){
      return (
        <>
        <Stack
          align="center"
          spacing={12}
          flex="1 1 0%"
        >
          <Spinner size='xl'/>
          <Text>
            {t('collection.form.create.loadingText')}
          </Text>
        </Stack>
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody p={8}>

              <Flex gap={8} p={4} flexDir='column' align='center' justify='center'>
                <Heading>{confirmedTransaction ? t('collection.form.create.created') : t('collection.form.create.creating')}</Heading>
                {confirmedTransaction 
                ?
                  <Lottie 
                    loop={true}
                    animationData={successAnimation}
                    play
                    style={{ width: 220, height: 220, backgroundColor: '#ECE6F9', borderRadius: '50%' }}
                  />
                :
                <>
                  <Spinner size='xl'/>
                  <Text variant='text-sm' textAlign='center'>{t('collection.form.create.loadingModalText1')}</Text>
                  <Text variant='text-sm' textAlign='center'>{t('collection.form.create.loadingModalText2')}</Text>
                </>
                }
              </Flex>

              <Flex gap={2} align='center' justify='center' mt={8}>
                <Button as={Link} href={`/collection/${environment.CHAIN_ID}/${collectionAddress.toLowerCase()}`} disabled={!confirmedTransaction}>{t('collection.form.create.goToCollectionButton')}</Button>
                <Button as={Link} href={blockExplorer.transaction(transactionHash) || '#'} variant='outline' isExternal>{t('collection.form.create.checkTransactionButton')}</Button>
              </Flex>

            </ModalBody>
          </ModalContent>
        </Modal>
        </>
      )
    }

    if(isCreating && confirmedTransaction){
      return (
        <Stack
          align="center"
          spacing={12}
          flex="1 1 0%"
        >
          <Text>
            {t('collection.form.create.readyText')}
          </Text>
          <Button as={Link} href={`/collection/${environment.CHAIN_ID}/${collectionAddress.toLowerCase()}`} disabled={!confirmedTransaction}>{t('collection.form.create.goToCollectionButton')}</Button>
        </Stack>
      )
    }

    return (
      <Stack
        align="flex-start"
        spacing={12}
        as="form"
        onSubmit={onSubmit}
        flex="1 1 0%"
      >
        <FormControl isInvalid={!!errors.name}>
            <HStack spacing={1} mb={2}>
                <FormLabel htmlFor="name">
                    <Flex align='center'>
                        {t('collection.form.create.name.label')}
                        <Tooltip text={t('collection.form.create.name.tooltip')}/>
                    </Flex>
                </FormLabel>
                <FormHelperText fontSize='xs'>
                    {t('token.form.create.terms.required')}
                </FormHelperText>
            </HStack>
            <Input
            id="name"
            placeholder={t('collection.form.create.name.placeholder')}
            {...register('name', {
                required: t('collection.form.create.validation.required'),
            })}
            />
            {errors.name && (
            <FormErrorMessage>{errors.name.message}</FormErrorMessage>
            )}
        </FormControl>

        <FormControl isInvalid={!!errors.symbol}>
            <HStack spacing={1} mb={2}>
                <FormLabel htmlFor="symbol">
                    <Flex align='center'>
                        {t('collection.form.create.symbol.label')}
                    <Tooltip text={t('collection.form.create.symbol.tooltip')}/>
                    </Flex>
                </FormLabel>
                <FormHelperText fontSize='xs'>
                    {t('token.form.create.terms.required')}
                </FormHelperText>
            </HStack>
          <Input
            id="symbol"
            placeholder={t('collection.form.create.symbol.placeholder')}
            {...register('symbol', {
              required: t('collection.form.create.validation.required'),
            })}
          />
          {errors.symbol && (
            <FormErrorMessage>{errors.symbol.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.standard}>
            <HStack spacing={1} mb={2}>
                <FormLabel htmlFor="standard">
                    <Flex align='center'>
                        {t('collection.form.create.standard.label')}
                        <Tooltip text={t('collection.form.create.standard.tooltip')}/>
                    </Flex>
                </FormLabel>
                <FormHelperText fontSize='xs'>
                    {t('token.form.create.terms.required')}
                </FormHelperText>
            </HStack>
            <Flex mt={3} flexWrap="wrap" gap={4} id='standard' {...getRootPropsStandard()}>
                {
                    [
                        {value: 'ERC721', label: 'ERC-721'},
                        {value: 'ERC1155', label: 'ERC-1155'}
                    ].map((choice, i) => {
                        const radio = getRadioPropsStandard({ value: choice.value })
                        return <Radio key={i} choice={choice} {...radio}/>
                    })
                }
            </Flex>
        </FormControl>

        <FormControl isInvalid={!!errors.mintType}>
            <HStack spacing={1} mb={2}>
                <FormLabel htmlFor="mintType">
                    <Flex align='center'>
                        {t('collection.form.create.mintType.label')}
                        <Tooltip text={t('collection.form.create.mintType.tooltip')}/>
                    </Flex>
                </FormLabel>
                <FormHelperText fontSize='xs'>
                    {t('token.form.create.terms.required')}
                </FormHelperText>
            </HStack>
            <Flex mt={3} flexWrap="wrap" gap={4} id='mintType' {...getRootPropsMintType()}>
                {
                    [
                        {value: 'PUBLIC', label: t('collection.form.create.mintType.public')},
                        {value: 'ONLY_OWNER', label: t('collection.form.create.mintType.private')}
                    ].map((choice, i) => {
                        const radio = getRadioPropsMintType({ value: choice.value })
                        return <Radio key={i} choice={choice} {...radio}/>
                    })
                }
            </Flex>
        </FormControl>
  
        <FormControl backgroundColor={'gray.100'} p={3} rounded={6}>
          <HStack spacing={1} mb={2}>
            <FormLabel htmlFor="terms" m={0}>{t('token.form.create.terms.title')}</FormLabel>
            <FormHelperText fontSize='xs'>
              {t('token.form.create.terms.required')}
            </FormHelperText>
          </HStack>
          <CheckboxGroup colorScheme='brand'>
            <Stack spacing={[1, 5]} direction={['column', 'column']}>
              <Checkbox value='terms' onChange={() => setValue('userTermsAgreement', !res.userTermsAgreement)} required>
                <Text fontSize='xs'>
                  <Trans
                    ns="components"
                    i18nKey={'token.form.create.terms.terms'}
                    components={[
                      <Link href='https://gig.io/legales' key='terms' isExternal textDecor='underline' ></Link>
                    ]}
                  />
                </Text>
              </Checkbox>
            </Stack>
          </CheckboxGroup>
        </FormControl>
  
        {signer ? (
          <Button type="submit" isLoading={isSubmitting}>
            <Text as="span" isTruncated>
                {t('collection.form.create.button')}
            </Text>
          </Button>
        ) : (
          <Button type="button" onClick={loginOnOpen}>
            <Text as="span" isTruncated>
                {t('collection.form.create.button')}
            </Text>
          </Button>
        )}
        <LoginModal isOpen={loginIsOpen} onClose={loginOnClose} {...login} />
      </Stack>
    )
  }
  
  export default CollectionFormCreate