import Head from 'next/head'
import Layout from '../components/layout/Layout'
import NewPdr from '../components/newpdr/NewPdr'
import styles from '../styles/Home.module.css'

import { PermissionGuard } from '../components/common/PermissionGuard'

export default function NewPdrPage() {
  return (
    <PermissionGuard role="admin" fallback={
      <Layout>
        <Box p={3}>
          <Typography variant="h4">Acceso Denegado</Typography>
          <Typography>No tienes permiso.</Typography>
        </Box>
      </Layout>
    }>
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
    </PermissionGuard>
  )
}
