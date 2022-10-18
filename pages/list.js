import Head from 'next/head'
import styles from '../styles/Home.module.css'

import Layout from '../components/layout/Layout'
import DataGridTable from '../components/list/DataGridTable'

export default function List () {
  return (
    <div className={styles.container}>
      <Head>
        <title>ReciclApp</title>
        <meta name="description" content="Listado de familias" />
        <link rel="icon" type="image/png" href="/logo.png" />
      </Head>
      <Layout>
        <DataGridTable/>
      </Layout>
    </div>
  )
}
