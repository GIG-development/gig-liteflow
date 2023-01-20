import {
  Accordion,
  Flex,
  Heading, 
  Stack
} from '@chakra-ui/react'
import Link from '../components/Link/Link'
import Head from '../components/Head'
import AccordionItem from '../components/AccordionItem/AccordionItem'
import LargeLayout from '../layouts/large'
import Lottie from 'react-lottie-player';
import faqsAnim from '../public/img/animaciones/faqs.json'
import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import environment from 'environment'
  
const FAQ: NextPage = () => {
  const { t } = useTranslation('templates')
  return(
    <div id="faqs">
      <LargeLayout>
          <Head
              title="Preguntas Frecuentes"
              description="Encuentra las respuestas que necesitas para entrar al metaverso creando NFTs de tus proyectos con confianza."
          />
          <Stack spacing={6} mb={20}>
              <Heading as={'h1'} variant="title">
                  {t('faqs.title')}
              </Heading>
              <Flex flexDirection={{base: 'column', md: 'row'}} gap={6} pt={12}>
                <Accordion w={{base: '100%', md: '80%'}} allowMultiple>
                  <AccordionItem
                    title={t('faqs.question1.question')}
                    content={t('faqs.question1.answer')}
                  />
                  <AccordionItem
                    title={t('faqs.question2.question')}
                    content={t('faqs.question2.answer')}
                  />
                  <AccordionItem
                    title={t('faqs.question3.question')}
                    content={t('faqs.question3.answer')}
                  />
                  <AccordionItem
                    title={t('faqs.question4.question')}
                    content={t('faqs.question4.answer')}
                  />
                  <AccordionItem
                    title={t('faqs.question5.question')}
                    content={t('faqs.question5.answer')}
                  />
                  <AccordionItem
                    title={t('faqs.question6.question')}
                    content={t('faqs.question6.answer')}
                  />
                  <AccordionItem
                    title={t('faqs.question7.question')}
                    content={t('faqs.question7.answer')}
                  />
                  <AccordionItem
                    title={t('faqs.question8.question')}
                    content={t('faqs.question8.answer')}
                  />
                  <AccordionItem
                    title={t('faqs.question9.question')}
                    content={t('faqs.question9.answer')}
                  />
                </Accordion>
                <Lottie
                    loop={true}
                    animationData={faqsAnim}
                    play
                    style={{ width: '320px', height: 'auto', marginTop: '-40px', marginLeft: '40px' }}
                />
              </Flex>
              <Heading as={'h4'} variant={'heading4'} textAlign={'center'} pt={20}>
                {t('faqs.footerLine1')}{' '}
                <Link href={'/tutoriales'}>{t('faqs.footerLine2')}</Link>{' '}
                {t('faqs.footerLine3')}{' '}
                <Link href={`mailto:${environment.REPORT_EMAIL}`}>{environment.REPORT_EMAIL}</Link>
              </Heading>
          </Stack>
      </LargeLayout>
    </div>
  )
}

export default FAQ