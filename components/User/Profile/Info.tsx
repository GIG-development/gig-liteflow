import {
  Button,
  Flex,
  Icon,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useIsLoggedIn } from '@nft/hooks'
import { BsArrowRight } from '@react-icons/all-files/bs/BsArrowRight'
import useTranslation from 'next-translate/useTranslation'
import { VFC } from 'react'
import Link from '../../Link/Link'

const UserProfileInfo: VFC<{
  address: string
  name: string | null | undefined
  description: string | null | undefined
}> = ({
  address,
  description,
  name,
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
        <VStack alignItems={'flex-end'}> 
          {description && (
            <Stack w={'full'} spacing={3}>
              <Text as="p" textAlign={'justify'} variant="text-sm" color="gray.500">
                {description}
              </Text>
            </Stack>
          )}
        </VStack>
        {name && (
          <Flex
            flexDirection={{base: 'column', row: 'row'}}
            alignItems='center'
          >
            {ownerLoggedIn && (
              <Button
                as={Link}
                href={`/account/edit`}
                mt={6}
              >
                <Text as="span" isTruncated>
                  {t('user.info.edit')}
                </Text>
              </Button>
            )}
            {ownerLoggedIn && (
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
            )}
          </Flex>
        )}
      </Flex>
  )
}

export default UserProfileInfo
