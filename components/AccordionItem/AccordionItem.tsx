import {
    AccordionItem as AI,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Heading,
    Text
  } from '@chakra-ui/react'
import { FC, PropsWithChildren } from 'react'
type Props = {
    title: string
    content?: string
    children?: any
}
  
const AccordionItem: FC<PropsWithChildren<Props>> = ({
    title,
    content,
    children
}) => {
    return (
        <AI>
            <h2>
                <AccordionButton p={{base: '6px 0', md: 4}} _expanded={{ bg: 'gray.200' }}>
                    <Box flex='1' textAlign='left'>
                        <Heading variant={'heading3'} fontSize={{base: 'sm', lg: 'md'}}>
                        {title}
                        </Heading>
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
                <Text color={'gray.500'} fontSize={{base: 'sm', md: 'md'}}>
                    {content}
                </Text>
                {children}
            </AccordionPanel>
        </AI>
    )
}

export default AccordionItem