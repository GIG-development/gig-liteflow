import {
    Accordion,
    Box,
    Heading, 
    Stack,
    Grid,
    Image,
    Flex,
    Text
} from '@chakra-ui/react'
import Head from '../components/Head'
import AnimatedHero from '../components/Hero/AnimatedHero'
import AccordionItem from '../components/AccordionItem/AccordionItem'
import SmallLayout from '../layouts/small'
import LargeLayout from '../layouts/large'
import FullLayout from '../layouts/full'
import Banner from '../components/Banner/Block'
import FullWidthSlider from 'components/Slider/FullWidthSlider'
import { NextPage } from 'next'
import { FC, PropsWithChildren } from 'react'
import useTranslation from 'next-translate/useTranslation'
import Trans from 'next-translate/Trans'
import {event} from 'nextjs-google-analytics'
import Lottie from 'react-lottie-player';
import NFTLaliAnimation from '../public/img/animaciones/creadores_hero.json'
import CreadoriComoFunciona from '../public/img/animaciones/creadori_como-funciona.json'
import JeiterPromocion from '../public/img/animaciones/jeiter_promocion.json'
import PapacheLentes from '../public/img/animaciones/papache_lentes.json'
import Flipper from '../public/img/animaciones/FLIPPER.json'
import { EmblaOptionsType } from 'embla-carousel-react'

const Creadores: NextPage = () => {
  const { t } = useTranslation('templates')
  const typeFormButton = <>
    <button
      data-tf-popup={t('creadores.formId')}
      data-tf-iframe-props="title=Registration Form"
      data-tf-medium="snippet"
      data-tf-hide-headers
      className="btn"
      onClick={()=>{
        event("InitCreatorsForm", {
          category: "Contact",
          label: "Se inicio el formulario de creadores"
        })
      }}
    >
      {t('creadores.hero.button')}
    </button>
  </>


  const OPTIONS: EmblaOptionsType = { loop: true }

  return (
    <main id="creadores">

      <Head
          title="Creadores"
          description="Gana más por tu talento y pertenece a una gran comunidad de líderes, coleccionistas, inversionistas y creadores de la web3."
      >
          <script src="//embed.typeform.com/next/embed.js"></script>
      </Head>

      <AnimatedHero 
        bg={'/img/home/main_hero_bg.jpg'}
        ctaLine_1={t('creadores.hero.ctaLine1')}
        ctaLine_2={t('creadores.hero.ctaLine2')}
        description={t('creadores.hero.description')}
        isSpecialButton={true}
        specialButton={typeFormButton}
        animation={NFTLaliAnimation}
      />

      <FullLayout backgroundColor={'gray.100'} hasBottomCaret={true}>
        <LargeLayout>
            <Heading fontSize={{base: 'xl', md: '3xl'}} fontWeight='normal' textAlign='center' mb={6}>
                <Trans
                  ns="templates"
                  i18nKey={'creadores.content.line1'}
                  components={[
                    <Text as="span" fontWeight="bold" key="line1" />
                  ]}
                />
            </Heading>

            <Flex wrap='wrap' gap={6} my={12} align='center' justify='center'>
              <CategoryIcon icon='/img/creadores/icons/collectibles.png' text={t('creadores.content.categories.icon1')}/>
              <CategoryIcon icon='/img/creadores/icons/digital_art.png' text={t('creadores.content.categories.icon2')}/>
              <CategoryIcon icon='/img/creadores/icons/entertainment.png' text={t('creadores.content.categories.icon3')}/>
              <CategoryIcon icon='/img/creadores/icons/events.png' text={t('creadores.content.categories.icon4')}/>
              <CategoryIcon icon='/img/creadores/icons/gaming.png' text={t('creadores.content.categories.icon5')}/>
              <CategoryIcon icon='/img/creadores/icons/generative.png' text={t('creadores.content.categories.icon6')}/>
              <CategoryIcon icon='/img/creadores/icons/metaverse.png' text={t('creadores.content.categories.icon7')}/>
              <CategoryIcon icon='/img/creadores/icons/photography.png' text={t('creadores.content.categories.icon8')}/>
              <CategoryIcon icon='/img/creadores/icons/social.png' text={t('creadores.content.categories.icon9')}/>
            </Flex>
        </LargeLayout>
      </FullLayout>

      <LargeLayout>
        <Stack spacing={20} mt={20}>

          <Heading as='h2' fontSize={{base: 'xl', md: '3xl'}} lineHeight='1.2' fontWeight='normal' textAlign='center'>
            <Trans
              ns="templates"
              i18nKey={'creadores.content.line2'}
              components={[
                <br key='lineBreak'/>,
                <Text as="span" fontWeight="bold" key="line2" />
              ]}
            />
          </Heading>

          <Grid templateColumns={{base: '1fr', md: 'repeat(4, 1fr)'}} gap={4}>

            <Box textAlign={'center'}>
              <Flex textAlign={'center'} justifyContent={'center'}>
                <Image
                  alt={t('creadores.content.benefits.title')}
                  src={'/img/creadores/experiencias.png'}
                  objectFit={'cover'}
                  maxW={"180px"}
                />
              </Flex>
              <Text as={'h2'} variant="heading2">
              {t('creadores.content.benefits.benefit1')}
              </Text>
              <Text fontSize={{base: 'xs', md: 'sm'}}>
              </Text>
            </Box>

            <Box textAlign={'center'}>
              <Flex textAlign={'center'} justifyContent={'center'}>
                <Image
                  alt={t('creadores.content.benefits.title')}
                  src={'/img/creadores/accesos.png'}
                  objectFit={'cover'}
                  maxW={"180px"}
                />
              </Flex>
              <Text as={'h2'} variant="heading2">
              {t('creadores.content.benefits.benefit2')}
              </Text>
              <Text fontSize={{base: 'xs', md: 'sm'}}>
              </Text>
            </Box>

            <Box textAlign={'center'}>
              <Flex textAlign={'center'} justifyContent={'center'}>
                <Image
                  alt={t('creadores.content.benefits.title')}
                  src={'/img/creadores/descuentos.png'}
                  objectFit={'cover'}
                  maxW={"180px"}
                />
              </Flex>
              <Text as={'h2'} variant="heading2">
              {t('creadores.content.benefits.benefit3')}
              </Text>
              <Text fontSize={{base: 'xs', md: 'sm'}}>
              </Text>
            </Box>

            <Box textAlign={'center'}>
              <Flex textAlign={'center'} justifyContent={'center'}>
                <Image
                  alt={t('creadores.content.benefits.title')}
                  src={'/img/creadores/difusion.png'}
                  objectFit={'cover'}
                  maxW={"180px"}
                />
              </Flex>
              <Text as={'h2'} variant="heading2">
              {t('creadores.content.benefits.benefit4')}
              </Text>
              <Text fontSize={{base: 'xs', md: 'sm'}}>
              </Text>
            </Box>

          </Grid>
        </Stack>
      </LargeLayout>

      <FullLayout>
        
        <Heading as='h2' fontSize={{base: 'xl', md: '3xl'}} lineHeight='1.2' fontWeight='normal' textAlign='center' py={12}>
              {t('creadores.content.line3')}
        </Heading>

        <FullWidthSlider options={OPTIONS}>
          <Slide image='/_next/image?url=https%3A%2F%2Fgig.mypinata.cloud%2Fipfs%2FQmZXNEXM3USHTx9KV5cY2MxQZecNR3K3s5UeRFkPjsatHs&w=3840&q=75' alt='Cotama'/>
          <Slide image='/_next/image?url=https%3A%2F%2Fgig.mypinata.cloud%2Fipfs%2FQmXFjfuS9eMGZ9xZToHKWtFBM7pEn4AhaEsR4BDWHx7MGR&w=256&q=75' alt='Ilithya'/>
          <Slide image='/_next/image?url=https%3A%2F%2Fgig.mypinata.cloud%2Fipfs%2FQmVrkmYNpa4uWh5uo8mWcaaQc5wf8MzM76Q4KG68Sp1Lu5&w=3840&q=75' alt='Ocote'/>
          <Slide image='/_next/image?url=https%3A%2F%2Fgig.mypinata.cloud%2Fipfs%2FQmfDnkKRgYXfUAyirHwBBZsN3o5vcYxbhDeCWHuiLUH2cX&w=3840&q=75' alt='Red Sannto'/>
        </FullWidthSlider>

        <Flex mt={12} justifyContent={'center'}>
          {typeFormButton}
        </Flex>

      </FullLayout>

      <SmallLayout>
        <Heading as='h2' fontSize={{base: 'xl', md: '4xl'}} lineHeight='1.2' fontWeight={{base: 'bold', md: 'normal'}} textAlign='center' mb='6'>
              {t('creadores.content.how.title')}
        </Heading>
        <Text textAlign='center' fontSize={{base: 'sm', md: 'md'}}>
          {t('creadores.content.how.text')}
        </Text>

        {/* Paso 1 */}
        <Stack gap={6} my={20} align='center' justify='center'>
          <NumberedCircle number='1'/>
          <Flex gap={10} alignItems={'center'} flexDirection={{base: 'column', md: 'row'}}>
            <Flex textAlign={'center'} justifyContent={'center'}>
              <Lottie
                loop={true}
                animationData={PapacheLentes}
                play
                style={{ width: '260px', height: '100%' }}
              />
            </Flex>
            <Stack spacing={4}>
              <Heading as={'h3'} fontSize={{base: 'lg', md: '2xl'}} fontWeight='normal' textAlign={{base: 'center', md: 'left'}}>
                <Trans
                  ns="templates"
                  i18nKey={'creadores.content.how.steps.step1.title'}
                  components={[
                    <Text as="span" fontWeight="bold" key="line2" />
                  ]}
                />
              </Heading>
              <Text fontSize={{base: 'xs', md: 'sm'}} textAlign={{base: 'center', md: 'left'}}>
                {t('creadores.content.how.steps.step1.text')}
              </Text>
            </Stack>
          </Flex>
        </Stack>

        {/* Paso 2 */}
        <Stack gap={6} my={20} align='center' justify='center'>
          <NumberedCircle number='2'/>
          <Flex gap={10} alignItems={'center'} flexDirection={{base: 'column-reverse', md: 'row'}}>
            <Stack spacing={4}>
              <Heading as={'h3'} fontSize={{base: 'lg', md: '2xl'}} fontWeight='normal' textAlign={{base: 'center', md: 'right'}}>
                <Trans
                  ns="templates"
                  i18nKey={'creadores.content.how.steps.step2.title'}
                  components={[
                    <Text as="span" fontWeight="bold" key="line2" />
                  ]}
                />
              </Heading>
              <Text fontSize={{base: 'xs', md: 'sm'}} textAlign={{base: 'center', md: 'right'}}>
                {t('creadores.content.how.steps.step2.text')}
              </Text>
            </Stack>
            <Flex textAlign={'center'} justifyContent={'center'}>
              <Image
                alt={'Creadores'}
                src={'/img/creadores/decodificamos_ideas.png'}
                objectFit={'cover'}
                maxW={"240px"}
              />
            </Flex>
          </Flex>
        </Stack>

        {/* Paso 3 */}
        <Stack gap={6} my={20} align='center' justify='center'>
          <NumberedCircle number='3'/>
          <Flex gap={10} alignItems={'center'} flexDirection={{base: 'column', md: 'row'}}>
            <Flex textAlign={'center'} justifyContent={'center'}>
              <Lottie
                loop={true}
                animationData={CreadoriComoFunciona}
                play
                style={{ width: '340px', height: '100%', marginTop: '-40px' }}
              />
            </Flex>
            <Stack spacing={4}>
              <Heading as={'h3'} fontSize={{base: 'lg', md: '2xl'}} fontWeight='normal' textAlign={{base: 'center', md: 'left'}}>
                <Trans
                  ns="templates"
                  i18nKey={'creadores.content.how.steps.step3.title'}
                  components={[
                    <Text as="span" fontWeight="bold" key="line2" />
                  ]}
                />
              </Heading>
              <Text fontSize={{base: 'xs', md: 'sm'}} textAlign={{base: 'center', md: 'left'}}>
                {t('creadores.content.how.steps.step3.text')}
              </Text>
            </Stack>
          </Flex>
        </Stack>

        {/* Paso 4 */}
        <Stack gap={6} my={20} align='center' justify='center'>
          <NumberedCircle number='4'/>
          <Flex gap={10} alignItems={'center'} flexDirection={{base: 'column-reverse', md: 'row'}}>
            <Stack spacing={4}>
              <Heading as={'h3'} fontSize={{base: 'lg', md: '2xl'}} fontWeight='normal' textAlign={{base: 'center', md: 'right'}}>
                <Trans
                  ns="templates"
                  i18nKey={'creadores.content.how.steps.step4.title'}
                  components={[
                    <Text as="span" fontWeight="bold" key="line2" />
                  ]}
                />
              </Heading>
              <Text fontSize={{base: 'xs', md: 'sm'}} textAlign={{base: 'center', md: 'right'}}>
                {t('creadores.content.how.steps.step4.text')}
              </Text>
            </Stack>
            <Flex textAlign={'center'} justifyContent={'center'}>
              <Lottie
                loop={true}
                animationData={JeiterPromocion}
                play
                style={{ width: '240px', height: '100%', transform: 'scaleX(-1)' }}
              />
            </Flex>
          </Flex>
        </Stack>

        {/* Paso 5 */}
        <Stack gap={6} my={20} align='center' justify='center'>
          <NumberedCircle number='5'/>
          <Flex gap={10} alignItems={'center'} flexDirection={{base: 'column', md: 'row'}}>
            <Flex textAlign={'center'} justifyContent={'center'}>
              <Lottie
                loop={true}
                animationData={Flipper}
                play
                style={{ width: '260px', height: '100%' }}
              />
            </Flex>
            <Stack spacing={4}>
              <Heading as={'h3'} fontSize={{base: 'lg', md: '2xl'}} fontWeight='normal' textAlign={{base: 'center', md: 'left'}}>
                <Trans
                  ns="templates"
                  i18nKey={'creadores.content.how.steps.step5.title'}
                  components={[
                    <Text as="span" fontWeight="bold" key="line2" />
                  ]}
                />
              </Heading>
              <Text fontSize={{base: 'xs', md: 'sm'}} textAlign={{base: 'center', md: 'left'}}>
                {t('creadores.content.how.steps.step5.text')}
              </Text>
            </Stack>
          </Flex>
        </Stack>

        <Heading mt={40} as={'h3'} fontSize={{base: 'lg', md: '4xl'}} fontWeight='normal' textAlign='center'>
          <Trans
            ns="templates"
            i18nKey={'creadores.content.cta'}
            components={[
              <Text as="span" fontWeight="bold" key="line2" />
            ]}
          />
        </Heading>
        <Flex mt={6} justifyContent={'center'}>
            {typeFormButton}
        </Flex>

      </SmallLayout>

      <SmallLayout>
        <Stack spacing={6} mb={20}>
          <Heading as={'h2'} variant="heading1" pt={20}>
          {t('creadores.content.faqs.title')}
          </Heading>
          <Accordion allowMultiple>
            <AccordionItem
              title={t('creadores.content.faqs.faq1.q')}
              content={t('creadores.content.faqs.faq1.a')}
            />
            <AccordionItem
              title={t('creadores.content.faqs.faq2.q')}
              content={t('creadores.content.faqs.faq2.a')}
            />
            <AccordionItem
              title={t('creadores.content.faqs.faq3.q')}
              content={t('creadores.content.faqs.faq3.a')}
            />
            <AccordionItem
              title={t('creadores.content.faqs.faq4.q')}
              content={t('creadores.content.faqs.faq4.a')}
            />
            <AccordionItem
              title={t('creadores.content.faqs.faq5.q')}
              content={t('creadores.content.faqs.faq5.a')}
            />
          </Accordion>
        </Stack>
      </SmallLayout>
      
      <LargeLayout>
        <Banner
          cta={t('home.banner.title')}
          description={t('home.banner.text')}
          button1={t('home.banner.button1')}
          button2={t('home.banner.button2')}
        />
      </LargeLayout>
      
    </main>
  )
}
export default Creadores


type NumberedCircleProps = {
  number: string
}
const NumberedCircle : FC<PropsWithChildren<NumberedCircleProps>> = ({
  number
}) => {
  return (
    <Flex w={20} h={20} border='2px solid' rounded='full' align='center' justify='center' p={4}>
      <Heading variant='title'>{number}</Heading>
    </Flex>
  )
}

type CategoryIconProps = {
  icon: string
  iconSize?: string
  text: string 
}
const CategoryIcon : FC<PropsWithChildren<CategoryIconProps>> = ({
  icon, text, iconSize
}) => {
  return (
    <Flex w={28} alignItems='center' flexDirection='column'>
      <Image alt="Comunidad" src={icon} w={iconSize ? iconSize : 16}/>
      <Text fontSize={{base: 'xs', md: 'sm'}}>{text}</Text>
    </Flex>
  )
}


type SlideProps = {
  image: string
  alt?: string
}
const Slide : FC<PropsWithChildren<SlideProps>> = ({
  image, alt
}) => {
  return (
    <Box className="slider__slide">
      <Image
        className="slider__slide__img"
        src={image}
        alt={alt ? alt : ''}
      />
    </Box>
  )
}