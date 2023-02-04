import {
  Accordion,
  Flex,
  Heading, 
  Stack
} from '@chakra-ui/react'
import Head from '../components/Head'
import AccordionItem from '../components/AccordionItem/AccordionItem'
import LargeLayout from '../layouts/large'
import Lottie from 'react-lottie-player';
import giccAnim from '../public/img/animaciones/gigcionario.json'
import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
  
const Gigcionario: NextPage = () => {
  const { t } = useTranslation('templates')
  return(
    <main id="giccionario">
      <LargeLayout>
          <Head
              title="GIGcionario"
              description="Glosario NFT, blockchain, crypto, drop... No te quedes con la duda. Aprende los conceptos principales de la Web 3 de manera práctica y entendible."
          />
          <Stack spacing={6} mb={20}>
              <Heading as={'h1'} variant="title">
                {t('glosary.title')}
              </Heading>
              <Flex flexDirection={{base: 'column', md: 'row'}} gap={6} pt={12}>
                <Lottie
                    loop={true}
                    animationData={giccAnim}
                    play
                    style={{ width: '320px', height: 'auto' }}
                />
                <Accordion w={{base: '100%', md: '80%'}} allowMultiple>
                  <AccordionItem
                    title={t('glosary.terms.term1.term')}
                    content={t('glosary.terms.term1.definition')}
                  />
                  <AccordionItem
                    title={t('glosary.terms.term2.term')}
                    content={t('glosary.terms.term2.definition')}
                  />
                  <AccordionItem
                    title={t('glosary.terms.term3.term')}
                    content={t('glosary.terms.term3.definition')}
                  />
                  <AccordionItem
                    title={t('glosary.terms.term4.term')}
                    content={t('glosary.terms.term4.definition')}
                  />
                  <AccordionItem
                    title={t('glosary.terms.term5.term')}
                    content={t('glosary.terms.term5.definition')}
                  />
                  <AccordionItem
                    title={t('glosary.terms.term6.term')}
                    content={t('glosary.terms.term6.definition')}
                  />
                  <AccordionItem
                    title={t('glosary.terms.term7.term')}
                    content={t('glosary.terms.term7.definition')}
                  />
                  <AccordionItem
                    title={t('glosary.terms.term8.term')}
                    content={t('glosary.terms.term8.definition')}
                  />
                  <AccordionItem
                    title={t('glosary.terms.term9.term')}
                    content={t('glosary.terms.term9.definition')}
                  />
                  <AccordionItem
                    title={t('glosary.terms.term10.term')}
                    content={t('glosary.terms.term10.definition')}
                  />
                  <AccordionItem
                    title={t('glosary.terms.term11.term')}
                    content={t('glosary.terms.term11.definition')}
                  />
                  <AccordionItem
                    title={t('glosary.terms.term12.term')}
                    content={t('glosary.terms.term12.definition')}
                  />
                  <AccordionItem
                    title={t('glosary.terms.term13.term')}
                    content={t('glosary.terms.term13.definition')}
                  />
                  <AccordionItem
                    title={t('glosary.terms.term14.term')}
                    content={t('glosary.terms.term14.definition')}
                  />
                  <AccordionItem
                    title={t('glosary.terms.term15.term')}
                    content={t('glosary.terms.term15.definition')}
                  />
                  <AccordionItem
                    title={t('glosary.terms.term16.term')}
                    content={t('glosary.terms.term16.definition')}
                  />
                  <AccordionItem
                    title={t('glosary.terms.term17.term')}
                    content={t('glosary.terms.term17.definition')}
                  />
                </Accordion>
              </Flex>
          </Stack>
      </LargeLayout>
    </main>
  )
}

export default Gigcionario