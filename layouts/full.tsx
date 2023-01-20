import { Box } from '@chakra-ui/react'
import { FC, PropsWithChildren } from 'react'

type Props = {
  backgroundColor?: string
  backgroundImage?: string
  children: any
  hasBottomCaret?: boolean
  id?: string
}

const FullLayout: FC<PropsWithChildren<Props>> = ({
    backgroundColor,
    backgroundImage,
    children,
    id,
    hasBottomCaret
}) => (
  <Box
    mx="auto"
    w="full"
    py={{ base: 8, lg: 12 }}
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