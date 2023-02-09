import { Text } from '@chakra-ui/react'
import { FC, PropsWithChildren } from 'react'
import useTranslation from 'next-translate/useTranslation'

type Props = {
    amount: string
}
  
const FiatPriceConversion: FC<PropsWithChildren<Props>> = ({amount}) => {
    const { t } = useTranslation('components')
    return (
            <Text variant='text-sm' fontSize={'10px'} color={'gray.800'} pl={2}> 
            ({t('fiatConversion.convert')+' $'+Number(amount).toFixed(2)+' USD'})
            </Text>
    )
} 
export default FiatPriceConversion