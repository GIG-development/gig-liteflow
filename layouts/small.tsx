import { Box } from '@chakra-ui/react'
import { FC } from 'react'

const SmallLayout: FC = (props) => (
  <Box
    mx="auto"
    maxW="3xl"
    py={{ base: 8, lg: 12 }}
    px={{ base: 6, lg: 8 }}
    pb={10}
    style={{margin: '0 auto'}}
    {...props}
  />
)
export default SmallLayout
