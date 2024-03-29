import Head from 'next/head'
import Layout from '../components/layout/Layout'
import NewPdr from '../components/newpdr/NewPdr'
import styles from '../styles/Home.module.css'

export default function NewPdrPage () {
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
