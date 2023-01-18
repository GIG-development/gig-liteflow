import { 
  Flex,
  Stack,
  Text
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import { VFC } from 'react'
import Image from '../../Image/Image'
import List, { ListItem } from '../../List/List'
import WalletBalance from './WalletBalance'
import WrapToken from './Wrap'
import UnwrapToken from './Unwrap'

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
                (x.symbol === 'ETH') 
                ? 
                <WrapToken account={account} currencyId={x.id}/>
                : 
                <></> 
              }
              {
                (x.symbol === 'WETH')
                ? 
                <UnwrapToken account={account} currencyId={x.id}/>
                : 
                <></> 
              }
            </Flex>
          }
        />
      ))}
    </Stack>
    </>
  )
}

export default WalletBalanceList