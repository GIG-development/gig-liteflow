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
    useDisclosure
  } from '@chakra-ui/react'
  import useTranslation from 'next-translate/useTranslation'
  import { VFC, useState } from 'react'
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
  
    //ETH Wrap-Unwrap
    const WETH_ADDRESS = environment.CHAIN_ID === 1 ? '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' : '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
    const signer = useSigner()
    const [EthBalance, {loading}] = useBalance(account, currencyId)
    let displayEthBalance = EthBalance ? EthBalance.toString() : '0'
    const [amountToWrap, setAmountToWrap] = useState('0')
  
    const wrapEth = async (amount: string) => {
      if(amount !== '0' && Number(amount) > 0){
        try{
          const tx = await signer?.sendTransaction({
            to: WETH_ADDRESS,
            value: ethers.utils.parseEther(amount)
          })
          toast({
            title: t('wallet.swap.transaction'),
            description: "ID: "+tx?.hash,
            status: 'success'
          })
          onClose()
        } catch(error) {
          toast({
            title: "Error",
            description: "",
            status: "error"
          })
        }
      }
    }

    return (
      <>
        <Button
            disabled={Number(EthBalance)===0 || loading}
            fontSize={'sm'}
            w={'90px'}
            onClick={onOpen}>
            {t('wallet.swap.wrapBtn')}
        </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading>{t('wallet.swap.wrap')}</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text variant='text-sm'>Balance: <strong>{ethers.utils.formatEther(displayEthBalance)}</strong></Text>
            <InputGroup>
                <NumberInput
                placeholder={t('wallet.swap.wrapInputPlaceholder')}
                size='lg'
                w="full"
                clampValueOnBlur={true}
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