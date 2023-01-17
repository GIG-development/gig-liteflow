import { 
  Button,
  Flex,
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
  Stack,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  useToast,
  useDisclosure
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import { VFC, useState } from 'react'
import Image from '../../Image/Image'
import List, { ListItem } from '../../List/List'
import WalletBalance from './WalletBalance'
import { ethers } from 'ethers'
import { useBalance } from '@nft/hooks'
import useSigner from 'hooks/useSigner'
import WETH9 from './WETH9.json'
import environment from 'environment'

type IProps = {
  currencies: {
    name: string
    id: string
    image: string
    decimals: number
    symbol: string
  }[]
  account: string
}

const WalletBalanceList: VFC<IProps> = ({ account, currencies }) => {
  const { t } = useTranslation('components')
  const toast = useToast()
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [openTab, setOpenTab] = useState(0)

  //ETH Wrap-Unwrap
  const WETH_ADDRESS = environment.CHAIN_ID === 1 ? '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' : '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
  const contract = new ethers.Contract(WETH_ADDRESS, WETH9.abi)
  const signer = useSigner()

  const [EthBalance] = useBalance(account, "1")
  console.log("ETH: ",EthBalance)
  const [WethBalance] = useBalance(account, `1-${WETH_ADDRESS.toLowerCase()}`)
  console.log("WETH: ",WethBalance)
  const [amountToWrap, setAmountToWrap] = useState('0')
  const [amountToUnwrap, setAmountToUnwrap] = useState('0')

  const wrapEth = async (amount: string) => {
    if(amount !== '0' && Number(amount) > 0){
      try{
        await signer?.sendTransaction({
          to: WETH_ADDRESS,
          value: ethers.utils.parseEther(amount)
        })
        toast({
          title: "Transaction sent",
          status: 'success'
        })
        onClose()
      } catch(error) {
        toast({
          title: "Error",
          status: "error"
        })
      }
    }
  }
  
  const unwrapEth = async (amount: string, signer: any) => {
    if(amount !== '0' && Number(amount) > 0 && signer){
      try{
        await contract.connect(signer).approve(WETH_ADDRESS, ethers.utils.parseEther('1000'))
        await contract.connect(signer).withdraw(ethers.utils.parseEther(amount))
        toast({
          title: "Transaction sent",
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

  if (currencies.length === 0)
    return (
      <Text as="p" variant="text" color="gray.500">
        {t('wallet.balances.none')}
      </Text>
    )
  return (
    <>
    <Stack as={List} spacing={3}>
      {currencies.map((x, i, currenciesArr) => (
        <Flex
          as={ListItem}
          key={x.id}
          withSeparator={i < currenciesArr.length - 1}
          image={<Image src={x.image} width={40} height={40} alt={x.symbol} />}
          label={x.name}
          action={
            <Flex as="span" alignItems={'center'} gap={6} color="brand.black" fontWeight="medium">
              <WalletBalance account={account} currency={x} />
              {
                (x.symbol === 'ETH') ? 
                  <Button
                    disabled={Number(EthBalance)===0}
                    fontSize={'sm'}
                    w={'120px'}
                    onClick={()=> {
                      onOpen()
                      setOpenTab(0)
                    }}>
                      Wrap ETH
                  </Button> : <></> 
              }
              {
                (x.symbol === 'WETH') ? 
                  <Button
                  disabled={Number(WethBalance)===0}
                    fontSize={'sm'}
                    w={'120px'}
                    onClick={()=> {
                      onOpen()
                      setOpenTab(1)
                    }}>
                      Unwrap wETH
                  </Button> : <></> 
              }
            </Flex>
          }
        />
      ))}
    </Stack>
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading>Swap ETH</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <Tabs defaultIndex={openTab}>
              <TabList>
                <Tab>Wrap</Tab>
                <Tab>Unwrap</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Text variant='text-sm'>
                    Balance: {EthBalance?.toString()} ETH
                  </Text>
                  <InputGroup>
                    <NumberInput
                      placeholder={'Amount to Wrap'}
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
                      Wrap
                    </Text>
                  </Button>
                </TabPanel>
                <TabPanel>
                  <Text variant='text-sm'>
                    Balance: {WethBalance?.toString()} WETH
                  </Text>
                  <InputGroup>
                    <NumberInput
                      placeholder={'Amount to Unwrap'}
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
                    disabled={ (amountToUnwrap === '0' || Number(amountToUnwrap) === 0 || !signer) ? true : false}
                    width="full"
                    my={6}
                    onClick={()=>unwrapEth(amountToUnwrap, signer)}
                  >
                    <Text as="span" isTruncated>
                      Unwrap
                    </Text>
                  </Button>
                </TabPanel>
              </TabPanels>
            </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
    </>
  )
}

export default WalletBalanceList