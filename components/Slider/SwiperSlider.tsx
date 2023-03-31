import {
  Box,
  Button,
  Flex,
  Heading,
  Text
} from '@chakra-ui/react'
import { FC, PropsWithChildren, useMemo } from 'react'
import {
  convertSaleFull,
} from '../../convert'
import useTranslation from 'next-translate/useTranslation'
import "swiper/css"
import "swiper/css/effect-cards"
import "swiper/css/autoplay"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCards, Autoplay } from "swiper"
import Price from '../Price/Price'
import Link from '../Link/Link'
import environment from 'environment'

type Props = {
  items: any
}

const Hero: FC<PropsWithChildren<Props>> = ({
  items
}) => {
  const { t } = useTranslation('components')
  const featuredAssets = useMemo(
    () =>
      items?.map((asset: any) => {
        const sales = asset?.sales?.nodes.map(convertSaleFull)
        const bestBid = asset.auctions.nodes[0]?.bestBid?.nodes[0]
        return (
          <SwiperSlide key={asset.id}>
            <Box
              minH={['300px','420px']}
              backgroundImage={`url(${asset.image})`}
              backgroundSize='cover'
              backgroundRepeat='no-repeat'
              position='relative'
            >
              <Flex justifyContent='space-between' position='absolute' bottom='0' w='full' p={[4,6]} backgroundColor='rgba(0,0,0,0.2)'>
                <Flex flexDir='column'>
                  <Heading variant='heading2' color='white'>{asset.name}</Heading>
                  <Text variant='text-sm' color='white'>
                    {sales.length > 0 ?
                      <Price
                        amount={sales[0]?.unitPrice}
                        currency={sales[0]?.currency}
                      />
                      :
                    bestBid ?
                      <Price
                        amount={bestBid.unitPrice}
                        currency={bestBid.currency}
                      />
                    :
                      <Text>{t('swiperOpenToOffer')}</Text>
                    }
                  </Text>
                </Flex>
                <Link as={Button} href={`${environment.BASE_URL}/tokens/${asset.id}`} color='white'>
                  {t('swiperBuyButton')}
                </Link>
              </Flex>
            </Box>
          </SwiperSlide>
        )
      }),
    [items],
  )

  return (
    <>
      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards, Autoplay]}
        className="mySwiper"
        autoplay
      >
        {featuredAssets}
      </Swiper>
    </>
  );
}

export default Hero