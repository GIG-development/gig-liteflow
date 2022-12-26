import {
  Accordion,
  Heading, 
  Stack
} from '@chakra-ui/react'
import Head from '../components/Head'
import AccordionItem from '../components/AccordionItem/AccordionItem'
import LargeLayout from '../layouts/large'
import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
  
const Gigcionario: NextPage = () => {
  const { t } = useTranslation('templates')
  return(
    <div id="giccionario">
      <LargeLayout>
          <Head
              title="GIGcionario"
              description="Glosario NFT, blockchain, crypto, drop... No te quedes con la duda. Aprende los conceptos principales de la Web 3 de manera práctica y entendible."
          />
          <Stack spacing={6} mb={20}>
              <Heading as={'h1'} variant="title">
                {t('glosary.title')}
              </Heading>
              <Accordion>
                <AccordionItem
                  question={t('glosary.terms.term1.term')}
                  answer={t('glosary.terms.term1.definition')}
                />
                <AccordionItem
                  question={t('glosary.terms.term2.term')}
                  answer={t('glosary.terms.term2.definition')}
                />
                <AccordionItem
                  question={t('glosary.terms.term3.term')}
                  answer={t('glosary.terms.term3.definition')}
                />
                <AccordionItem
                  question={t('glosary.terms.term4.term')}
                  answer={t('glosary.terms.term4.definition')}
                />
                <AccordionItem
                  question={t('glosary.terms.term5.term')}
                  answer={t('glosary.terms.term5.definition')}
                />
                <AccordionItem
                  question={t('glosary.terms.term6.term')}
                  answer={t('glosary.terms.term6.definition')}
                />
                <AccordionItem
                  question={t('glosary.terms.term7.term')}
                  answer={t('glosary.terms.term7.definition')}
                />
                <AccordionItem
                  question={t('glosary.terms.term8.term')}
                  answer={t('glosary.terms.term8.definition')}
                />
                <AccordionItem
                  question={t('glosary.terms.term9.term')}
                  answer={t('glosary.terms.term9.definition')}
                />
                <AccordionItem
                  question={t('glosary.terms.term10.term')}
                  answer={t('glosary.terms.term10.definition')}
                />
                <AccordionItem
                  question={t('glosary.terms.term11.term')}
                  answer={t('glosary.terms.term11.definition')}
                />
                <AccordionItem
                  question={t('glosary.terms.term12.term')}
                  answer={t('glosary.terms.term12.definition')}
                />
                <AccordionItem
                  question={t('glosary.terms.term13.term')}
                  answer={t('glosary.terms.term13.definition')}
                />
                <AccordionItem
                  question={t('glosary.terms.term14.term')}
                  answer={t('glosary.terms.term14.definition')}
                />
                <AccordionItem
                  question={t('glosary.terms.term15.term')}
                  answer={t('glosary.terms.term15.definition')}
                />
                <AccordionItem
                  question={t('glosary.terms.term16.term')}
                  answer={t('glosary.terms.term16.definition')}
                />
                <AccordionItem
                  question={t('glosary.terms.term17.term')}
                  answer={t('glosary.terms.term17.definition')}
                />
              </Accordion>
          </Stack>
      </LargeLayout>
    </div>
  )
}

export default Gigcionario