import { 
  Button,
  Flex,
  FormControl,
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
  Text,
  useToast,
  useDisclosure
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import { VFC, useState } from 'react'
import Image from '../../Image/Image'
import List, { ListItem } from '../../List/List'
import WalletBalance from './WalletBalance'
import { useForm } from 'react-hook-form'
import { ethers } from 'ethers'
//import { Signer } from '@ethersproject/abstract-signer'
import { useBalance } from '@nft/hooks'
import useSigner from 'hooks/useSigner'
//import WETH9 from './WETH9.json'
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
  const [balance] = useBalance(account, '1')
  const [amount, setAmount] = useState(0)

  //ETH Wrap-Unwrap
  const WETH_ADDRESS = environment.CHAIN_ID === 1 ? '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' : '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
  //const contract = new ethers.Contract(WETH_ADDRESS, WETH9.abi)
  const signer = useSigner()

  const wrapEth = async (amount: string) => {
    console.log("trying to wrap: ", WETH_ADDRESS)
    try{
      await signer?.sendTransaction({
        to: WETH_ADDRESS,
        value: amount
      })
      toast({
        title: "Success!",
        status: 'success'
      })
      console.log("success")
      onClose()
    } catch(error) {
      toast({
        title: "Error",
        status: "error"
      })
      console.log(error)
    }
  }
  /*
  const unwrapEth = async (amount: string, signer: Signer) => {
    try{
      await contract.connect(signer).approve(WETH_ADDRESS, ethers.utils.parseEther('1000'))
      await contract.connect(signer).withdraw(ethers.utils.parseEther(amount))
      toast({
        title: "Success!",
        status: 'success'
      })
    } catch(error) {
      toast({
        title: "Error!",
        status: "error"
      })
    }
  }
  */

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
              { (x.symbol === 'ETH') ? 
                <Button
                  fontSize={'sm'}
                  w={'120px'}
                  onClick={onOpen}>
                    Wrap ETH
                </Button> : <></> 
              }
              {/* (x.symbol === 'WETH') ? 
                <Button
                  fontSize={'sm'}
                  w={'120px'}
                  onClick={onOpen}>
                    Unwrap wETH
                </Button> : <></> */}
            </Flex>
          }
        />
      ))}
    </Stack>
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading>Wrap ETH</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
                <InputGroup>
                  <NumberInput
                    clampValueOnBlur={false}
                    min={Math.pow(10, -18)}
                    allowMouseWheel
                    w="full"
                  >
                    <NumberInputField
                      id="amount"
                      placeholder={'Amount to Wrap'}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </InputGroup>
                <Button
                  //disabled={ (Number(amount) > Number(balance) || Number(amount) === 0) ? true : false}
                  width="full"
                  my={6}
                  onClick={()=>wrapEth(amount)}
                >
                  <Text as="span" isTruncated>
                    Wrap
                  </Text>
                </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
    </>
  )
}

export default WalletBalanceList