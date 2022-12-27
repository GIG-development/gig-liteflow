import {
  Accordion,
  Heading, 
  Stack
} from '@chakra-ui/react'
import Link from '../components/Link/Link'
import Head from '../components/Head'
import AccordionItem from '../components/AccordionItem/AccordionItem'
import LargeLayout from '../layouts/large'
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
              <Accordion allowMultiple>
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
              <Heading as={'h4'} variant={'heading4'} textAlign={'center'}>
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