import Head from 'next/head'
import Layout from '../../components/layout/Layout'
import IndividualPasarPuntos from '../../components/pasarpuntos/IndividualPasarPuntos'
import styles from '../../styles/Home.module.css'

export default function PasarPuntosPage() {

    return (
        <div className={styles.container}>
            <Head>
                <title>ReciclApp</title>
                <meta name="description" content="Mapa de familias" />
                <link rel="icon" type="image/png" href="/logo.png" />
            </Head>
            <Layout>
                <IndividualPasarPuntos />
            </Layout>
        </div>
    )
}
