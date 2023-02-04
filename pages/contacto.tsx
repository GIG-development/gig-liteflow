import {
  Heading,
  Image,
  Stack,
  Text
} from '@chakra-ui/react'
import Head from '../components/Head'
import LargeLayout from '../layouts/large'
import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import {event} from 'nextjs-google-analytics'
  
const Contacto: NextPage = () => {
  const { t } = useTranslation('templates')
  return (
    <main id="contacto">
      <LargeLayout>
          <Head
              title="Contacto"
              description="Experto, amateur o entusiasta de la industria NFT y la web 3.0, queremos escucharte. Encuéntranos aquí: soporte@gig.io"
          >
              <script src="//embed.typeform.com/next/embed.js"></script>
          </Head>
          <Stack spacing={6} mb={20} align={'center'}>
              <Heading as={'h1'} variant="title">
                {t('contact.title')}
              </Heading>
              <Image alt="Contactanos" src='/img/contacto.png' w={'320px'}/>
              <Heading variant={'heading3'}>
                {t('contact.subtitle')}
              </Heading>
              <Text textAlign={'center'}>
                {t('contact.line1')}<br/>
                {t('contact.line2')}{' '}<b>@holagig</b>
              </Text>
              <button
                data-tf-slider={t('contact.formId')}
                data-tf-hide-headers data-tf-position="right"
                data-tf-button-color="#BE94FF"
                data-tf-iframe-props="title=Contact Form"
                data-tf-chat
                className='btn'
                onClick={()=>{
                  event("InitContactForm", {
                    category: "Contact",
                    label: "Se inicio el formulario de contacto"
                  })
                }}
              >
                {t('contact.button')}
              </button>
          </Stack>
      </LargeLayout>
    </main>
  )
}

export default Contacto