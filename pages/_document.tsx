// eslint-disable-next-line @next/next/no-document-import-in-page
import Document, { Head, Html, Main, NextScript } from 'next/document'
import { ReactElement } from 'react'

class MyDocument extends Document {
  render(): ReactElement {
    return (
      <Html lang={this.props.locale || 'es-mx'}>
        <Head>
          <link rel='icon' href="favicon.png" />
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Source+Code+Pro:ital,wght@0,300;1,300&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
