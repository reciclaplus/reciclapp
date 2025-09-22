import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { NoAccess, PermissionGuard } from '../components/common/PermissionGuard'
import Layout from '../components/layout/Layout'
import WeightDataGridTable from '../components/weight/WeightDataGridTable'

export default function WeightPage() {
  return (
    <PermissionGuard role="write" fallback={<NoAccess />}>
      <div className={styles.container}>
        <Head>
          <title>ReciclApp</title>
          <meta name="description" content="Pesada semanal" />
          <link rel="icon" type="image/png" href="/logo.png" />
        </Head>
        <Layout>
          <WeightDataGridTable />
        </Layout>
      </div>
    </PermissionGuard>
  )
}
