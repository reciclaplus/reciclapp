import Head from 'next/head'
import styles from '../styles/Home.module.css'

import Layout from '../components/layout/Layout'
import WeightTable from '../components/WeightTable'
export default function List () {
  return (
    <div className={styles.container}>
      <Head>
        <title>ReciclApp</title>
        <meta name="description" content="Pesada semanal" />
        <link rel="icon" type="image/png" href="/logo.png" />
      </Head>
      <Layout>
        {/* <Pesada/> */}
        <WeightTable/>
      </Layout>
    </div>
  )
}
