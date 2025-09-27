import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import AdminPanel from '../components/admin/AdminPanel'
import { useCurrentUser } from '../hooks/queries'
import styles from '../styles/Home.module.css'
import { Box, Alert, CircularProgress } from '@mui/material'

export default function Admin() {
  const currentUserQuery = useCurrentUser()
  const user = currentUserQuery.status === 'success' ? currentUserQuery.data : null
  const [hasAdminAccess, setHasAdminAccess] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUserQuery.status === 'success') {
      setHasAdminAccess(user?.role === 'admin')
      setLoading(false)
    } else if (currentUserQuery.status === 'error') {
      setLoading(false)
    }
  }, [currentUserQuery.status, user])

  if (loading) {
    return (
      <div className={styles.container}>
        <Head>
          <title>Admin Panel - ReciclApp</title>
          <meta name="description" content="Panel de administración" />
          <link rel="icon" type="image/png" href="/logo.png" />
        </Head>
        <Layout>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        </Layout>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Admin Panel - ReciclApp</title>
        <meta name="description" content="Panel de administración" />
        <link rel="icon" type="image/png" href="/logo.png" />
      </Head>
      <Layout>
        {hasAdminAccess ? (
          <AdminPanel />
        ) : (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">
              No tienes permisos de administrador para acceder a esta página.
            </Alert>
          </Box>
        )}
      </Layout>
    </div>
  )
}