import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Flex,
    Heading,
    Text
  } from '@chakra-ui/react'
import { FC, PropsWithChildren } from 'react'
import { FaFilter } from "@react-icons/all-files/fa/FaFilter";
import useTranslation from 'next-translate/useTranslation'
type Props = {
    children?: any
}

const FilterAccordion: FC<PropsWithChildren<Props>> = ({
    children
}) => {
    const {t} = useTranslation('components')
    return (
        <Accordion allowToggle>
            <AccordionItem>
                <h2>
                    <AccordionButton _expanded={{ bg: 'gray.200' }}>
                        <Flex flex='1' flexFlow={'row'} textAlign='left'>
                            <Box p='6px'>
                                <FaFilter/>
                            </Box>
                            <Heading variant={'heading1'}>
                                {t('filterAccordion.title')}
                            </Heading>
                        </Flex>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel py={6} px={2}>
                    <Text color={'gray.500'} fontSize={{base: 'sm', md: 'md'}}>
                        {children}
                    </Text>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    )
}

export default FilterAccordion