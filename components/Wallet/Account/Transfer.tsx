import { 
    Button,
    Heading,
    Input,
    InputGroup,
    NumberInput,
    NumberInputField,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInputStepper,
    Modal,
    ModalOverlay,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    Text,
    useToast,
    useDisclosure,
    useBreakpointValue
  } from '@chakra-ui/react'
  import useTranslation from 'next-translate/useTranslation'
  import { VFC, useState } from 'react'
  import { useRouter } from 'next/router'
  import { ethers } from 'ethers'
  import { useBalance } from '@nft/hooks'
  import useSigner from 'hooks/useSigner'
  import WETH9 from './WETH9.json'
  import environment from 'environment'
  
  type IProps = {
    currencyId: string
    currencySymbol: string
    senderAccount: string
  }
  
  const TransferToken: VFC<IProps> = ({ senderAccount, currencyId, currencySymbol }) => {
    const { t } = useTranslation('components')
    const toast = useToast()
    const {isOpen, onOpen, onClose} = useDisclosure()
    const { reload } = useRouter()
    const WETH_ADDRESS = environment.CHAIN_ID === 1 ? '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' : '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
    const signer = useSigner()
    const [TokenBalance, {loading}] = useBalance(senderAccount, currencyId)
    const [amountToSend, setAmountToSend] = useState('0')
    const [accountToSend, setAccountToSend] = useState('')
  
    const sendToken = async (amount: string, account: string, currencyId: string) => {
      if(
          amount !== '0' &&
          ethers.utils.isAddress(accountToSend) &&
          currencyId !== '0'
        ){
        try{
          signer?.getGasPrice().then(async res => {
            if(currencyId==="1" || currencyId==="5"){
                if (Number(ethers.utils.parseEther(amount)) >= Number(TokenBalance) - Number(res)){
                  toast({
                    title: "Error",
                    description: t('wallet.transfer.amountError')+ethers.utils.formatEther(res)+' ETH',
                    status: "error"
                  })
                  throw Error(t('wallet.transfer.amountError')+ethers.utils.formatEther(res)+' ETH',)
                }
                const tx = await signer?.sendTransaction({
                    to: account,
                    value: ethers.utils.parseEther(amount),
                    gasPrice: res,
                    gasLimit: 100000
                })
                if(tx){
                    onClose()
                    toast({
                      title: t('wallet.transfer.transaction'),
                      description: tx.hash,
                      status: 'success'
                    })
                    setTimeout(reload, 30000)
                }
            }else{
                const contract = new ethers.Contract(
                    WETH_ADDRESS,
                    WETH9.abi,
                    signer
                )
                contract.transfer(accountToSend, ethers.utils.parseEther(amount)).then((transferResult: any) => {
                    onClose()
                    toast({
                        title: t('wallet.transfer.transaction'),
                        description: transferResult.hash,
                        status: 'success'
                    })
                    setTimeout(reload, 30000)
                })
            }
          })
        } catch(error) {
          toast({
            title: "Error",
            description: String(error),
            status: "error"
          })
          console.error(error)
        }
      }
    }

    return (
      <>
        <Button
            disabled={Number(TokenBalance)===0 || loading}
            fontSize={'sm'}
            w={'90px'}
            onClick={onOpen}>
            {t('wallet.transfer.button')}
        </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={useBreakpointValue({base:'sm', md: 'lg'})}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading>{t('wallet.transfer.transfer')}: {currencySymbol}</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text variant='text-sm'>{t('wallet.wallet.available')} <strong>{TokenBalance ? ethers.utils.formatEther(TokenBalance.toString()) : '0'} {currencySymbol}</strong></Text>
            <InputGroup>
                <label>
                    {t('wallet.transfer.transferAmountInputPlaceholder')}
                    <NumberInput
                    placeholder={t('wallet.transfer.transferAmountInputPlaceholder')}
                    size='lg'
                    w="full"
                    defaultValue={0}
                    value={amountToSend}
                    precision={18}
                    step={Math.pow(10, -18)}
                    clampValueOnBlur={false}
                    min={0}
                    max={Number(TokenBalance)}
                    onChange={(e) => setAmountToSend(e)}
                    >
                        <NumberInputField/>
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </label>
            </InputGroup>
            <InputGroup>
                <label>
                    {t('wallet.transfer.transferAccountInputPlaceholder')}
                    <Input
                      placeholder={t('wallet.transfer.transferAccountInputPlaceholder')}
                      value={accountToSend}
                      onChange={(e) => setAccountToSend(e.target.value)}
                      size='lg'
                      fontSize={useBreakpointValue({base:'xs', md: 'sm'})}
                    />
                </label>
            </InputGroup>
            <Button
                disabled={
                  ( 
                    amountToSend === '0' ||
                    Number(amountToSend) === 0 ||
                    accountToSend==='' ||
                    !ethers.utils.isAddress(accountToSend)
                  ) 
                  ? true 
                  : false
                }
                width="full"
                my={6}
                onClick={()=>sendToken(amountToSend, accountToSend, currencyId)}
            >
                <Text as="span" isTruncated>
                    {t('wallet.transfer.button')}
                </Text>
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      </>
    )
  }
  
  export default TransferToken