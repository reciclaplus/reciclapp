import Head from 'next/head'
import { useContext } from 'react'
import Dashboard from '../components/dashboards/private/Dashboard'
import Layout from '../components/layout/Layout'
import DashboardSample from '../components/sample/DashboardSample'
import styles from '../styles/Home.module.css'

import { NoAccess, PermissionGuard } from '../components/common/PermissionGuard'
import { TownContext } from '../context/TownContext'

export default function Stats() {
  const { town } = useContext(TownContext)

  return (
    <PermissionGuard role="read" fallback={<NoAccess />}>
      <div className={styles.container}>
        <Head>
          <title>ReciclApp</title>
          <meta name="description" content="Mapa de familias" />
          <link rel="icon" type="image/png" href="/logo.png" />
        </Head>
        <Layout>
          {town === 'sample' ? <DashboardSample /> : <Dashboard />}
        </Layout>
      </div>
    </PermissionGuard>
  )
}
