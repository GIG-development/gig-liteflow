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
import LargeLayout from '../layouts/large'
import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Lottie from 'react-lottie-player';
import NFTLaliAnimation from '../public/img/animaciones/creadores_hero.json'
import CreadoriComoFunciona from '../public/img/animaciones/creadori_como-funciona.json'
import JeiterPromocion from '../public/img/animaciones/jeiter_promocion.json'
import PapacheLentes from '../public/img/animaciones/papache_lentes.json'

const Creadores: NextPage = () => {
  const { t } = useTranslation('templates')
  const typeFormButton = <>
    <button data-tf-popup="eyQRCt11" data-tf-hide-headers data-tf-iframe-props="title=Registration Form" data-tf-medium="snippet" className="btn">
      {t('creadores.hero.button')}
    </button>
  </>

  return (
    <div id="creadores">
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
      <LargeLayout>
        <Stack spacing={6} my={20}>

        <Grid templateColumns={{base: '1fr', md: 'repeat(4, 1fr)'}} gap={4} mb={20}>
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

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems={'center'}>
              <Stack spacing={4}>
                  <Heading as={'h3'} variant={'subtitle'}>Decodificamos juntos tus ideas</Heading>
                  <Text color={'gray.500'} fontSize={{base: 'sm', md: 'md'}}>
                  No necesitas ser experto, estamos contigo desde la conceptualización hasta la promoción de tus NFTs. Solo trae tus ganas de entrar al espacio cripto en una comunidad de creativos geniales.
                  </Text>
              </Stack>
              <Flex textAlign={'center'} justifyContent={'center'}>
                  <Image
                      alt={'Creadores'}
                      src={'/img/creadores/decodificamos_ideas.png'}
                      objectFit={'cover'}
                      maxW={"220px"}
                  />
              </Flex>
          </SimpleGrid>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} alignItems={'center'}>
              <Flex textAlign={'center'} justifyContent={'center'}>
                <Lottie
                    loop={true}
                    animationData={JeiterPromocion}
                    play
                    style={{ width: '280px', height: '100%' }}
                />
              </Flex>
              <Stack spacing={4}>
                  <Heading as={'h3'} variant={'subtitle'}>Promoción en medios masivos</Heading>
                  <Text color={'gray.500'} fontSize={{base: 'sm', md: 'md'}}>
                  Pon a tus obras maestras a recorrer los mundos y sé parte de esta evolución tecnológica.
                  </Text>
                  <Heading as={'h2'} variant={'subtitle'}>Una interfaz ganadora</Heading>
                  <Text color={'gray.500'} fontSize={{base: 'sm', md: 'md'}}>
                    Tu creatividad llegará a los ojos adecuados. Sube y vende tus proyectos en minutos y fomenta con nosotros la vida creativa en cualquier lugar del mundo. 
                  </Text>
              </Stack>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} pt={12} alignItems={'center'}>
            <Stack spacing={4}>
                <Heading as={'h3'} variant={'subtitle'}>Simplificamos lo complejo</Heading>
                <Text color={'gray.500'} fontSize={{base: 'sm', md: 'md'}}>
                Para que te dediques a lo tuyo. Subir NFTs será más fácil que nunca.
                <br/><br/>
                Usamos las bondades de la tecnología a favor de la comunidad mediante la tokenización de los activos, es decir, proyectos, obras físicas, digitales o hasta una idea ganadora la convertimos en token con el que es posible obtener beneficios como participar por premios y exclusivas hasta ingresos y regalías de por vida por la subasta y venta de tus NFTs.
                </Text>
            </Stack>
            <Flex textAlign={'center'} justifyContent={'center'}>
              <Lottie
                  loop={true}
                  animationData={PapacheLentes}
                  play
                  style={{ width: '280px', height: '100%' }}
              />
            </Flex>
          </SimpleGrid>
        </Stack>
          
      </LargeLayout>

      <Stack spacing={12} mb={10} backgroundColor={'gray.100'} w={'full'} id='creators__section-full'>
        <LargeLayout>
            <Heading color={'gray.500'} fontSize={{base: 'xl', md: 'xl'}} textAlign='center' mb={6}>
                Somos una plataforma digital que reúne a las grandes mentes de la industria creativa en la Web 3.0.
            </Heading>

            <Grid templateColumns={{base: 'repeat(3, 1fr)', md: 'repeat(9, 1fr)'}} gap={4} my={10}>
              <Flex alignItems='center' flexDirection='column'>
                <Image src='/img/creadores/icons/collectibles.png' w={20}/>
                <Text fontSize={{base: 'xs', md: 'sm'}}>Coleccionables</Text>
              </Flex>
              <Flex alignItems='center' flexDirection='column'>
                <Image src='/img/creadores/icons/digital_art.png' w={20}/>
                <Text fontSize={{base: 'xs', md: 'sm'}}>Arte digital</Text>
              </Flex>
              <Flex alignItems='center' flexDirection='column'>
                <Image src='/img/creadores/icons/entertainment.png' w={20}/>
                <Text fontSize={{base: 'xs', md: 'sm'}}>Entretenimiento</Text>
              </Flex>
              <Flex alignItems='center' flexDirection='column'>
                <Image src='/img/creadores/icons/events.png' w={20}/>
                <Text fontSize={{base: 'xs', md: 'sm'}}>Eventos</Text>
              </Flex>
              <Flex alignItems='center' flexDirection='column'>
                <Image src='/img/creadores/icons/gaming.png' w={20}/>
                <Text fontSize={{base: 'xs', md: 'sm'}}>Gaming</Text>
              </Flex>
              <Flex alignItems='center' flexDirection='column'>
                <Image src='/img/creadores/icons/generative.png' w={20}/>
                <Text fontSize={{base: 'xs', md: 'sm'}}>Arte generativo</Text>
              </Flex>
              <Flex alignItems='center' flexDirection='column'>
                <Image src='/img/creadores/icons/metaverse.png' w={20}/>
                <Text fontSize={{base: 'xs', md: 'sm'}}>Metaverso</Text>
              </Flex>
              <Flex alignItems='center' flexDirection='column'>
                <Image src='/img/creadores/icons/photography.png' w={20}/>
                <Text fontSize={{base: 'xs', md: 'sm'}}>Fotografía</Text>
              </Flex>
              <Flex alignItems='center' flexDirection='column'>
                <Image src='/img/creadores/icons/social.png' w={20}/>
                <Text fontSize={{base: 'xs', md: 'sm'}}>Comunidad</Text>
              </Flex>
            </Grid>

            <Heading color={'gray.800'} fontWeight={700} fontSize={{base: 'xl', md: 'xl'}} textAlign='center' mb={6}>
                Codéate con artistas prestigiosos, coleccionistas, curadores reconocidos y otras mentes creativas como tú
            </Heading>

            <Flex justifyContent={'center'}>
              {typeFormButton}
            </Flex>
        </LargeLayout>
      </Stack>

      <LargeLayout>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} pt={12} alignItems={'center'}>
            <Flex textAlign={'center'} justifyContent={'center'}>
              <Lottie
                  loop={true}
                  animationData={CreadoriComoFunciona}
                  play
                  style={{ width: '380px', height: '100%' }}
              />
            </Flex>
            <Stack spacing={4}>
                <Heading as={'h3'} variant={'subtitle'}>¿Cómo funciona?</Heading>
                <Text color={'gray.500'} fontSize={{base: 'sm', md: 'md'}}>
                En GIG todos juegan. La única regla es verificar tu perfil como creativo, ya que nos caracterizamos por cuidar la calidad del material que habita en la plataforma garantizando la seguridad en las transacciones dentro de la plataforma, así como el desarrollo de una sociedad sostenible que busca la vida creativa en cualquier parte del mundo. Para verificarte, solo requieres mandarnos tu material y obras maestras para corroborar que son de tu autoría pues estarás entrando a una comunidad segura y sostenible.
                Si no tienes experiencia en este campo igual eres bienvenido, te apoyamos en cada fase y con lo que necesites para empezar tu camino digital.
                </Text>
            </Stack>
        </SimpleGrid>

        <Stack spacing={6} my={20}>
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
        
        <Heading as={'h2'} variant="heading1" pt={4} textAlign={'center'}>
          Somos GIG.
        </Heading>
        <Heading as={'h2'} variant="heading2" textAlign={'center'}>
          Empoderando mentes creativas.
        </Heading>
        
      </LargeLayout>
    </div>
  )
}

export default Creadores