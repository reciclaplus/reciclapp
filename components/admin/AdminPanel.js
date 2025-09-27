import { useState } from 'react'
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  Container,
  Paper
} from '@mui/material'
import UserManagement from './UserManagement'
import TownManagement from './TownManagement'
import GlobalStats from './GlobalStats'
import AdminIcon from '@mui/icons-material/AdminPanelSettings'
import PeopleIcon from '@mui/icons-material/People'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import AnalyticsIcon from '@mui/icons-material/Analytics'

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  }
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Paper elevation={1} sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 3, backgroundColor: 'primary.main', color: 'white' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <AdminIcon fontSize="large" />
            <Typography variant="h4" component="h1">
              Panel de Administración
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
            Gestión de usuarios, configuración de pueblos y estadísticas globales
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="admin tabs">
            <Tab 
              label="Usuarios" 
              icon={<PeopleIcon />} 
              iconPosition="start"
              {...a11yProps(0)} 
            />
            <Tab 
              label="Pueblos" 
              icon={<LocationCityIcon />} 
              iconPosition="start"
              {...a11yProps(1)} 
            />
            <Tab 
              label="Estadísticas" 
              icon={<AnalyticsIcon />} 
              iconPosition="start"
              {...a11yProps(2)} 
            />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <UserManagement />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <TownManagement />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <GlobalStats />
        </TabPanel>
      </Paper>
    </Container>
  )
}