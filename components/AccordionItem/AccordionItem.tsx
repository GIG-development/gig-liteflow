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
    question: string
    answer: string
}
  
const AccordionItem: FC<PropsWithChildren<Props>> = ({
    question,
    answer
}) => {
    return (
        <AI>
            <h2>
                <AccordionButton>
                <Box flex='1' textAlign='left'>
                    <Heading variant={'heading3'}>
                    {question}
                    </Heading>
                </Box>
                <AccordionIcon />
                </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
                <Text color={'gray.500'} fontSize={{base: 'sm', md: 'md'}}>
                    {answer}
                </Text>
            </AccordionPanel>
        </AI>
    )
}

export default AccordionItem