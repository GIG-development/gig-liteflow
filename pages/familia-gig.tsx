import {
  Box,
  Text,
  Heading, 
  Stack,
  useBreakpointValue
} from '@chakra-ui/react'
import Head from '../components/Head'
import Slider from 'components/Slider/Slider'
import Character from 'components/Character/Character'
import LargeLayout from '../layouts/large'
import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import NFTLali from '../public/img/animaciones/NFTLALI.json'
import MAMADORIS from '../public/img/animaciones/MAMADORIS.json'
import FLIPPER from '../public/img/animaciones/FLIPPER.json'
import CREADORI from '../public/img/animaciones/CREADORI.json'
import PAPACHE from '../public/img/animaciones/PAPACHE.json'
import URI from '../public/img/animaciones/URI.json'
import JEITER from '../public/img/animaciones/JEITER.json'
import ESKERI from '../public/img/animaciones/ESKERI.json'

const FamiliaGIG: NextPage = () => {
    const { t } = useTranslation('templates')
    return (
        <main id="familia">
            <LargeLayout>
                <Head
                    title="Familia GIG"
                    description="Únete a la comunidad de creativos marketplace no. 1 de Latinoamérica en donde puedes crear NFTs seguro y fácil."
                />
                <Stack spacing={6} mb={20}>
                    <Heading as={'h1'} variant="title">
                        {t('family.title')}
                    </Heading>
                    <Text fontSize={useBreakpointValue({ base: 'sm', md: 'md' })}>
                        {t('family.line1')}
                    </Text>
                    <Text fontSize={useBreakpointValue({ base: 'sm', md: 'md' })}>
                        {t('family.line2')}
                    </Text>
                </Stack>
                <Box margin={'0 auto 34px'}>
                    <Slider>
                        <Character
                            name='NFTLali'
                            animation={NFTLali}
                            description={t('family.characters.nftlali.description')}
                            powers={[
                                {icon: '/img/familia/icons/inspiracion.png', power: t('family.characters.nftlali.power.power1')},
                                {icon: '/img/familia/icons/intencion.png', power: t('family.characters.nftlali.power.power2')},
                                {icon: '/img/familia/icons/creatividad.png', power: t('family.characters.nftlali.power.power3')}
                            ]}
                            weaknesses={[
                                {icon: '/img/familia/icons/ninguna.png', weakness: t('family.characters.nftlali.weakness.weakness1')}
                            ]}
                        />
                        <Character
                            name='Mamá Doris'
                            animation={MAMADORIS}
                            description={t('family.characters.mamadoris.description')}
                            powers={[
                                {icon: '/img/familia/icons/vista.png', power: t('family.characters.mamadoris.power.power1')},
                                {icon: '/img/familia/icons/zipper.png', power: t('family.characters.mamadoris.power.power2')},
                                {icon: '/img/familia/icons/pasevip.png', power: t('family.characters.mamadoris.power.power3')}
                            ]}
                            weaknesses={[
                                {icon: '/img/familia/icons/torbellino.png', weakness: t('family.characters.mamadoris.weakness.weakness1')},
                                {icon: '/img/familia/icons/egoitis.png', weakness: t('family.characters.mamadoris.weakness.weakness2')},
                            ]}
                        />
                        <Character
                            name='Creadori Maximus'
                            animation={CREADORI}
                            description={t('family.characters.creadori.description')}
                            powers={[
                                {icon: '/img/familia/icons/artattack.png', power: t('family.characters.creadori.power.power1')},
                                {icon: '/img/familia/icons/magia.png', power: t('family.characters.creadori.power.power2')},
                                {icon: '/img/familia/icons/onda.png', power: t('family.characters.creadori.power.power3')}
                            ]}
                            weaknesses={[
                                {icon: '/img/familia/icons/puno.png', weakness: t('family.characters.creadori.weakness.weakness1')},
                                {icon: '/img/familia/icons/locura.png', weakness: t('family.characters.creadori.weakness.weakness2')},
                            ]}
                        />
                        <Character
                            name='Flipper'
                            animation={FLIPPER}
                            description={t('family.characters.flipper.description')}
                            description2={t('family.characters.flipper.description2')}
                            powers={[
                                {icon: '/img/familia/icons/cartera.png', power: t('family.characters.flipper.power.power1')},
                                {icon: '/img/familia/icons/olfato.png', power: t('family.characters.flipper.power.power2')},
                                {icon: '/img/familia/icons/colmillo.png', power: t('family.characters.flipper.power.power3')}
                            ]}
                            weaknesses={[
                                {icon: '/img/familia/icons/impulsividad.png', weakness: t('family.characters.flipper.weakness.weakness1')},
                                {icon: '/img/familia/icons/orejas.png', weakness: t('family.characters.flipper.weakness.weakness2')},
                            ]}
                        />
                        <Character
                            name='Eskeri Popi'
                            animation={ESKERI}
                            description={t('family.characters.eskeri.description')}
                            powers={[
                                {icon: '/img/familia/icons/incertidumbre.png', power: t('family.characters.eskeri.power.power1')},
                                {icon: '/img/familia/icons/lagrimas.png', power: t('family.characters.eskeri.power.power2')},
                                {icon: '/img/familia/icons/soledad.png', power: t('family.characters.eskeri.power.power3')}
                            ]}
                            weaknesses={[
                                {icon: '/img/familia/icons/fe.png', weakness: t('family.characters.eskeri.weakness.weakness1')},
                                {icon: '/img/familia/icons/onda.png', weakness: t('family.characters.eskeri.weakness.weakness2')},
                                {icon: '/img/familia/icons/puno.png', weakness: t('family.characters.eskeri.weakness.weakness3')},
                            ]}
                        />
                        <Character
                            name='Jeiter Popi'
                            animation={JEITER}
                            description={t('family.characters.jeiter.description')}
                            powers={[
                                {icon: '/img/familia/icons/odio.png', power: t('family.characters.jeiter.power.power1')},
                                {icon: '/img/familia/icons/meteorito.png', power: t('family.characters.jeiter.power.power2')},
                                {icon: '/img/familia/icons/puno.png', power: t('family.characters.jeiter.power.power3')}
                            ]}
                            weaknesses={[
                                {icon: '/img/familia/icons/ceguera.png', weakness: t('family.characters.jeiter.weakness.weakness1')},
                                {icon: '/img/familia/icons/razonamiento.png', weakness: t('family.characters.jeiter.weakness.weakness2')},
                            ]}
                        />
                        <Character
                            name='URI'
                            animation={URI}
                            description={t('family.characters.uri.description')}
                            powers={[
                                {icon: '/img/familia/icons/antimateria.png', power: t('family.characters.uri.power.power1')},
                                {icon: '/img/familia/icons/teletransportacion.png', power: t('family.characters.uri.power.power2')},
                                {icon: '/img/familia/icons/grillo.png', power: t('family.characters.uri.power.power3')}
                            ]}
                            weaknesses={[
                                {icon: '/img/familia/icons/pisoton.png', weakness: t('family.characters.uri.weakness.weakness1')},
                                {icon: '/img/familia/icons/sobrecarga.png', weakness: t('family.characters.uri.weakness.weakness2')},
                            ]}
                        />
                        <Character
                            name='Papá Che'
                            animation={PAPACHE}
                            description={t('family.characters.papache.description')}
                            powers={[
                                {icon: '/img/familia/icons/pasevip.png', power: t('family.characters.papache.power.power1')},
                                {icon: '/img/familia/icons/inspiracion.png', power: t('family.characters.papache.power.power2')},
                                {icon: '/img/familia/icons/razonamiento.png', power: t('family.characters.papache.power.power3')}
                            ]}
                            weaknesses={[
                                {icon: '/img/familia/icons/onda.png', weakness: t('family.characters.papache.weakness.weakness1')},
                                {icon: '/img/familia/icons/locura.png', weakness: t('family.characters.papache.weakness.weakness2')},
                                {icon: '/img/familia/icons/cartera.png', weakness: t('family.characters.papache.weakness.weakness3')},
                            ]}
                        />
                    </Slider>
                </Box>
            </LargeLayout>
        </main>
    )
}

export default FamiliaGIG