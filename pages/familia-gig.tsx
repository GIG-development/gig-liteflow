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
        <div id="familia">
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
                <Box maxW={'720px'} margin={'0 auto 40px'}>
                    <Slider>
                        <Character
                            name='NFTLali'
                            animation={NFTLali}
                            description={t('family.characters.nftlali.description')}
                            powers={[t('family.characters.nftlali.power.power1'), t('family.characters.nftlali.power.power2'), t('family.characters.nftlali.power.power3')]}
                            weaknesses={[t('family.characters.nftlali.weakness.weakness1')]}
                        />
                        <Character
                            name='Mamá Doris'
                            animation={MAMADORIS}
                            description={t('family.characters.mamadoris.description')}
                            powers={[t('family.characters.mamadoris.power.power1'), t('family.characters.mamadoris.power.power2'), t('family.characters.mamadoris.power.power3')]}
                            weaknesses={[t('family.characters.mamadoris.weakness.weakness1'), t('family.characters.mamadoris.weakness.weakness2')]}
                        />
                        <Character
                            name='Creadori Jiménez'
                            animation={CREADORI}
                            description={t('family.characters.creadori.description')}
                            powers={[t('family.characters.creadori.power.power1'), t('family.characters.creadori.power.power2'), t('family.characters.creadori.power.power3')]}
                            weaknesses={[t('family.characters.creadori.weakness.weakness1'), t('family.characters.creadori.weakness.weakness2')]}
                        />
                        <Character
                            name='Flipper'
                            animation={FLIPPER}
                            description={t('family.characters.flipper.description')}
                            description2={t('family.characters.flipper.description2')}
                            powers={[t('family.characters.flipper.power.power1'), t('family.characters.flipper.power.power2'), t('family.characters.flipper.power.power3')]}
                            weaknesses={[t('family.characters.flipper.weakness.weakness1'), t('family.characters.flipper.weakness.weakness2')]}
                        />
                        <Character
                            name='Eskeri Popi'
                            animation={ESKERI}
                            description={t('family.characters.eskeri.description')}
                            powers={[t('family.characters.eskeri.power.power1'), t('family.characters.eskeri.power.power2'), t('family.characters.eskeri.power.power3')]}
                            weaknesses={[t('family.characters.eskeri.weakness.weakness1'), t('family.characters.eskeri.weakness.weakness2'), t('family.characters.eskeri.weakness.weakness3')]}
                        />
                        <Character
                            name='Jeiter Popi'
                            animation={JEITER}
                            description={t('family.characters.jeiter.description')}
                            powers={[t('family.characters.jeiter.power.power1'), t('family.characters.jeiter.power.power2'), t('family.characters.jeiter.power.power3')]}
                            weaknesses={[t('family.characters.jeiter.weakness.weakness1'), t('family.characters.jeiter.weakness.weakness2')]}
                        />
                        <Character
                            name='URI'
                            animation={URI}
                            description={t('family.characters.uri.description')}
                            powers={[t('family.characters.uri.power.power1'), t('family.characters.uri.power.power2'), t('family.characters.uri.power.power3')]}
                            weaknesses={[t('family.characters.uri.weakness.weakness1'), t('family.characters.uri.weakness.weakness2')]}
                        />
                        <Character
                            name='Papá Che'
                            animation={PAPACHE}
                            description={t('family.characters.papache.description')}
                            powers={[t('family.characters.papache.power.power1'), t('family.characters.papache.power.power2'), t('family.characters.papache.power.power3')]}
                            weaknesses={[t('family.characters.papache.weakness.weakness1'), t('family.characters.papache.weakness.weakness2'), t('family.characters.papache.weakness.weakness3')]}
                        />
                    </Slider>
                </Box>
            </LargeLayout>
        </div>
    )
}

export default FamiliaGIG