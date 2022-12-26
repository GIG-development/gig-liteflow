import {
    Stack,
    Flex,
    Button,
    Heading,
    Text,
    useBreakpointValue
} from '@chakra-ui/react';
import Link from '../Link/Link'
import { FC, PropsWithChildren } from 'react'

type Props = {
    cta: string
    description: string
    button1: string
    button2: string
    image?: string
}
  
const Banner: FC<PropsWithChildren<Props>> = ({
    cta,
    description,
    button1,
    button2,
    image
}) => { 
    return (
        <>
        <Flex
            w={'full'}
            h={{base: '40vh', md: '40vh'}}
            align={'center'}
            justify={'center'}
            backgroundImage={
                `url(${image})`
            }
            backgroundSize={useBreakpointValue({ base: '100%', md: '70%' })}
            backgroundPosition={'center center'}
            backgroundRepeat={'no-repeat'}
        >
            <Stack
                w={{base: 'xs', md: '7xl'}}
                spacing={6}
                align={'center'}
                mt={'-60px'}
            >
                <Heading as="h2" size={useBreakpointValue({ base: 'lg', md: '3xl' })}>
                    {cta}
                </Heading>
                <Text
                    color={'brand.black'}
                    fontWeight={400}
                    lineHeight={1}
                    align={'center'}
                    fontSize={useBreakpointValue({ base: 'md', md: 'xl' })}>
                    {description}
                </Text>
                <Stack spacing={6} direction={useBreakpointValue({ base: 'column', md: 'row' })} align={'center'}>
                    <Link href={'/tutoriales'}>
                        <Button
                        rounded={'full'}
                        color={'white'}
                        bg={'brand.500'}
                        _hover={{ bg: 'brand.600' }}>
                        {button1}
                        </Button>
                    </Link>
                    <Link href={'/faq'}>
                        <Button
                        rounded={'full'}
                        color={'white'}
                        bg={'gray.400'}
                        _hover={{ bg: 'gray.600' }}>
                        {button2}
                        </Button>
                    </Link>
                </Stack>
            </Stack>
        </Flex>
        </>
    )
}
  
export default Banner