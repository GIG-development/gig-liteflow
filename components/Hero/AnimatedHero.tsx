import {
    Button,
    Flex,
    Heading,
    Stack,
    Text,
    useBreakpointValue
} from '@chakra-ui/react'
import Link from '../Link/Link'
import { FC, PropsWithChildren, ReactElement } from 'react'
import Lottie from 'react-lottie-player';

type Props = {
    bg: string
    ctaLine_1: string
    ctaLine_2?: string
    description: string
    button_1?: string
    button_1_link?: string
    button_2?: string
    button_2_link?: string
    isSpecialButton?: boolean
    specialButton?: ReactElement<any,any>
    animation?: any
}
  
const AnimatedHero: FC<PropsWithChildren<Props>> = ({
    bg = '',
    ctaLine_1 = '',
    ctaLine_2 = '',
    description = '',
    button_1 = '',
    button_1_link = '',
    button_2 = '',
    button_2_link = '',
    isSpecialButton = false,
    specialButton = '',
    animation = ''
}) => {
    return (
    <div id="main-hero">
        <Flex
            w={'full'}
            h={useBreakpointValue({sm:'100vh', md: '64vh'})}
            backgroundImage={`url(${bg})`}
            backgroundSize={'cover'}
            backgroundPosition={'center center'}
        >
            <Stack minH={'64vh'} maxW={'7xl'} direction={{ base: 'column', md: 'row' }} margin={'0 auto'}>
                <Flex minW={'fit-content'} p={8} flex={1} align={'center'} justify={'center'}>
                    <Stack spacing={6} w={'full'} maxW={'lg'}>
                        <Heading fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}>
                            <Text
                            as={'span'}
                            position={'relative'}
                            color={'white'}
                            fontWeight={'300'}
                            >
                                {ctaLine_1}
                            </Text>
                            {' '}<br/>
                            {ctaLine_2!=='' && 
                            <>
                                <Text
                                color={'white'}
                                as={'span'}
                                >
                                    {ctaLine_2}
                                </Text>{' '}
                            </>
                            }
                        </Heading>
                        <Text fontSize={{ base: 'lg', lg: 'lg' }} color={'white'} mt={2}>
                                {description}
                        </Text>
                        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                            { (button_1!=='' && button_1_link!=='')  && 
                                <Link href={button_1_link}>
                                    <Button
                                        rounded={'full'}
                                        size={'lg'}
                                        px={6}
                                        colorScheme={'brand'}
                                        bg={'brand.400'}
                                        _hover={{ bg: 'brand.500' }}>
                                            {button_1}
                                    </Button>
                                </Link>
                            }
                            { (button_2!=='' && button_2_link!=='') && 
                                <Link href={button_2_link}>
                                    <Button
                                    rounded={'full'}
                                    size={'lg'}
                                    px={6}>
                                        {button_2}
                                    </Button>
                                </Link>
                            }
                            {isSpecialButton && 
                            <>
                                {specialButton}
                            </>
                            }
                        </Stack>
                    </Stack>
                </Flex>
                <Flex flex={1}>
                    {animation!=='' &&
                       <Lottie
                            loop={true}
                            animationData={animation}
                            play
                            style={{ width: 'auto', height: '100%', maxWidth: '100%' }}
                        />
                    }
                </Flex>
            </Stack>
        </Flex>
    </div>
    )
}
  
export default AnimatedHero