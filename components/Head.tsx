import NextHead from 'next/head'
import { FC, PropsWithChildren } from 'react'
import environment from '../environment'

type Props = {
  title: string
  description?: string
  keywords?: string
  image?: string
}

const Head: FC<PropsWithChildren<Props>> = ({
  title,
  description,
  keywords,
  image,
  children,
}) => {
  return (
    <NextHead>
      <title>{title} | GIG - Más que un marketplace, la mejor comunidad NFT de creativos en Latinoamérica</title>
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
      {description && (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
        </>
      )}
      <meta
        name="keywords"
        content={keywords!=='' ? keywords : 'nfts, marketplace, latam, artistas digitales, ganar royalties, arte, latinoamerica, plataforma de venta de arte digital'}
      />
      <meta
        property="og:image"
        content={image || `${environment.BASE_URL}/social_og-image.jpg`}
      />
      <meta
        name="twitter:image"
        content={image || `${environment.BASE_URL}/social_twitter-card.jpg`}
      />
      <link rel='icon' href={`${environment.BASE_URL}/favicon.png`} />
      <link
        rel="apple-touch-icon"
        href={`${environment.BASE_URL}/apple-touch-icon.png`}
      />
      <meta name="facebook-domain-verification" content="9uxfyoohs9a0jzcc8azppw7cm7ha5w" />
      {children}
    </NextHead>
  )
}

export default Head
