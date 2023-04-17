import { Box, Tooltip as TT } from '@chakra-ui/react'
import { BsInfoCircleFill as InfoIcon } from '@react-icons/all-files/Bs/BsInfoCircleFill'
import { FC, PropsWithChildren } from 'react'

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
                    <InfoIcon
                        color='lightgray'
                        fontSize='12'
                    />
                </span>
            </TT>
        </Box>
    )
}
  
export default Tooltip