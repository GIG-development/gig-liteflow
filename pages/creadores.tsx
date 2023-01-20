import {
    Accordion,
    Box,
    Heading, 
    Stack,
    Grid,
    SimpleGrid,
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
    <button data-tf-popup="eyQRCt11" data-tf-hide-headers data-tf-iframe-props="title=Registration Form" data-tf-medium="snippet" className="btn">
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
                Somos una <strong>plataforma digital</strong> que reúne a las grandes mentes de la industria creativa en la <strong>Web 3.0</strong>
            </Heading>

            <Flex wrap='wrap' gap={6} my={12} align='center' justify='center'>
              <CategoryIcon icon='/img/creadores/icons/collectibles.png' text='Coleccionables'/>
              <CategoryIcon icon='/img/creadores/icons/digital_art.png' text='Arte digital'/>
              <CategoryIcon icon='/img/creadores/icons/entertainment.png' text='Entretenimiento'/>
              <CategoryIcon icon='/img/creadores/icons/events.png' text='Eventos'/>
              <CategoryIcon icon='/img/creadores/icons/gaming.png' text='Gaming'/>
              <CategoryIcon icon='/img/creadores/icons/generative.png' text='Arte generativo'/>
              <CategoryIcon icon='/img/creadores/icons/metaverse.png' text='Metaverso'/>
              <CategoryIcon icon='/img/creadores/icons/photography.png' text='Fotografía'/>
              <CategoryIcon icon='/img/creadores/icons/social.png' text='Comunidad'/>
            </Flex>
        </LargeLayout>
      </FullLayout>

      <LargeLayout>
        <Stack spacing={20} mt={20}>

          <Heading as='h2' fontSize={{base: 'xl', md: '3xl'}} lineHeight='1.2' fontWeight='normal' textAlign='center'>Ser parte de la comunidad<br/>te da <strong>beneficios</strong>.</Heading>

          <Grid templateColumns={{base: '1fr', md: 'repeat(4, 1fr)'}} gap={4}>

            <Box textAlign={'center'}>
              <Flex textAlign={'center'} justifyContent={'center'}>
                <Image
                  alt={'Beneficios'}
                  src={'/img/creadores/experiencias.png'}
                  objectFit={'cover'}
                  maxW={"180px"}
                />
              </Flex>
              <Text as={'h2'} variant="heading2">
              Experiencias inmersivas
              </Text>
              <Text fontSize={{base: 'xs', md: 'sm'}}>
              </Text>
            </Box>

            <Box textAlign={'center'}>
              <Flex textAlign={'center'} justifyContent={'center'}>
                <Image
                  alt={'Beneficios'}
                  src={'/img/creadores/accesos.png'}
                  objectFit={'cover'}
                  maxW={"180px"}
                />
              </Flex>
              <Text as={'h2'} variant="heading2">
              Accesos preferenciales 
              </Text>
              <Text fontSize={{base: 'xs', md: 'sm'}}>
              </Text>
            </Box>

            <Box textAlign={'center'}>
              <Flex textAlign={'center'} justifyContent={'center'}>
                <Image
                  alt={'Beneficios'}
                  src={'/img/creadores/descuentos.png'}
                  objectFit={'cover'}
                  maxW={"180px"}
                />
              </Flex>
              <Text as={'h2'} variant="heading2">
              Descuentos a exposiciones
              </Text>
              <Text fontSize={{base: 'xs', md: 'sm'}}>
              </Text>
            </Box>

            <Box textAlign={'center'}>
              <Flex textAlign={'center'} justifyContent={'center'}>
                <Image
                  alt={'Beneficios'}
                  src={'/img/creadores/difusion.png'}
                  objectFit={'cover'}
                  maxW={"180px"}
                />
              </Flex>
              <Text as={'h2'} variant="heading2">
              Promo en medios masivos y más
              </Text>
              <Text fontSize={{base: 'xs', md: 'sm'}}>
              </Text>
            </Box>

          </Grid>
        </Stack>
      </LargeLayout>

      <FullLayout>
        
        <Heading as='h2' fontSize={{base: 'xl', md: '3xl'}} lineHeight='1.2' fontWeight='normal' textAlign='center' py={12}>
            Codéate con artistas prestigiosos, curadores y coleccionistas reconocidos.
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
          ¿Cómo funciona?
        </Heading>
        <Text textAlign='center' fontSize={{base: 'sm', md: 'md'}}>
          Si quieres vender física o digitalmente alguna de tus obras artísticas, te ayudamos a crear su NFT, publicarlo y promocionarlo. Recuerda que también puedes comprar cuantas obras quieras de tus artistas favoritos.
        </Text>

        {/* Paso 1 */}
        <Stack gap={6} my={20} align='center' justify='center'>
          <NumberedCircle number='1'/>
          <Flex gap={10} alignItems={'center'} flexDirection={{base: 'column-reverse', md: 'row'}}>
            <Flex textAlign={'center'} justifyContent={'center'}>
              <Lottie
                loop={true}
                animationData={PapacheLentes}
                play
                style={{ width: '260px', height: '100%' }}
              />
            </Flex>
            <Stack spacing={4}>
              <Heading as={'h3'} fontSize={{base: 'lg', md: '2xl'}} fontWeight='normal'>
                Primero vamos a <strong>conocernos</strong>
              </Heading>
              <Text fontSize={{base: 'xs', md: 'sm'}}>
                El primer paso es verificar tu perfil como creativo, de esta manera garantizamos la calidad del material que habita en la plataforma y la seguridad en las transacciones, así como el desarrollo de una comunidad de creativos de alto nivel. Para verificarte, solo requieres llenar el formulario en esta página para corroborar tu identidad.
                {/* Si no tienes experiencia en este campo igual eres bienvenido, te apoyamos en cada fase y con lo que necesites para empezar tu camino digital. */}
              </Text>
            </Stack>
          </Flex>
        </Stack>

        {/* Paso 2 */}
        <Stack gap={6} my={20} align='center' justify='center'>
          <NumberedCircle number='2'/>
          <Flex gap={10} alignItems={'center'} flexDirection={{base: 'column', md: 'row'}}>
            <Stack spacing={4}>
              <Heading as={'h3'} fontSize={{base: 'lg', md: '2xl'}} fontWeight='normal'>
                Decodificamos juntos <strong>tus brillantes ideas</strong>
              </Heading>
              <Text fontSize={{base: 'xs', md: 'sm'}}>
                No necesitas ser experto, estamos contigo desde la conceptualización hasta la promoción de tus NFTs. Solo trae tus ganas de entrar al espacio cripto en una comunidad de creativos geniales.
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
          <Flex gap={10} alignItems={'center'} flexDirection={{base: 'column-reverse', md: 'row'}}>
            <Flex textAlign={'center'} justifyContent={'center'}>
              <Lottie
                loop={true}
                animationData={CreadoriComoFunciona}
                play
                style={{ width: '340px', height: '100%', marginTop: '-40px' }}
              />
            </Flex>
            <Stack spacing={4}>
              <Heading as={'h3'} fontSize={{base: 'lg', md: '2xl'}} fontWeight='normal'>
                <strong>Simplificamos</strong> lo complejo
              </Heading>
              <Text fontSize={{base: 'xs', md: 'sm'}}>
                Usamos las bondades de la tecnología a favor de la comunidad mediante la tokenización de tus creaciones o proyectos, ya sean obras físicas o digitales, las convertimos en tokens con los que es posible obtener beneficios y regalías de por vida por la subasta y venta de tus NFTs.
              </Text>
            </Stack>
          </Flex>
        </Stack>

        {/* Paso 4 */}
        <Stack gap={6} my={20} align='center' justify='center'>
          <NumberedCircle number='4'/>
          <Flex gap={10} alignItems={'center'} flexDirection={{base: 'column', md: 'row'}}>
            <Stack spacing={4}>
              <Heading as={'h3'} fontSize={{base: 'lg', md: '2xl'}} fontWeight='normal'>
                Promocionamos tus creaciones <strong>física y digitalmente</strong>
              </Heading>
              <Text fontSize={{base: 'xs', md: 'sm'}}>
                Tu creatividad llegará a los ojos adecuados a través de nuestras alianzas estratégicas con medios nacionales e internacionales. Pon a tus obras maestras a recorrer el mundo y sé parte de esta (r)evolución tecnológica.
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
          <Flex gap={10} alignItems={'center'} flexDirection={{base: 'column-reverse', md: 'row'}}>
            <Flex textAlign={'center'} justifyContent={'center'}>
              <Lottie
                loop={true}
                animationData={Flipper}
                play
                style={{ width: '260px', height: '100%' }}
              />
            </Flex>
            <Stack spacing={4}>
              <Heading as={'h3'} fontSize={{base: 'lg', md: '2xl'}} fontWeight='normal'>
                Vive de lo que te <strong>apasiona</strong>
              </Heading>
              <Text fontSize={{base: 'xs', md: 'sm'}}>
                Vende tus proyectos en minutos y vive tu mejor vida creativa desde cualquier lugar del mundo.
              </Text>
            </Stack>
          </Flex>
        </Stack>

        <Heading mt={40} as={'h3'} fontSize={{base: 'lg', md: '4xl'}} fontWeight='normal' textAlign='center'>
          ¿Qué esperas para formar parte de nuestra <strong>comunidad de creativos</strong>?
        </Heading>
        <Flex mt={6} justifyContent={'center'}>
            {typeFormButton}
        </Flex>

      </SmallLayout>

      <SmallLayout>
        <Stack spacing={6} mb={20}>
          <Heading as={'h2'} variant="heading1" pt={20}>
          Preguntas frecuentes
          </Heading>
          <Accordion allowMultiple>
            <AccordionItem
              title={'¿Necesito saber de cripto antes de empezar?'}
              content={'Para nada en lo absoluto. Nosotros te ayudamos a conceptualizar tus ideas.'}
            />
            <AccordionItem
              title={'¿Para quién es?'}
              content={'Para nuevos talentos, artistas, coleccionistas, inversores en Latinoamérica y todas las almas creativas que buscan un futuro mejor.'}
            />
            <AccordionItem
              title={'¿Tengo que ser Latin@ para unirme?'}
              content={'Sabemos que en Latinoamérica hay un mundo de creatividad sin descubrir, por eso iniciamos en México y Latam, pero no somos excluyentes. Si tienes un gran proyecto y quieres ser parte de esta evolución, más que bienvenidx.'}
            />
            <AccordionItem
              title={'¿Mi proyecto vivirá solamente en GIG?'}
              content={'Si subiste tu proyecto a través de GIG, éste aparecerá bajo contrato de GIG, sin embargo cualquier Marketplace que soporte Ethereum puede listar tus NFTs.'}
            />
            <AccordionItem
              title={'¿Qué tipo de proyectos puedo subir?'}
              content={'Prácticamente todos los formatos son bienvenidos: Arte digital, música, esculturas, videos, libros, videos. Coleccionables digitales como objetos, tarjetas, skins, avatares. Videojuegos y lo relativo a ellos. Certificados y títulos. Objetos físicos. Tickets o entradas a eventos. (Nos reservamos el derecho de admitir proyectos que pudieran ir en perjuicio de alguna persona o institución.)'}
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