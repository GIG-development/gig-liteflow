import Head from '../components/Head'
import { NextPage } from 'next'

const Spatial: NextPage = () => {
    return (
    <main id="notFound">
        <Head
            title="Espacio Virtual"
            description=""
        />
        <iframe
            src="https://www.spatial.io/s/GIGverso-63e1472905e5d17a2b420f2a?share=3781707486553246760"
            allow="microphone https://spatial.io; camera https://spatial.io"
            style={{width: '100%', height: 'calc(100vh - 64px)'}}
        >
        </iframe>
    </main>
    )
}

export default Spatial