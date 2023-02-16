import {
  Flex
} from '@chakra-ui/react'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import numbro from 'numbro'
import { FC, HTMLAttributes, useMemo } from 'react'
import FiatPriceConversion from 'components/FiatPrice/FiatPrice'

const Price: FC<
  HTMLAttributes<any> & {
    amount: BigNumberish
    currency: {
      decimals: number
      symbol: string
    }
    averageFrom?: number
    priceConversion?: string | undefined
  }
> = ({ amount, currency, averageFrom, priceConversion, ...props }) => {

  const amountFormatted = useMemo(() => {
    if (!currency) return ''

    const averageIsBiggerThanValue =
      !!averageFrom &&
      BigNumber.from(amount).gte(
        BigNumber.from(averageFrom).mul(
          BigNumber.from(10).pow(currency.decimals),
        ),
      )

    return numbro(formatUnits(amount, currency.decimals)).format({
      thousandSeparated: true,
      trimMantissa: true,
      mantissa: !averageIsBiggerThanValue ? currency.decimals : 4,
      average: averageIsBiggerThanValue,
    })
  }, [amount, currency, averageFrom])
  if (!currency) return null

  if(priceConversion){
    return (
      <Flex flexDirection={{base: 'column', md: 'row'}} justify='center' align='center'>
        <span {...props}>
          {amountFormatted} {currency.symbol}
        </span>
        <FiatPriceConversion amount={priceConversion} />
      </Flex>
    )
  }
  
  return (
      <span {...props}>
        {amountFormatted} {currency.symbol}
      </span>
  )
}

export default Price
