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
import { VFC } from 'react'
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

type FormData = {
  amount: string
}

const WalletBalanceList: VFC<IProps> = ({ account, currencies }) => {
  const { t } = useTranslation('components')
  const toast = useToast()
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [balance] = useBalance(account, '1')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<FormData>({
    defaultValues: {
      amount: "0",
    },
  })

  const onSubmit = handleSubmit(async ({ amount }) => {
    if(!errors) void wrapEth(amount)
  })

  //ETH Wrap-Unwrap
  const WETH_ADDRESS = environment.CHAIN_ID === 1 ? '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' : '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
  //const contract = new ethers.Contract(WETH_ADDRESS, WETH9.abi)
  const signer = useSigner()

  const wrapEth = async (amount: string) => {
    try{
      await signer?.sendTransaction({
        to: WETH_ADDRESS,
        value: ethers.utils.parseEther(amount)
      })
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
          <form onSubmit={onSubmit}>
            <FormControl isInvalid={!!errors.amount}>
                <InputGroup>
                  <NumberInput
                    clampValueOnBlur={false}
                    min={1}
                    max={Number(balance)}
                    value={0}
                    allowMouseWheel
                    w="full"
                    onChange={(x) => setValue('amount', x)}
                  >
                    <NumberInputField
                      id="amount"
                      placeholder={'Amount to Wrap'}
                      {...register('amount', {
                        required: t('offer.form.checkout.validation.required'),
                        validate: (value) => {
                          if (
                            parseInt(value, 10) < 0 ||
                            parseInt(value, 10) > 1000
                          ) {
                            return t('offer.form.checkout.validation.in-range', {
                              max: 1000,
                            })
                          }
                          if (!/^\d+$/.test(value)) {
                            return t('offer.form.checkout.validation.integer')
                          }
                        },
                      })}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </InputGroup>
                <Button
                  disabled={!!account}
                  isLoading={isSubmitting}
                  width="full"
                  type="submit"
                  my={6}
                >
                  <Text as="span" isTruncated>
                    Wrap
                  </Text>
                </Button>
            </FormControl>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
    </>
  )
}

export default WalletBalanceList
