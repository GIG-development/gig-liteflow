import { chakra, Text, TextProps } from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import { useMemo, useState } from 'react'

type Props = {
  children: string
  length?: number
  size?: 'lg'
  color?: TextProps['color']
}

export default function Truncate({
  children,
  length = 90,
  size,
  color = 'gray.500',
}: Props): JSX.Element {
  const { t } = useTranslation('components')
  const [isOpen, setIsOpen] = useState(false)
  const truncate = useMemo(
    () =>
      children.length > length
        ? children.substring(0, length - 3) + '...'
        : children,
    [children, length],
  )
  return (
    <>
      <Text variant={size === 'lg' ? 'text' : 'text-sm'} color={color}>
        {isOpen ? children : truncate}
        {children.length > length && !isOpen && (
          <chakra.button
            onClick={() => setIsOpen(true)}
            _active={{ opacity: 0.6 }}
            _hover={{ opacity: 0.8 }}
            ml={1}
          >
            <Text
              variant={size === 'lg' ? 'button1' : 'button2'}
              color="brand.black"
            >
              {t('truncate.show-more')}
            </Text>
          </chakra.button>
        )}
      </Text>
    </>
  )
}
