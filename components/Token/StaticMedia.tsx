import { Box, Center, Icon, Stack, Text, useTheme } from '@chakra-ui/react'
import { FaImage } from '@react-icons/all-files/fa/FaImage'
import Image from '../Image/Image'
import { useEffect, useState, VFC } from 'react'

const TokenStaticMedia: VFC<{
  image: string | null | undefined
  animationUrl: string | null | undefined
  unlockedContent: { url: string; mimetype: string | null } | null | undefined
  defaultText?: string
  controls?: boolean
  fill?: boolean
  sizes: string
}> = ({
  image,
  unlockedContent,
  defaultText,
  //fill,
  controls,
  //sizes,
}) => {
  const { colors } = useTheme()

  const [imageError, setImageError] = useState(false)
  // reset when image change. Needed when component is recycled
  useEffect(() => {
    setImageError(false)
  }, [image])

  if (image) {
    if (image.search('.mp4') > -1){
      return (
        <Box
        as="video"
        src={image}
        autoPlay
        playsInline
        muted
        loop
        controls={controls}
        poster={image ?? ''}
        maxW="full"
        maxH="full"
      />
      )
    }
    if (imageError)
      return (
        <>
          <svg viewBox="0 0 1 1">
            <rect width="1" height="1" fill={colors.brand[100]} />
          </svg>
          <Center width="100%" height="100%" position="absolute">
            <Stack align="center" spacing={3}>
              <Icon as={FaImage} color="gray.500" w="5em" h="4em" />
              <Text color="gray.500" fontWeight="600">
                An issue occurred
              </Text>
            </Stack>
          </Center>
        </>
      )
    return (
      <Box position="relative" w="full" h="full">
        <Image
          src={image}
          alt={defaultText}
          onError={() => setImageError(true)}
          layout="fill"
          objectFit={'cover'}
          //objectFit={fill ? 'cover' : 'scale-down'}
          //sizes={sizes}
          unoptimized={unlockedContent?.mimetype === 'image/gif'}
        />
      </Box>
    )
  }
  return <Box bgColor="brand.50" h="full" w="full" />
}

export default TokenStaticMedia
