import { Box, chakra, Flex, Stack } from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import { ReactElement } from 'react'
import Empty from '../Empty/Empty'
import type { IProp as PaginationProps } from '../Pagination/Pagination'
import Pagination from '../Pagination/Pagination'
import Select from '../Select/Select'
import type { Props as NFTListRowProps } from './ListRow'
import NFTListRow from './ListRow'

type IProps<Order extends string> = {
  assets: (NFTListRowProps['asset'] & {
    auction: NFTListRowProps['auction']
    creator: NFTListRowProps['creator']
    sale: NFTListRowProps['sale']
    numberOfSales: number
    hasMultiCurrency: boolean
  })[]
  orderBy: {
    value: Order
    choices: {
      value: Order
      label: string
    }[]
    onSort: (orderBy: any) => Promise<void>
  }
  pagination: PaginationProps
}

const TokenList = <Order extends string>({
  assets,
  orderBy,
  pagination,
}: IProps<Order>): ReactElement => {
  const { t } = useTranslation('components')
  if (assets.length === 0)
    return (
      <Empty
        title={t('token.grid.empty.title')}
        description={t('token.grid.empty.description')}
        button={t('token.grid.empty.action')}
        href="/explore"
      />
    )

  const ChakraPagination = chakra(Pagination)

  return (
    <Stack spacing={6}>
      <Box ml="auto" w={{ base: 'full', md: 'min-content' }}>
        <Select
          label={t('token.grid.sort.label')}
          name="orderBy"
          onChange={orderBy.onSort}
          choices={orderBy.choices}
          value={orderBy.value}
          inlineLabel
        />
      </Box>
      <Box
        py={6}
      >
        {assets.map(
          (
            {
              auction,
              creator,
              sale,
              numberOfSales,
              hasMultiCurrency,
              ...asset
            },
            i,
          ) => (
            <Flex key={i} justify="center">
              <NFTListRow
                asset={asset}
                auction={auction}
                creator={creator}
                sale={sale}
                numberOfSales={numberOfSales}
                hasMultiCurrency={hasMultiCurrency}
              />
            </Flex>
          ),
        )}
      </Box>
      <ChakraPagination
        py="6"
        borderTop="1px"
        borderColor="gray.200"
        {...pagination}
      />
    </Stack>
  )
}

export default TokenList