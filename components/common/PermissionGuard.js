import { Box, Typography } from '@mui/material';
import { useUser } from '../../context/UserContext';
import Layout from '../layout/Layout';

const NoAccess = () => (
  <Layout>
    <Box p={3}>
      <Typography variant="h4">Acceso Denegado</Typography>
      <Typography>No tienes permiso.</Typography>
    </Box>
  </Layout>
);

/**
 * Component that conditionally renders children based on user permissions
 */
export const PermissionGuard = ({
  role,
  fallback = null,
  children
}) => {
  const { hasRole } = useUser()
  return hasRole(role) ? children : fallback
}

/**
 * Hook for checking permissions in components
 */
export const usePermissions = () => {
  const { hasPermission, hasRole, canRead, canWrite, canDelete, canManageUsers } = useUser()

  return {
    hasPermission,
    hasRole,
    canRead,
    canWrite,
    canDelete,
    canManageUsers
  }
}