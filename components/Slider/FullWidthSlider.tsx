import { Box } from '@chakra-ui/react'
import { PropsWithChildren, FC, useEffect } from 'react'
import useEmblaCarousel, { EmblaOptionsType } from 'embla-carousel-react'

type PropType = {
  options?: EmblaOptionsType
}

const FullWidthSlider: FC<PropsWithChildren<PropType>> = ({options, children}) => {
  const [emblaRef, embla] = useEmblaCarousel(options)

  useEffect(()=>{
    if(embla?.canScrollNext){
      setInterval(()=>{
        embla.scrollNext()
      },2000)
    }
  },[embla])

  return (
    <Box className="slider">
      <Box className="slider__viewport" ref={emblaRef}>
        <Box className="slider__container">
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default FullWidthSlider
