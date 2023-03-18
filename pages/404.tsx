import {
    Box,
    Button,
    Heading,
    Stack
} from '@chakra-ui/react'
import Link from '../components/Link/Link'
import Image from '../components/Image/Image'
import Head from '../components/Head'
import LargeLayout from '../layouts/large'
import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'

const Custom404: NextPage = () => {
    const { t } = useTranslation('templates')
    return (
    <main id="notFound">
        <LargeLayout>
            <Head
                title="Error 404"
                description=""
            />
            <Stack spacing={6} mb={20} align={'center'}>
                <Box w={{base: '320px', md: '600px'}} pos='relative'>
                    <Image
                        src={'/img/404/404.png'}
                        width='960px'
                        height='614px'
                        layout='responsive'
                        alt="404"
                    />
                </Box>
                <Heading variant={'subtitle'} textAlign={'center'}>
                    {t('error.404.message')}
                </Heading>
                <Link href='/'>
                    <Button>{t('error.404.button')}</Button>
                </Link>
            </Stack>
        </LargeLayout>
    </main>
    )
}

export default Custom404