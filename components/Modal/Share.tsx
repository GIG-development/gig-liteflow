import {
    Box,
    Flex,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text
  } from '@chakra-ui/react'
  import useTranslation from 'next-translate/useTranslation'
  import { QRCodeCanvas } from "qrcode.react";
  import { FC } from 'react'
  
  type Props = {
    isOpen: boolean
    onClose: () => void
    link: string
  }
  
  const ShareModal: FC<Props> = ({
    isOpen,
    onClose,
    link
  }) => {
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
          value={link}
          fgColor='#212121'
          size={512}
          style={{width: '220px !important', height: '220px !important'}}
          imageSettings={{src:'/favicon.png', width: 60, height: 60, excavate:true}}
          onClick={downloadQR}
        />
    )
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading as="h3" variant="heading1" color="brand.black">
              {t('modal.share.title')}
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex align='center' justify='center' flexDir='column'>
                <Box>
                    {qrcode}
                </Box>
                <Text variant='text-sm' pt={2}>
                    {t('modal.share.qrCode.download')}
                </Text>
            </Flex>
          </ModalBody>
          <ModalFooter as="div" />
        </ModalContent>
      </Modal>
    )
  }
  
  export default ShareModal
  