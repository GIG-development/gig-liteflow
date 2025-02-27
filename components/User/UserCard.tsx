import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { formatAddress } from '@nft/hooks'
import { HiBadgeCheck } from '@react-icons/all-files/hi/HiBadgeCheck'
import Image from 'components/Image/Image'
import Link from 'components/Link/Link'
import { FC } from 'react'
import AccountImage from '../Wallet/Image'

type Props = {
  user: {
    address: string
    image: string | null
    cover: string | null
    name: string | null
    verified: boolean
  }
}

const UserCard: FC<Props> = ({ user }) => {
  return (
    <Link href={`/users/${user.address}`} w="full">
      <Box
        borderRadius="2xl"
        border="1px solid"
        borderColor="gray.300"
        w="full"
        overflow="hidden"
        _hover={{
          shadow: '1px 0px 8px 6px #f2f2f2'
        }}
      >
        <Box position="relative" height="7.5rem">
          {user.cover ? (
            <Image
              src={user.cover}
              alt={user.name || 'User cover image'}
              layout="fill"
              objectFit="cover"
              sizes="
              (min-width: 80em) 292px,
              (min-width: 62em) 25vw,
              (min-width: 48em) 33vw,
              (min-width: 30em) 50vw,
              100vw"
            />
          ) : (
            <Box bg="gray.100" height="full" />
          )}
          <Box
            position="absolute"
            bottom={0}
            transform="translate(1rem, 50%)"
            border="2px solid"
            borderColor="white"
            rounded="full"
            w={16}
            h={16}
          >
            <Box
              as={AccountImage}
              address={user.address}
              image={user.image}
              size={60}
              objectFit="cover"
              rounded="full"
            />
          </Box>
        </Box>
        <Flex
          alignItems="center"
          gap={1.5}
          overflow="hidden"
          mt={1}
          pt={10}
          px={4}
          pb={4}
        >
          <Text variant="button1" title={user.name || user.address} isTruncated>
            {user.name || formatAddress(user.address, 10)}
          </Text>
          {user.verified && (
            <Icon as={HiBadgeCheck} color="brand.500" boxSize={4} />
          )}
        </Flex>
      </Box>
    </Link>
  )
}

export default UserCard
