import {
    Box,
    Button,
    Flex,
    Heading,
    Image,
    Stack,
    Text,
} from '@chakra-ui/react';
import Link from '../Link/Link'
import { FC, PropsWithChildren } from 'react'
import useTranslation from 'next-translate/useTranslation'

type Props = {
    title: string
    date: string
    description: string
    image: string
    link: string
}
  
const Drop: FC<PropsWithChildren<Props>> = ({
    title, date, description, image, link
}) => {
    const { t } = useTranslation('templates')
    return (
    <Stack direction={{ base: 'column', md: 'row' }} mb={12} align={'center'}>
        <Image
            alt={'Drop Image'}
            objectFit={'cover'}
            maxW={{base: 72, md: 'sm'}}
            borderRadius={'base'}
            src={image}
        />
        <Flex p={8} flex={{base: '0 0 100%', md: '0 0 60%'}} align={'center'} justify={'center'}>
            <Stack spacing={6} w={'full'}>
            <Heading
                fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                textAlign={{base: 'center', md: 'left'}}
            >
                <Text
                    as={'span'}
                    position={'relative'}
                >
                    {title}
                </Text>
                <br />{' '}
            </Heading>
            <Text
                fontSize={{ base: 'sm', lg: 'md' }}
                textAlign={{base: 'center', md: 'left'}}
                color={'gray.500'}
            >
                {description}
            </Text>
            <Box
                bg="white"
                rounded={'full'}
                border='1px solid'
                borderColor={'gray.200'}
                w={'fit-content'}
                px={2}
                py={1}
                color="brand.black"
                margin={{base: '10px auto !important', md: '10px 8px 8px 0 !important'}}
            >
                <Text fontSize={'sm'} fontWeight="700">
                    {t('home.gigDrops.launchDate')}: {date}
                </Text>
            </Box>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} align={{base: 'center', md: 'flex-start'}}>
                <Link href={link}>
                    <Button
                    rounded={'full'}
                    bg={'brand.500'}
                    color={'white'}
                    _hover={{
                        bg: 'brand.600',
                    }}>
                        {t('home.gigDrops.dropButton')}
                    </Button>
                </Link>
            </Stack>
            </Stack>
        </Flex>
    </Stack>
)}
  
export default Drop