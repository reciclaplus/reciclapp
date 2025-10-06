import { Dashboard as DashboardIcon, LocationOn as LocationOnIcon, People as PeopleIcon } from '@mui/icons-material'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import { useState } from 'react'
import GlobalStatistics from '../components/admin/GlobalStatistics'
import TownDetails from '../components/admin/TownDetails'
import UserManagement from '../components/admin/UserManagement'
import { NoAccess, PermissionGuard } from '../components/common/PermissionGuard'
import Layout from '../components/layout/Layout'

function TabPanel({ children, value, index }) {
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
              <Tab icon={<DashboardIcon />} label="Estadísticas Globales" />
            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <UserManagement />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <TownDetails />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <GlobalStatistics />
          </TabPanel>
        </Box>
      </Layout>
    </PermissionGuard>
  )
}
