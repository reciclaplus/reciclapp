import { LocationOn as LocationOnIcon, People as PeopleIcon } from '@mui/icons-material'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { NoAccess, PermissionGuard } from '../components/common/PermissionGuard'
import Layout from '../components/layout/Layout'

// Lazy load admin components to improve initial page load
const UserManagement = dynamic(() => import('../components/admin/UserManagement'), {
  loading: () => <Box sx={{ p: 3 }}>Cargando...</Box>,
  ssr: false
})
const TownDetails = dynamic(() => import('../components/admin/TownDetails'), {
  loading: () => <Box sx={{ p: 3 }}>Cargando...</Box>,
  ssr: false
})

function TabPanel ({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <PermissionGuard role="admin" fallback={<NoAccess />}>
      <Layout>
        <Box p={3}>
          <Typography variant="h4" gutterBottom>
            Panel de Administración
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab icon={<PeopleIcon />} label="Usuarios" />
              <Tab icon={<LocationOnIcon />} label="Detalles del Pueblo" />
            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <UserManagement />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <TownDetails />
          </TabPanel>
        </Box>
      </Layout>
    </PermissionGuard>
  )
}
