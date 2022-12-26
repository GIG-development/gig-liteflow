import {
    Container,
    SimpleGrid,
    Image,
    Flex,
    Heading,
    Text,
    Stack,
    useBreakpointValue
} from '@chakra-ui/react';
import Head from '../components/Head'
import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import LargeLayout from '../layouts/large'
  
const Nosotros: NextPage = () => {
    const { t } = useTranslation('templates')
    return (
        <div id="nosotros">
            <LargeLayout>
            <Head
                title="Nosotros"
                description="Te ayudamos a materializar tu imaginación y monetizar tus proyectos. Estamos contigo desde la ideación, producción, promoción y venta de tus NFTs."
            />
                <Stack spacing={6} mb={20}>
                    <Heading as={'h1'} variant="title">
                        {t('about.title')}
                    </Heading>
                    <Container maxW={'full'} py={12}>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignContent='center'>
                            <Flex justifyContent='center' align-items='center'>
                                <Image
                                    rounded={'md'}
                                    alt={'Quienes somos'}
                                    src={'/img/home/main_hero_img.png'}
                                    maxW={"340px"}
                                    objectFit={'cover'}
                                />
                            </Flex>
                            <Stack spacing={4}>
                                <Text color={'gray.500'} fontSize={useBreakpointValue({ base: 'sm', md: 'md' })}>
                                {t('about.block1.line1')}{' '}
                                <b>{t('about.block1.line2')}</b>
                                <br/><br/>
                                {t('about.block1.line3')}
                                </Text>
                            </Stack>
                        </SimpleGrid>
                    </Container>
                    <Container maxW={'full'} pb={12}>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignContent='center'>
                            <Stack spacing={4}>
                                <Heading as={'h2'} variant={'subtitle'}>{t('about.manifesto.title')}</Heading>
                                <Text color={'gray.500'} fontSize={useBreakpointValue({ base: 'sm', md: 'md' })}>
                                    {t('about.manifesto.line1')}
                                </Text>
                                <Text color={'gray.500'} fontSize={useBreakpointValue({ base: 'sm', md: 'md' })}>
                                    {t('about.manifesto.line2')}
                                </Text>
                                <Text color={'gray.500'} fontSize={useBreakpointValue({ base: 'sm', md: 'md' })}>
                                    {t('about.manifesto.line3')}
                                    <br/>
                                    <b>{t('about.manifesto.line4')}</b> 
                                </Text>
                            </Stack>
                            <Flex justifyContent='center' align-items='center'>
                                <Image
                                    rounded={'md'}
                                    alt={'Manifiesto'}
                                    src={'/img/nosotros/manifiesto.png'}
                                    maxW={"200px"}
                                    objectFit={'cover'}
                                />
                            </Flex>
                        </SimpleGrid>
                    </Container>
                    
                    <Container maxW={'full'} pb={12}>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignContent='center'>
                            <Flex justifyContent='center' align-items='center'>
                                <Image
                                    rounded={'md'}
                                    alt={'Como funciona'}
                                    src={'/img/nosotros/como_funciona.png'}
                                    maxW={"340px"}
                                    objectFit={'cover'}
                                />
                            </Flex>
                            <Stack spacing={4}>
                            <Heading as={'h2'} variant={'subtitle'}>{t('about.howItWorks.title')}</Heading>
                            <Text color={'gray.500'} fontSize={useBreakpointValue({ base: 'sm', md: 'md' })}>
                                {t('about.howItWorks.line1')}
                            </Text>
                            <Text color={'gray.500'} fontSize={useBreakpointValue({ base: 'sm', md: 'md' })}>
                                {t('about.howItWorks.line2')}
                            </Text>
                            </Stack>
                        </SimpleGrid>
                    </Container>
                    
                    <Container maxW={'full'}>
                        <Text textAlign={'center'} fontSize={useBreakpointValue({ base: 'sm', md: 'md' })}>
                                {t('about.block2.line1')}
                        </Text>
                        <Text textAlign={'center'} fontSize={useBreakpointValue({ base: 'md', md: 'lg' })} pt={4}>
                            <b>{t('about.block2.line1')}</b>
                        </Text>
                    </Container>
                    
                </Stack>
            </LargeLayout>
        </div>
    )
}

export default Nosotros
  