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
    
  const Legales: NextPage = () => {
    const { t } = useTranslation('templates')

    const callAnalyticsEvent = (desc: string) => {
        event("DownloadLegalDocs", {
            category: "Download",
            label: desc
        })
    }

    return (
      <main id="legales">
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
                        <Flex
                            as={Link} 
                            gap={4}
                            flexDir='column'
                            alignItems='center'
                            href={t('legal.termsFile')}
                            isExternal
                            onClick={()=>{callAnalyticsEvent('TerminosCondiciones')}}
                        >
                            <Heading as='h2' variant='heading4'>
                                {t('legal.terms')}
                            </Heading>
                        </Flex>
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
                        <Flex
                            as={Link}
                            gap={4}
                            flexDir='column'
                            alignItems='center'
                            href={t('legal.privacyFile')}
                            isExternal
                            onClick={()=>{callAnalyticsEvent('AvisoPrivacidad')}}
                        >
                            <Heading as='h2' variant='heading4'>
                                {t('legal.privacy')}
                            </Heading>
                        </Flex>
                    </Box>
                </Flex>
            </Stack>
        </LargeLayout>
      </main>
    )
  }
  
  export default Legales