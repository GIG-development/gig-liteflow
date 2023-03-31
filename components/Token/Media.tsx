import { Box, Center, Icon, Stack, Text, useTheme } from '@chakra-ui/react'
import { FaImage } from '@react-icons/all-files/fa/FaImage'
import { useEffect, useState, VFC, useCallback } from 'react'
import Image from '../Image/Image'

const TokenMedia: VFC<{
  image: string | null | undefined
  animationUrl: string | null | undefined
  unlockedContent: { url: string; mimetype: string | null } | null | undefined
  defaultText?: string
  controls?: boolean
  fill?: boolean
  sizes: string
}> = ({
  image,
  animationUrl,
  unlockedContent,
  defaultText,
  fill,
  controls,
  sizes,
}) => {
  const { colors } = useTheme()

  // prioritize unlockedContent
  if (unlockedContent) {
    if (unlockedContent.mimetype?.startsWith('video/'))
      animationUrl = unlockedContent.url
    else image = unlockedContent.url
  }


  const [canPlayCodecs, setCanPlayCodecs] = useState('checking')
  const canPlay = useCallback(() => {
    const video = document.createElement('video')
    setCanPlayCodecs(`Mp4v208: ${video.canPlayType('video/mp4;codecs="mp4v.20.8"')}', Mp4avc1: '${video.canPlayType('video/mp4;codecs="avc1.42E01E"')}`)
    return
  }, [])
  useEffect(canPlay,[canPlay, canPlayCodecs])

  const [imageError, setImageError] = useState(false)
  // reset when image change. Needed when component is recycled
  useEffect(() => {
    setImageError(false)
  }, [image, canPlay])

  if (animationUrl) {
    return (
      <Box
        as="video"
        src={animationUrl}
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
  if (image) {
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
    return (
      <Box position="relative" w="full" h="full">
        <Image
          src={image}
          alt={defaultText}
          onError={() => setImageError(true)}
          layout="fill"
          objectFit={fill ? 'cover' : 'scale-down'}
          sizes={sizes}
          unoptimized={unlockedContent?.mimetype === 'image/gif'}
        />
      </Box>
    )
  }
  return (
    <svg viewBox="0 0 1 1">
      <rect width="1" height="1" fill={colors.brand[50]} />
    </svg>
  )
}

export default TokenMedia
