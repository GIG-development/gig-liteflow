import {
    Stack,
    Flex,
    Box,
    Heading,
    Text,
    Button,
    IconButton,
    createIcon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    AspectRatio,
    useBreakpointValue
} from '@chakra-ui/react'
import Image from 'next/image'
import Link from '../Link/Link'
import { FC, PropsWithChildren } from 'react'
import {event} from 'nextjs-google-analytics'

type Props = {
    ctaLine_1: string
    ctaLine_2?: string
    description: string
    button_1?: string
    button_1_link?: string
    button_2?: string
    button_2_link?: string
    image: string
}
  
const SecondaryHero: FC<PropsWithChildren<Props>> = ({
    ctaLine_1,
    ctaLine_2 = '',
    description,
    button_1 = '',
    button_1_link = '',
    button_2 = '',
    button_2_link = '',
    image
}) => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    return (
    <>
        <Stack
        align={'center'}
        maxW={{base: 'full', md: '7xl'}}
        spacing={{ base: 4, md: 6 }}
        py={{ base: 4, md: 20 }}
        direction={{ base: 'column', md: 'row' }}>
            <Stack flex={1} spacing={{ base: 4, md: 6 }}>
                <Heading
                lineHeight={1.1}
                fontWeight={400}
                fontSize={{ base: '4xl', sm: '5xl', lg: '4xl' }}>
                    <Text
                        as={'span'}
                        position={'relative'}
                        color={'black'}
                        >
                        {ctaLine_1}
                    </Text>{' '}
                    {ctaLine_2!=='' && 
                        <>
                        <Text as={'span'} fontWeight={'700'} color={'black'}>
                            {ctaLine_2}
                        </Text>
                        </>
                    }
                </Heading>
                <Text color={'gray.500'}>
                {description}
                </Text>
                <Stack
                spacing={{ base: 4, sm: 6 }}
                direction={{ base: 'column', sm: 'row' }}
                >
                    { (button_1!=='' && button_1_link!=='')  && 
                    <Link href={button_1_link}>
                        <Button
                            rounded={'full'}
                            size={'lg'}
                            px={6}
                            colorScheme={'brand'}
                            bg={'brand.500'}
                            _hover={{ bg: 'brand.600' }}>
                            {button_1}
                        </Button>
                    </Link>
                    }
                    { (button_2!=='' && button_2_link!=='')  && 
                    <Link href={button_2_link}>
                        <Button
                        rounded={'full'}
                        size={'lg'}
                        px={6}
                        colorScheme={'gray'}
                        bg={'gray.400'}
                        _hover={{ bg: 'gray.600' }}>
                        {button_2}
                        </Button>
                    </Link>
                    }
                </Stack>
            </Stack>
            <Flex
                flex={1}
                justify={'center'}
                align={'center'}
                position={'relative'}
                w={'full'}>
                <Box
                    position={'relative'}
                    height={'300px'}
                    borderRadius={'base'}
                    width={'full'}
                    overflow={'hidden'}
                >
                    <IconButton
                        aria-label={'Play Button'}
                        variant={'icon'}
                        _hover={{ bg: 'transparent' }}
                        icon={<PlayIcon w={12} h={12} />}
                        size={'lg'}
                        color={'brand.500'}
                        backgroundColor={'white'}
                        borderRadius={'full'}
                        position={'absolute'}
                        zIndex='1'
                        left={'50%'}
                        top={'50%'}
                        transform={'translateX(-50%) translateY(-50%)'}
                        style={{borderRadius: '50%'}}
                        onClick={()=>{
                            onOpen()
                            event("PlayHomeVideo", {
                                category: "Interaction",
                                label: "Se reprodujo el video del Home"
                            })
                        }}
                        cursor={'pointer'}
                    />
                    <Image
                        alt={'Play Button'}
                        object-fit={'cover'}
                        layout='fill'
                        objectFit='contain'
                        sizes='(max-width: 768px) 100vw,
                                (max-width: 1200px) 40vw,
                                33vw'
                        src={image}
                        onClick={onOpen}
                    />
                </Box>
            </Flex>
        </Stack>
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true} isCentered motionPreset='scale' size={useBreakpointValue({ base: 'sm', md: 'md' })}>
            <ModalOverlay backdropFilter='blur(10px)'/>
            <ModalContent maxW={'960px'}>
                <ModalHeader></ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <AspectRatio maxW={'100%'} ratio={16/9}>
                        <video
                            src='/img/home/video.mp4' autoPlay controls={false}
                        />
                    </AspectRatio>
                </ModalBody>
                <ModalFooter>
                    <Button mr={3} onClick={onClose}>Cerrar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
    )
}
  
export default SecondaryHero
  

const PlayIcon = createIcon({
    displayName: 'PlayIcon',
    viewBox: '0 0 58 58',
    d:
        'M28.9999 0.562988C13.3196 0.562988 0.562378 13.3202 0.562378 29.0005C0.562378 44.6808 13.3196 57.438 28.9999 57.438C44.6801 57.438 57.4374 44.6808 57.4374 29.0005C57.4374 13.3202 44.6801 0.562988 28.9999 0.562988ZM39.2223 30.272L23.5749 39.7247C23.3506 39.8591 23.0946 39.9314 22.8332 39.9342C22.5717 39.9369 22.3142 39.8701 22.0871 39.7406C21.86 39.611 21.6715 39.4234 21.5408 39.1969C21.4102 38.9705 21.3421 38.7133 21.3436 38.4519V19.5491C21.3421 19.2877 21.4102 19.0305 21.5408 18.8041C21.6715 18.5776 21.86 18.3899 22.0871 18.2604C22.3142 18.1308 22.5717 18.064 22.8332 18.0668C23.0946 18.0696 23.3506 18.1419 23.5749 18.2763L39.2223 27.729C39.4404 27.8619 39.6207 28.0486 39.7458 28.2713C39.8709 28.494 39.9366 28.7451 39.9366 29.0005C39.9366 29.2559 39.8709 29.507 39.7458 29.7297C39.6207 29.9523 39.4404 30.1391 39.2223 30.272Z',
});