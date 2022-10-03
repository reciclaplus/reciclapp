import Head from 'next/head'
import Layout from '../components/layout/Layout'
import MyMap from '../components/map/Map'
import styles from '../styles/Home.module.css'

export default function Map () {
  return (
    <div className={styles.container}>
      <Head>
        <title>ReciclApp</title>
        <meta name="description" content="Mapa de familias" />
        <link rel="icon" type="image/png" href="/logo.png" />
      </Head>
      <Layout>
        <MyMap></MyMap>
      </Layout>
    </div>
  )
}
