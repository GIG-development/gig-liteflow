import { Box, Button, Flex, Heading, Icon, Link } from '@chakra-ui/react'
import { VFC } from 'react'
import { QRCodeCanvas } from "qrcode.react";
import Image from '../../Image/Image'
import AccountImage from '../../Wallet/Image'
import { HiBadgeCheck } from '@react-icons/all-files/hi/HiBadgeCheck'
import { HiOutlineGlobeAlt } from '@react-icons/all-files/hi/HiOutlineGlobeAlt'
import { SiInstagram } from '@react-icons/all-files/si/SiInstagram'
import { SiTwitter } from '@react-icons/all-files/si/SiTwitter'
import useTranslation from 'next-translate/useTranslation'
import WalletAddress from '../../Wallet/Address'
import environment from 'environment';

type Props = {
  address: string
  cover: string | null | undefined
  image: string | null | undefined
  name: string | null | undefined
  description: string | null | undefined
  verified: boolean
  twitter: string | null | undefined
  instagram: string | null | undefined
  website: string | null | undefined
}

const UserProfileBanner: VFC<Props> = ({ cover, image, address, name, description, verified, twitter, instagram, website }) => {
  if (!address) throw new Error('account is falsy')
  const { t } = useTranslation('components')

  const downloadQR = () => {
    const link = document.createElement('a')
    link.download = 'GIG-QR-Code.png'
    link.href = document.querySelector('canvas')?.toDataURL("image/png").replace("image/png", "image/octet-stream") || ''
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const qrcode = (
    <QRCodeCanvas
      includeMargin={false}
      className='qr-codes'
      id='gig-qr-code'
      value={environment.BASE_URL+'/'+address}
      fgColor='#212121'
      style={{width: '72px', height: '72px'}}
      imageSettings={{src:'/favicon.png', width: 20, height: 20, excavate:true}}
      onClick={downloadQR}
    />
  )

  return (
    <Flex
      flexDirection={'column'}
    >
      <Flex
        as="header"
        position="relative"
        zIndex={-1}
        h="200px"
        w="full"
        rounded="xl"
        bgColor="gray.100"
      >
        {cover && (
          <Image
            src={cover}
            alt={name || address}
            height={200}
            width={1440}
            objectFit="cover"
            rounded="xl"
          />
        )}
      </Flex>
      <Flex
        as="nav"
        flexDirection={{base: 'column', md: 'row'}}
        alignItems="center"
        gap={6}
        mx={10}
        mt={-20}
      >
        <Box
          minW={32}
          h={32}
          overflow="hidden"
          rounded={'full'}
          bgColor="white"
        >
          <AccountImage address={address} image={image} size={128} />
        </Box>
        <Flex
          w={'full'}
          flexDirection={{base: 'column', md: 'row'}}
          justifyContent='space-between'
          pt={{base: 0, md: 24}}
        >
          <Box>
            <Flex
              gap={2}
              flexDirection='column'
            >
              <Flex
                gap={{base: 0, md: 2}}
                alignItems={'center'}
                flexDirection={{base: 'column', md: 'row'}}
                justifyContent={{base: 'center', md: 'flex-start'}}
              >
                <Heading
                  as="h1"
                  variant="title"
                  color="brand.black"
                  overflowWrap="break-word"
                  textAlign={{base: 'center', md: 'left'}}
                >
                  {name}
                </Heading>
                {verified && (
                  <Flex
                    color="brand.500"
                    mt={2}
                    gap={1}
                    justifyContent={{base: 'center', md: 'flex-start'}}
                  >
                    <Icon as={HiBadgeCheck} />
                    <span style={{fontSize: '12px'}}>{t('user.info.verified')}</span>
                  </Flex>
                )}
              </Flex>
              {description && (
                  <Box textAlign="justify" color="gray.500" fontSize={'xs'}
                      dangerouslySetInnerHTML={{__html: description}}>
                  </Box>
              )}
            </Flex>
          </Box>
          <Flex flexDirection={'column'}>
            <Flex
              my={{base: 6, md: 2}}
              textAlign={'center'}
              flexDirection={{base: 'column', md: 'row'}}
              gap={2}
            >
              <Flex
                gap={6}
                flexDirection={'row'}
                justifyContent="center"
                pt={2}
                pr={2}
              >
                {twitter && (
                  <Link
                    href={`https://twitter.com/${twitter}`}
                    isExternal
                    justifyContent="center"
                  >
                    <Icon as={SiTwitter} />
                  </Link>
                    
                )}
                {instagram && (
                  <Link
                    href={`https://instagram.com/${instagram}`}
                    isExternal
                    justifyContent="center"
                  >
                    <Icon as={SiInstagram} />
                  </Link>
                )}
                {website && (
                  <Link
                    href={website.includes('http') ? website : `https://${website}`}
                    isExternal
                    justifyContent="center"
                  >
                    <Icon as={HiOutlineGlobeAlt} />
                  </Link>
                )}
              </Flex>
              <Button 
                colorScheme="gray"
                fontSize={'sm'}
              >
                <WalletAddress address={address} isCopyable isShort />
              </Button>
            </Flex>
            <Flex flexDirection='column' justifyContent={'center'} alignItems='center' pt={2}>
              {qrcode}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default UserProfileBanner
