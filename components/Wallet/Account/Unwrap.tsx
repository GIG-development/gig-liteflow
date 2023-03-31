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
    const { reload } = useRouter()
    const WETH_ADDRESS = environment.WETH_ADDRESS
    const signer = useSigner()
    const contract = new ethers.Contract(WETH_ADDRESS, WETH9.abi)
    const [WethBalance, {loading}] = useBalance(account, currencyId)
    const displayWethBalance = WethBalance ? WethBalance.toString() : '0'
    const [amountToUnwrap, setAmountToUnwrap] = useState('0')
  
    const unwrapEth = async (amount: string, signer: any) => {
        if(amount !== '0' && Number(amount) > 0 && signer){
          try{
            const allowance = await contract.connect(signer).allowance(account, WETH_ADDRESS)
            if(allowance<=0){
              await contract.connect(signer).approve(WETH_ADDRESS, ethers.utils.parseEther(amount))
            }
            setTimeout(async ()=>{
              const tx = await contract.connect(signer).withdraw(ethers.utils.parseEther(amount))
              if(tx){
                onClose()
                toast({
                  title: t('wallet.swap.transaction'),
                  description: tx.hash,
                  status: 'success'
                })
                setTimeout(reload,60000)
              }
            },2000)
          } catch(error) {
            toast({
              title: "Error!",
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
            disabled={Number(WethBalance)===0 || loading}
            fontSize={'sm'}
            w={'90px'}
            onClick={onOpen}>
            {t('wallet.swap.unwrapBtn')}
        </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={useBreakpointValue({base:'sm', md: 'md'})}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading>{t('wallet.swap.unwrap')}</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text variant='text-sm'>{t('wallet.wallet.available')} <strong>{ethers.utils.formatEther(displayWethBalance)} WETH</strong></Text>
            <InputGroup>
            <label>
              {t('wallet.swap.unwrapInputPlaceholder')}
                <NumberInput
                  placeholder={t('wallet.swap.unwrapInputPlaceholder')}
                  size='lg'
                  w="full"
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
            </label>
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