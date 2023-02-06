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
  console.log(image)
  return (
    <NextHead>
      <title>
        {title} | {title !== 'GIG' ? 'GIG - ' : ''}Más que un marketplace, la mejor comunidad NFT de creativos en Latinoamérica
      </title>
      <meta
        property="og:title"
        content={title}
      />
      <meta 
        name="twitter:title"
        content={title}
      />

      <meta name="description" content={description ? description : "Únete al Marketplace no. 1 de latinoamérica para crear NFTs de manera fácil y segura."} />
      <meta property="og:description" content={description ? description : "Únete al Marketplace no. 1 de latinoamérica para crear NFTs de manera fácil y segura."} />
      <meta name="twitter:description" content={description ? description : "Únete al Marketplace no. 1 de latinoamérica para crear NFTs de manera fácil y segura."} />

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
      <link
        rel='icon'
        href={`${environment.BASE_URL}/favicon.png`}
      />
      <link
        rel="apple-touch-icon"
        href={`${environment.BASE_URL}/apple-touch-icon.png`}
      />
      <link
        rel='canonical'
        href='https://gig.io'
      />
      <meta name="author" content="GIG Development" />
      <meta name="application-name" content="GIG Marketplace" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://gig.io" />
      <meta name="twitter:card" content="summary" />
      <meta name="facebook-domain-verification" content="9uxfyoohs9a0jzcc8azppw7cm7ha5w" />

      {children}

    </NextHead>
  )
}

export default Head
