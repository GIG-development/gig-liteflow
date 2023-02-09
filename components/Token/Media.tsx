import { Box, Center, Icon, Stack, Text } from '@chakra-ui/react'
import { FaImage } from '@react-icons/all-files/fa/FaImage'
import Image, { ImageProps } from 'next/image'
import { useEffect, useState, useCallback, VFC, VideoHTMLAttributes } from 'react'

const TokenMedia: VFC<
  (Omit<VideoHTMLAttributes<any>, 'src'> | Omit<ImageProps, 'src'>) & {
    image: string | null | undefined
    animationUrl: string | null | undefined
    unlockedContent: { url: string; mimetype: string | null } | null | undefined
    defaultText?: string
    controls?: boolean | undefined
    layout?: string | undefined
  }
> = ({
  image,
  animationUrl,
  unlockedContent,
  defaultText,
  layout,
  controls,
  ...props
}) => {
  // prioritize unlockedContent
  if (unlockedContent) {
    if (unlockedContent.mimetype?.startsWith('video/'))
      animationUrl = unlockedContent.url
    else image = unlockedContent.url
  }


  const [canPlayCodecs, setCanPlayCodecs] = useState('checking')
  const canPlay = useCallback(() => {
    const video = document.createElement('video')
    const canPlayMp4v208 = video.canPlayType('video/mp4;codecs="mp4v.20.8"') !== '' ? true : false
    const canPlayMp4avc1 = video.canPlayType('video/mp4;codecs="avc1.42E01E"') !== '' ? true : false

    setCanPlayCodecs(`Mp4v208: ${canPlayMp4v208}', Mp4avc1: '${canPlayMp4avc1}`)
    return
  }, [])
  useEffect(canPlay,[canPlay, canPlayCodecs])

  const [imageError, setImageError] = useState(false)
  // reset when image change. Needed when component is recycled
  useEffect(() => {
    setImageError(false)
  }, [image, canPlay])

  if (animationUrl) {
    const { objectFit, src, ...videoProps } = props as ImageProps
    return (<>
      <video
        autoPlay
        playsInline
        muted
        loop
        controls={controls}
        poster={image ?? ''}
        {...(videoProps as Omit<VideoHTMLAttributes<any>, 'src'>)}
      >
        <source src={animationUrl} type="video/mp4"/>
        <Text color="gray.500" fontWeight="600">
          An issue occurred
        </Text>
      </video>
      <Text color="gray.200"  fontSize='8'>
        (Codec is playable: {canPlayCodecs})
      </Text>
    </>
    )
  }
  if (image) {
    const rest = props as Omit<ImageProps, 'src'>
    if (imageError)
      return (
        <Center width="100%" height="100%" bg="brand.100">
          <Stack align="center" spacing={3}>
            <Icon as={FaImage} color="gray.500" w="5em" h="4em" />
            <Text color="gray.500" fontWeight="600">
              An issue occurred
            </Text>
          </Stack>
        </Center>
      )
    if (image.search('.mp4') > -1){
      const { objectFit, src, ...videoProps } = props as ImageProps
      return (<>
        <video
          autoPlay
          playsInline
          muted
          loop
          controls={controls}
          poster='/social_og-image.jpg'
          {...(videoProps as Omit<VideoHTMLAttributes<any>, 'src'>)}
        >
          <source src={image} type="video/mp4"/>
          <Text color="gray.500" fontWeight="600">
          An issue occurred
          </Text>
        </video>
        <Text color="gray.200"  fontSize='8'>
          (Codec is playable: {canPlayCodecs})
        </Text>
        </>
      )
    }
    const customTag = { Image: Image as any }
    return (
      <customTag.Image
        src={image}
        alt={defaultText}
        onError={() => setImageError(true)}
        layout={layout}
        {...rest}
      />
    )
  }
  return <Box bgColor="brand.50" h="full" w="full" />
}

export default TokenMedia
