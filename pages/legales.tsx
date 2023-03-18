import {
    Box,
    Flex,
    Heading,
    Stack
  } from '@chakra-ui/react'
  import Head from '../components/Head'
  import LargeLayout from '../layouts/large'
  import { NextPage } from 'next'
  import useTranslation from 'next-translate/useTranslation'
  import { event } from 'nextjs-google-analytics'
  import Link from 'components/Link/Link'
    
  const Contacto: NextPage = () => {
    const { t } = useTranslation('templates')

    const callAnalyticsEvent = (desc: string) => {
        event("DownloadLegalDocs", {
            category: "Download",
            label: desc
        })
    }

    return (
      <main id="contacto">
        <LargeLayout>
            <Head
                title="Legales"
                description=""
            />
            <Stack spacing={6} mb={20} align={'center'}>
                <Heading as={'h1'} variant="title">
                  {t('legal.title')}
                </Heading>
                <Flex gap={6} flexDir={{base: "column", md: "row"}}>
                    <Box
                        w={'320px'}
                        p={6}
                        rounded="xl"
                        borderWidth="1px"
                        borderColor="gray.200"
                        _hover={{
                            shadow: '1px 0px 8px 6px #f2f2f2'
                        }
                    }>
                        <Link
                            as={Flex} 
                            gap={4}
                            flexDir='column'
                            alignItems='center'
                            href='https://gig.io/GIG-Terminos_Legales.pdf'
                            isExternal
                            onClick={()=>{callAnalyticsEvent('TerminosCondiciones')}}
                        >
                            <Heading as='h2' variant='heading4'>
                                {t('legal.terms')}
                            </Heading>
                        </Link>
                    </Box>
                    <Box
                        w={'320px'}
                        p={6}
                        rounded="xl"
                        borderWidth="1px"
                        borderColor="gray.200"
                        _hover={{
                            shadow: '1px 0px 8px 6px #f2f2f2'
                        }
                    }>
                        <Link
                            as={Flex}
                            gap={4}
                            flexDir='column'
                            alignItems='center'
                            href='https://gig.io/GIG-Aviso_de_Privacidad.pdf'
                            isExternal
                            onClick={()=>{callAnalyticsEvent('AvisoPrivacidad')}}
                        >
                            <Heading as='h2' variant='heading4'>
                                {t('legal.privacy')}
                            </Heading>
                        </Link>
                    </Box>
                </Flex>
            </Stack>
        </LargeLayout>
      </main>
    )
  }
  
  export default Contacto