import { Box, Button, Flex, Heading, Icon, Link, useDisclosure, useToast } from '@chakra-ui/react'
import { useEffect, useState, VFC } from 'react'
import Image from '../../Image/Image'
import AccountImage from '../../Wallet/Image'
import { HiBadgeCheck } from '@react-icons/all-files/hi/HiBadgeCheck'
import { HiOutlineGlobeAlt } from '@react-icons/all-files/hi/HiOutlineGlobeAlt'
import { SiInstagram } from '@react-icons/all-files/si/SiInstagram'
import { SiTwitter } from '@react-icons/all-files/si/SiTwitter'
import { BiUserPlus } from '@react-icons/all-files/bi/BiUserPlus'
import { BiUserCheck } from '@react-icons/all-files/bi/BiUserCheck'
//import { BiUserMinus } from '@react-icons/all-files/bi/BiUserMinus'
import useTranslation from 'next-translate/useTranslation'
import WalletAddress from '../../Wallet/Address'
import ShareModal from '../../Modal/Share'
import { FaShare } from '@react-icons/all-files/fa/FaShare'
import { StreamFeed, DefaultGenerics } from 'getstream'
import environment from 'environment'

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
  streamUser: StreamFeed<DefaultGenerics> | undefined
  isSameAddress: boolean
}

const UserProfileBanner: VFC<Props> = ({ cover, image, address, name, description, verified, twitter, instagram, website, streamUser, isSameAddress }) => {
  if (!address) throw new Error('account is falsy')
  const { t } = useTranslation('components')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const [following, setFollowing] = useState(false)
  useEffect(()=>{
    if(streamUser && address){
      streamUser.following()
        .then((res: any)=>{
          setFollowing(res.results.filter((user:any) => user.target_id === `user:${address.toUpperCase()}`).length > 0)
        })
    }
  },[streamUser, address])

  const onFollowUnfollow = (streamUser: any, userToFollow: string) => {
    if(following){
      streamUser.unfollow('user',userToFollow.toUpperCase())
      setFollowing(false)
      toast({
        title: t('user.social.options.unfollow.action'),
        status: 'success',
      })
      return
    }
    streamUser.follow('user',userToFollow.toUpperCase())
    setFollowing(true)
    toast({
      title: t('user.social.options.follow.action'),
      status: 'success',
    })
  }

  return (
    <>
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
            layout="fill"
            objectFit="cover"
            rounded="xl"
            sizes="
          (min-width: 80em) 1216px,
          100vw"
          />
        )}
      </Flex>
      <Flex
        as="nav"
        flexDirection={{base: 'column', md: 'row'}}
        gap={6}
        mx={{base: 0, md: 10}}
        mt={-20}
      >
        <Flex
          my={{base: 6, md: 2}}
          textAlign={'center'}
          flexDirection={'column'}
          alignItems='center'
          gap={2}
        >
          <Box
            h={32}
            w={32}
            overflow="hidden"
            rounded={'full'}
            bgColor="white"
          >
            <AccountImage address={address} image={image} size={128} />
          </Box>
          <Flex
            gap={6}
            flexDirection={'row'}
            justifyContent="center"
            pt={2}
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
            fontSize={{base: 'xs', md: 'sm'}}
          >
            <WalletAddress address={address} isCopyable isShort />
          </Button>
        </Flex>
        <Flex
          w={'full'}
          flexDirection={{base: 'column', md: 'row'}}
          justifyContent='space-between'
          pt={{base: 0, md: 24}}
          gap={6}
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
                  <Box textAlign="justify" color="gray.500" fontSize={'xs'} maxH={{base: '120px', md: '76px'}} mb={4} overflowY='auto'
                      dangerouslySetInnerHTML={{__html: description}}>
                  </Box>
              )}
            </Flex>
          </Box>
          <Flex flexDirection={'column'}>
            <Flex flexDirection={{base: 'row', md: 'column'}} justifyContent={'center'} alignItems='center' pt={2} gap={2}>
              { (streamUser && verified && !isSameAddress) &&
                <Button
                  w='120px'
                  fontSize={{base: 'xs', md: 'sm'}}
                  variant={following
                            ? 'outline'
                            : 'solid'
                          }
                  leftIcon={following
                              ? <BiUserCheck fontSize={24}/>
                              : <BiUserPlus fontSize={24}/>
                            }
                  _hover={following
                            ? {backgroundColor: "red.400", color: 'white'}
                            : {backgroundColor: "green.400"}
                          }
                  title={following
                          ? t('user.social.options.unfollow.button')
                          : t('user.social.options.follow.button')
                        }
                  onClick={()=>onFollowUnfollow(streamUser,address)}
                >
                  {following
                    ? t('user.social.options.following.button')
                    : t('user.social.options.follow.button')
                  }
                </Button>
              }
              <Button
                w='120px'
                fontSize={{base: 'xs', md: 'sm'}}
                leftIcon={<FaShare fontSize={16}/>}
                onClick={onOpen} 
              >
                {t('modal.share.title')}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
    <ShareModal isOpen={isOpen} onClose={onClose} link={environment.BASE_URL+'/'+address}/>
    </>
  )
}

export default UserProfileBanner
