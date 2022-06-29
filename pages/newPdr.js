import Head from 'next/head'
import Layout from '../components/Layout'
import NewPdr from '../components/NewPdr'
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
        <NewPdr></NewPdr>
      </Layout>
    </div>
  )
}
