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
  import WETH9 from './WETH9.json'
  import environment from 'environment'
  
  type IProps = {
    currencyId: string
    account: string
  }
  
  const UnwrapToken: VFC<IProps> = ({ account, currencyId }) => {
    const { t } = useTranslation('components')
    const toast = useToast()
    const {isOpen, onOpen, onClose} = useDisclosure()
  
    //ETH Wrap-Unwrap
    const WETH_ADDRESS = environment.CHAIN_ID === 1 ? '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' : '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
    const signer = useSigner()
    const contract = new ethers.Contract(WETH_ADDRESS, WETH9.abi)
    const [WethBalance, {loading}] = useBalance(account, currencyId)
    const displayWethBalance = WethBalance ? WethBalance.toString() : '0'
    const [amountToUnwrap, setAmountToUnwrap] = useState('0')
  
    const unwrapEth = async (amount: string, signer: any) => {
        if(amount !== '0' && Number(amount) > 0 && signer){
          try{
            await contract.connect(signer).approve(WETH_ADDRESS, ethers.utils.parseEther('1000'))
            const tx = await contract.connect(signer).withdraw(ethers.utils.parseEther(amount))
            toast({
              title: t('wallet.swap.transaction'),
              description: "ID: "+tx?.hash,
              status: 'success'
            })
            onClose()
          } catch(error) {
            toast({
              title: "Error!",
              status: "error"
            })
          }
        }
      }

    return (
      <>
        <Button
            disabled={Number(WethBalance)===0 || loading}
            fontSize={'sm'}
            w={'90px'}
            onClick={onOpen}>
            {t('wallet.swap.unwrapBtn')}
        </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading>{t('wallet.swap.unwrap')}</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text variant='text-sm'>Balance: <strong>{ethers.utils.formatEther(displayWethBalance)} WETH</strong></Text>
            <InputGroup>
                <NumberInput
                placeholder={t('wallet.swap.unwrapInputPlaceholder')}
                size='lg'
                w="full"
                clampValueOnBlur={true}
                defaultValue={0}
                value={amountToUnwrap}
                precision={18}
                step={Math.pow(10, -18)}
                min={0}
                max={Number(WethBalance)}
                onChange={(e) => setAmountToUnwrap(e)}
                >
                <NumberInputField/>
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
                </NumberInput>
            </InputGroup>
            <Button
                disabled={ (amountToUnwrap === '0' || Number(amountToUnwrap) === 0) ? true : false}
                width="full"
                my={6}
                onClick={()=>unwrapEth(amountToUnwrap, signer)}
            >
                <Text as="span" isTruncated>
                    {t('wallet.swap.unwrapBtn')}
                </Text>
            </Button>

          </ModalBody>
        </ModalContent>
      </Modal>
      </>
    )
  }
  
  export default UnwrapToken