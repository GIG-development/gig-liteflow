import {
  Heading,
  Stack,
  Text
} from '@chakra-ui/react'
import Link from '../components/Link/Link'
import Head from '../components/Head'
import LargeLayout from '../layouts/large'
import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import environment from '../environment'
  
const Tutoriales: NextPage = () => {
  const { t } = useTranslation('templates')
  return(
    <div id="tutoriales">
      <LargeLayout>
          <Head
              title="Tutoriales"
              description="Sigue estos pasos para que tu camino por el ecosistema cripto sea lo más amigable. No necesitas ser experto, solo necesitas tu talento."
          />
          <Stack spacing={6} mb={20}>
              <Heading as={'h1'} variant="title">
                {t('tutorials.title')}
              </Heading>
              <Text size={'sm'}>
                {t('tutorials.line1')}
              </Text>
              <Heading as={'h2'} variant="subtitle">
                {t('tutorials.tutorial1.title')}
              </Heading>
              <Text>
                <ol>
                  <li>{t('tutorials.tutorial1.steps.step1')}</li>
                  <li>{t('tutorials.tutorial1.steps.step2')}</li>
                  <li>{t('tutorials.tutorial1.steps.step3')}</li>
                  <li>{t('tutorials.tutorial1.steps.step4')}</li>
                  <li>{t('tutorials.tutorial1.steps.step5')}</li>
                  <li>{t('tutorials.tutorial1.steps.step6')}</li>
                  <li>{t('tutorials.tutorial1.steps.step7')}</li>
                  <li>{t('tutorials.tutorial1.steps.step8')}</li>
                  <li>{t('tutorials.tutorial1.steps.step9')}</li>
                  <li>{t('tutorials.tutorial1.steps.step10')}</li>
                </ol>
              </Text>
                
              <Heading as={'h2'} variant="subtitle">
                {t('tutorials.tutorial2.title')}
              </Heading>
              <Text>
                <ol>
                  <li>{t('tutorials.tutorial2.steps.step1')}</li>
                  <li>
                    {t('tutorials.tutorial2.steps.step2.line1')}{' '}
                    <Link href="/creadores">{t('tutorials.tutorial2.steps.step2.line2')}</Link>{' '}
                    {t('tutorials.tutorial2.steps.step2.line3')}
                  </li>
                  <li>{t('tutorials.tutorial2.steps.step3')}</li>
                  <li>{t('tutorials.tutorial2.steps.step4')}</li>
                </ol>
                {t('tutorials.tutorial2.steps.step5')}{' '}<Link href={`mailto:${environment.REPORT_EMAIL}`}>{environment.REPORT_EMAIL}</Link>
              </Text>
              
              <Heading as={'h2'} variant="subtitle">
                {t('tutorials.tutorial3.title')}
              </Heading>
              <Text>
                <ol>
                  <li>{t('tutorials.tutorial3.steps.step1.line1')}<Link href="/creadores">{t('tutorials.tutorial3.steps.step1.line2')}</Link></li>
                  <li>{t('tutorials.tutorial3.steps.step2.line1')}{' '}<b>{t('tutorials.tutorial3.steps.step2.line2')}</b></li>
                  <li>{t('tutorials.tutorial3.steps.step3')}</li>
                  <li>{t('tutorials.tutorial3.steps.step4')}</li>
                  <li>{t('tutorials.tutorial3.steps.step5.line1')}
                    <ul>
                      <li>{t('tutorials.tutorial3.steps.step5.line2')}</li>
                      <li>{t('tutorials.tutorial3.steps.step5.line3')}</li>
                      <li>{t('tutorials.tutorial3.steps.step5.line4')}</li>
                      <li>{t('tutorials.tutorial3.steps.step5.line5')}</li>
                    </ul>
                  <li>{t('tutorials.tutorial3.steps.step6')}</li>
                  </li>
                </ol>
                {t('tutorials.tutorial3.steps.step7')}
              </Text>
              
              <Heading as={'h2'} variant="subtitle">
                {t('tutorials.tutorial4.title')}
              </Heading>
              <Text>
                <ol>
                  <li>{t('tutorials.tutorial4.steps.step1')}</li>
                  <br/>
                  {t('tutorials.tutorial4.steps.step2')}
                </ol>
              </Text>
              
              <Heading as={'h2'} variant="subtitle">
                {t('tutorials.tutorial5.title')}
              </Heading>
              <Text>
                <ol>
                  <li>{t('tutorials.tutorial5.steps.step1')}</li>
                </ol>
              <br/>
              {t('tutorials.tutorial5.steps.step2')}
              <br/>
              {t('tutorials.tutorial5.steps.step3')}
              </Text>

          </Stack>
      </LargeLayout>
    </div>
  )
}

export default Tutoriales