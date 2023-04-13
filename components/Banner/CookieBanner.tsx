import {
    Flex,
    Button,
    Slide,
    Text,
    useDisclosure
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation'
import Trans from 'next-translate/Trans';
import { useCookies } from 'react-cookie';
import { FC, useEffect, useState } from 'react'
  
const CookieBanner: FC = () => { 
    const { t } = useTranslation('components')
    const { isOpen, onToggle } = useDisclosure()
    const [cookies, setCookie] = useCookies()
    const [agreed, setAgreed] = useState(false)


    useEffect(()=>{
        if (cookies['cookie-agreement'] !== undefined) setAgreed(true)
        if (!agreed) onToggle()
    },[cookies])/* eslint-disable-line react-hooks/exhaustive-deps */
    
    const handleAccept = () => {
        setCookie('cookie-agreement', new Date(), {
            secure: true,
            sameSite: true,
            path: '*',
        })
        onToggle()
    }

    if(!agreed){
        return (
            <>
            <Slide direction='bottom' in={isOpen} style={{ zIndex: 9999999 }}>
                <Flex
                px='8'
                py='4'
                color='gray.400'
                bg='white'
                rounded='md'
                shadow='md'
                border='1px solid'
                borderColor={'brand.500'}
                justify='space-between'
                align='center'
                mx={12}
                mb={6}
                >
                    <Text fontSize={12}>
                        <Trans
                            ns='components'
                            i18nKey={'cookies.text'}
                            components={[<br key='break'/>]}
                        />
                    </Text>
                    <Button onClick={handleAccept} backgroundColor={'brand.500'} color={'white'} size='sm'>
                        {t('cookies.button')}
                    </Button>
                </Flex>
            </Slide>
            </>
        )
    }
    return <></>
}
  
export default CookieBanner