import { Box, Tooltip as TT } from '@chakra-ui/react'
import { FC, PropsWithChildren } from 'react'
import { BsFillInfoCircleFill as InfoIcon } from '@react-icons/all-files/bs/BsFillInfoCircleFill'

type Props = {
    text: string
}

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
                    <InfoIcon color='lightgray' fontSize={12} cursor='pointer'/>
                </span>
            </TT>
        </Box>
    )
}
  
export default Tooltip