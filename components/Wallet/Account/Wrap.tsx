import { 
    Button,
    Heading,
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
  import environment from 'environment'
  
  type IProps = {
    currencyId: string
    account: string
  }
  
  const WrapToken: VFC<IProps> = ({ account, currencyId }) => {
    const { t } = useTranslation('components')
    const toast = useToast()
    const {isOpen, onOpen, onClose} = useDisclosure()
    const { reload } = useRouter()
    const WETH_ADDRESS = environment.WETH_ADDRESS
    const signer = useSigner()
    const [EthBalance, {loading}] = useBalance(account, currencyId)
    const displayEthBalance = EthBalance ? EthBalance.toString() : '0'
    const [amountToWrap, setAmountToWrap] = useState('0')
  
    const wrapEth = async (amount: string) => {
      if(amount !== '0' && Number(amount) > 0){
        try{
          const tx = await signer?.sendTransaction({
            to: WETH_ADDRESS,
            value: ethers.utils.parseEther(amount)
          })
          if(tx){
            onClose()
            toast({
              title: t('wallet.swap.transaction'),
              description: tx.hash,
              status: 'success'
            })
            setTimeout(reload, 60000)
          }
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
            disabled={Number(EthBalance)===0 || loading}
            fontSize={'sm'}
            onClick={onOpen}>
            {t('wallet.swap.wrapBtn')}
        </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={useBreakpointValue({base:'sm', md: 'md'})}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading>{t('wallet.swap.wrap')}</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text variant='text-sm'>{t('wallet.wallet.available')} <strong>{ethers.utils.formatEther(displayEthBalance)} ETH</strong></Text>
            <InputGroup>
              <label>
                {t('wallet.swap.wrapInputPlaceholder')}
                <NumberInput
                    placeholder={t('wallet.swap.wrapInputPlaceholder')}
                    size='lg'
                    w="full"
                    defaultValue={0}
                    value={amountToWrap}
                    precision={18}
                    step={Math.pow(10, -18)}
                    min={0}
                    max={Number(EthBalance)}
                    onChange={(e) => setAmountToWrap(e)}
                  >
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
              </label>
            </InputGroup>
            <Button
                disabled={ (amountToWrap === '0' || Number(amountToWrap) === 0) ? true : false}
                width="full"
                my={6}
                onClick={()=>wrapEth(amountToWrap)}
            >
                <Text as="span" isTruncated>
                    {t('wallet.swap.wrapBtn')}
                </Text>
            </Button>

          </ModalBody>
        </ModalContent>
      </Modal>
      </>
    )
  }
  
  export default WrapToken