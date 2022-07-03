import Head from 'next/head'
import styles from '../styles/Home.module.css'

import Layout from '../components/layout/Layout'
import Table from '../components/Table'

export default function List () {
  return (
    <div className={styles.container}>
      <Head>
        <title>ReciclApp</title>
        <meta name="description" content="Listado de familias" />
        <link rel="icon" type="image/png" href="/logo.png" />
      </Head>
      <Layout>
        <Table/>
      </Layout>
    </div>
  )
}
