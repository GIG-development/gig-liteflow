import {
    Box,
    chakra,
    Container,
    SimpleGrid,
    Stack,
    Text,
    VisuallyHidden,
    useColorModeValue,
} from '@chakra-ui/react';
import Image from 'next/image';
import Link from '../Link/Link'
import { FaInstagram } from '@react-icons/all-files/fa/FaInstagram';
//import { FaTwitter } from '@react-icons/all-files/fa/FaTwitter';
import { FaYoutube } from '@react-icons/all-files/fa/FaYoutube';
import { FC, PropsWithChildren, ReactNode } from 'react'
import useTranslation from 'next-translate/useTranslation'
  
const SocialButton = ({
    children,
    label,
    href,
  }: {
    children?: ReactNode;
    label: string;
    href: string;
  }) => {
    return (
      <chakra.button
        bg={useColorModeValue('brand.black', 'brand.black')}
        color={'white'}
        rounded={'full'}
        w={8}
        h={8}
        cursor={'pointer'}
        as={'a'}
        href={href}
        display={'inline-flex'}
        alignItems={'center'}
        justifyContent={'center'}
        transition={'background 0.3s ease'}
        _hover={{
          bg: useColorModeValue('grey.600', 'grey.600'),
        }}>
        <VisuallyHidden>{label}</VisuallyHidden>
        {children}
      </chakra.button>
    );
};
  
const ListHeader = ({ children }: { children?: ReactNode }) => {
    return (
      <Text fontWeight={'700'} fontSize={'lg'} mb={2}>
        {children}
      </Text>
    );
};

type Props = {
  userProfileLink: string
}
  
const Footer: FC<PropsWithChildren<Props>> = ({
  userProfileLink = '/login'
}) => {
    const { t } = useTranslation('components')
    return (
      <Box
        bg={useColorModeValue('gray.100', 'gray.900')}
        color={useColorModeValue('gray.700', 'gray.200')}
        padding={'20px'}>
        <Container as={Stack} maxW={'6xl'} py={10}>
          <SimpleGrid
            templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }}
            spacing={8}>
            <Stack spacing={6}>
              <Box>
                <Link href='/' title="GIG Marketplace | Inicio">
                  <Image
                      alt={'GIG Logo'}
                      width={'150'}
                      height={'80'}
                      src={'/logo_beta_bn.png'}
                  />
                </Link>
              </Box>
              <Text fontSize={'xs'}>
                {t('footer.text')}
              </Text>
            </Stack>
            <Stack align={'flex-start'} fontSize='14px'>
              <ListHeader>{t('footer.listTitle1')}</ListHeader>
              <Link href={userProfileLink}>{t('footer.myProfile')}</Link>
              <Link href={'/nosotros'}>{t('footer.aboutUs')}</Link>
              <Link href={'/creadores'}>{t('footer.creators')}</Link>
              <Link href={'/familia-gig'}>{t('footer.family')}</Link>
              <Link href={'/gigcionario'}>{t('footer.glosary')}</Link>
            </Stack>
            <Stack align={'flex-start'} fontSize='14px'>
              <ListHeader>{t('footer.listTitle2')}</ListHeader>
              <Link href={'/tutoriales'}>{t('footer.tutorials')}</Link>
              <Link href={'/faq'}>{t('footer.faqs')}</Link>
              <Link href={'/GIG_terminos-y-condiciones.pdf'}>{t('footer.terms')}</Link>
              <Link href={'/aviso-de-privacidad.docx'}>{t('footer.privacy')}</Link>
              <Link href={'/contacto'}>{t('footer.contact')}</Link>
            </Stack>
            <Stack align={'flex-start'} fontSize='14px'>
              <ListHeader>{t('footer.listTitle3')}</ListHeader>
            
              <Stack direction={'column'} spacing={6} align={'flex-start'}>
                {/* <Box>
                  <SocialButton label={'Twitter'} href={'https://twitter.com/holagig'}>
                    <FaTwitter /> 
                  </SocialButton>
                  <Link ml={2} href={'https://twitter.com/holagig'}>Twitter</Link>
                </Box> */}
                <Box>
                  <SocialButton label={'YouTube'} href={'https://www.youtube.com/channel/UCD-vpRbSkFp3iJfDDbBTjeg'}>
                    <FaYoutube /> 
                  </SocialButton>
                  <Link ml={2} href={'https://www.youtube.com/channel/UCD-vpRbSkFp3iJfDDbBTjeg'}>Youtube</Link>
                </Box>
                <Box>
                  <SocialButton label={'Instagram'} href={'https://instagram.com/holagig'}>
                    <FaInstagram /> 
                  </SocialButton>
                  <Link ml={2} href={'https://instagram.com/holagig'}>Instagram</Link>
                </Box>
              </Stack>
            </Stack>
          </SimpleGrid>
          
          <Text pt={20} fontSize={'sm'} textAlign={'center'}>
            {t('footer.copyright', {year: new Date().getFullYear()})}
          </Text>
        </Container>
      </Box>
    );
  }
export default Footer