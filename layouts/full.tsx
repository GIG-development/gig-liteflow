import { Box } from '@chakra-ui/react'
import { FC, PropsWithChildren } from 'react'

type Props = {
  backgroundColor?: string
  backgroundImage?: string
  padding?: {
    mobile: string
    desktop: string
  }
  children: any
  hasBottomCaret?: boolean
  id?: string
}

const FullLayout: FC<PropsWithChildren<Props>> = ({
    backgroundColor,
    backgroundImage,
    padding,
    children,
    id,
    hasBottomCaret
}) => (
  <Box
    mx="auto"
    w="full"
    py={{ base: padding ? padding.mobile : 8, lg: padding ? padding.desktop : 12 }}
    backgroundColor={backgroundColor}
    backgroundImage={
      backgroundImage ? `url(${backgroundImage})` : ''
    }
    className={hasBottomCaret?'hasBottomCaret':''}
    id={id?id:''}
  >
    {children}
  </Box>
)
export default FullLayout