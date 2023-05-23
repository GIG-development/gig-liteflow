import {
  Button,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react'
import { useIsLoggedIn } from '@nft/hooks'
import { BsArrowRight } from '@react-icons/all-files/bs/BsArrowRight'
import useTranslation from 'next-translate/useTranslation'
import { VFC } from 'react'
import Link from '../../Link/Link'

const UserProfileInfo: VFC<{
  address: string
}> = ({
  address
}) => {
  const { t } = useTranslation('components')

  if (!address) throw new Error('account is falsy')

  const ownerLoggedIn = useIsLoggedIn(address)

  return (
      <Flex
        flexDirection={'column'}
        gap={3}
        w={'full'}
        px={12}
        mb={6}
        alignItems='center'
      >
        {ownerLoggedIn && (
          <Flex
            flexDirection={{base: 'column', row: 'row'}}
            alignItems='center'
            gap={2}
          >
              <Button
                as={Link}
                href={`/account/edit`}
                mt={6}
              >
                <Text as="span" isTruncated>
                  {t('user.info.edit')}
                </Text>
              </Button>
              <Button
                variant={'outline'}
                as={Link}
                href={`/referral`}
                mt={6}
              >
                <Text as="span" fontSize={'sm'} isTruncated>
                  {t('user.referral.title')} <Icon as={BsArrowRight} ml={2} />
                </Text>
              </Button>
          </Flex>
        )}
      </Flex>
  )
}

export default UserProfileInfo
