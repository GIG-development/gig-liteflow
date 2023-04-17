import { Box, Tooltip as TT } from '@chakra-ui/react'
import { FC, PropsWithChildren } from 'react'

type Props = {
    text: string
}

const InfoIcon = <svg xmlns="http://www.w3.org/2000/svg" width='14px' height='14px' fill='lightgray' viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
  
const Tooltip: FC<PropsWithChildren<Props>> = ({
    text
}) => { 

    return (
        <Box pl={2}>
            <TT
                label={text}
                hasArrow
                fontSize='sm'
                placement='right'
                backgroundColor='brand.400'
                color='white'
                rounded={4}
            >
                <span>
                    {InfoIcon}
                </span>
            </TT>
        </Box>
    )
}
  
export default Tooltip