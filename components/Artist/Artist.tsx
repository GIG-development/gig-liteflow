import {
    Box,
    Button,
    Heading,
    Text,
    Flex,
    useBreakpointValue
} from '@chakra-ui/react';
import Image from 'next/image';
import Link from '../Link/Link'
import { FC, PropsWithChildren } from 'react'
import useTranslation from 'next-translate/useTranslation'

type Props = {
    name: string
    handle: string
    description: string
    tags: string[]
    image: string
    link: string
}
  
const Artist: FC<PropsWithChildren<Props>> = ({
    name,
    handle,
    description,
    tags,
    image,
    link
}) => {
    const { t } = useTranslation('templates')
    return (
        <Flex
            className="slider__slide"
            grow={0}
            shrink={0}
            basis={{
                base: '100%',
                sm: '50%',
                md: '300px',
                lg: '25%',
            }}
            p="10px"
        >
            <Box
                minW={{base: '100%', md: '280px'}}
                maxW={{base: '100%', md: '280px'}}
                rounded={'base'}
                my={2}
                overflow={'hidden'}
                bg="white"
                border='1px solid'
                borderColor='gray.200'
                >
                <Box h={useBreakpointValue({base: '280px', md: '280px'})} overflow='hidden'>
                    <Link href={link}>
                        <Image 
                            src={image}
                            width='280px'
                            height='280px'
                            layout='responsive'
                            objectFit='cover'
                            alt='Artist Image'
                        />
                    </Link>
                </Box>
                <Box p={6}>
                    <Heading color={'black'} fontSize={'lg'} noOfLines={1}>
                        <Link href={link}>
                            {name}
                        </Link>
                    </Heading>
                    <Heading color={'black'} fontSize={'xs'} noOfLines={1}>
                        {handle}
                    </Heading>
                    <Text color={'gray.500'} fontSize={'xs'} noOfLines={2} mt={2} h={'60px'}>
                        {description}
                    </Text>

                    <Flex alignContent='space-between' direction='column' mt={2}>
                        <Box mt={2} h={'72px'}>
                            {tags.map((tag)=>{
                                return (
                                    <Box
                                        key={tag}
                                        bg="white"
                                        rounded={'full'}
                                        border='1px solid #E5E7Eb'
                                        display={'inline-block'}
                                        px={2}
                                        py={1}
                                        color="brand.black"
                                        mr={2}
                                        mb={2}>
                                        <Text fontSize={'10'} fontWeight="medium">
                                            {tag}
                                        </Text>
                                    </Box>
                                )
                            })}
                        </Box>
                        <Link href={link}>
                            <Button w={'full'}>{t('home.featuredArtists.artistProfileButton')}</Button>
                        </Link>
                    </Flex>
                </Box>
            </Box>
        </Flex>
    )
}
  
export default Artist