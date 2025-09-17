import Head from 'next/head'
import styles from '../styles/Home.module.css'

import Layout from '../components/layout/Layout'
import DataGridTable from '../components/list/DataGridTable'

import { Box, Typography } from '@mui/material'

import { PermissionGuard } from '../components/common/PermissionGuard'

export default function List() {
  return (
    <PermissionGuard role="read" fallback={
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
          <meta name="description" content="Listado de familias" />
          <link rel="icon" type="image/png" href="/logo.png" />
        </Head>
        <Layout>
          <DataGridTable />
        </Layout>
      </div>
    </PermissionGuard>
  )
}
