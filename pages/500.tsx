import {
    Box,
    Button,
    Heading,
    Text,
    Stack
} from '@chakra-ui/react'
import Link from '../components/Link/Link'
import Image from '../components/Image/Image'
import Head from '../components/Head'
import LargeLayout from '../layouts/large'
import environment from '../environment'
import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'

const Custom500: NextPage = () => {
    const { t } = useTranslation('templates')
    return (
        <main id="server-error">
            <LargeLayout>
                <Head
                    title="Error 500"
                    description=""
                />
                <Stack spacing={6} mb={20} align={'center'}>
                    <Box w={{base: '320px', md: '600px'}} pos='relative'>
                        <Image
                            src={'/img/familia/eskeri.png'}
                            width='120px'
                            height='120px'
                            layout='responsive'
                            alt="500"
                        />
                    </Box>
                    <Heading variant={'subtitle'} textAlign={'center'}>
                        {t('error.500.message')}
                    </Heading>
                    <Text>
                        {t('error.500.text1')}{' '}
                        <strong><Link href='mailto:soporte@gig.io'>{environment.REPORT_EMAIL}</Link></strong>{' '}
                        {t('error.500.text2')}{' '}
                        <strong><Link href='/contacto'>{' '}{t('error.500.text3')}</Link></strong>
                    </Text>
                    <Link href='/'>
                        <Button>{t('error.500.button')}</Button>
                    </Link>
                </Stack>
            </LargeLayout>
        </main>
    )
}

export default Custom500