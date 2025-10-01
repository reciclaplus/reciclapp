import { Avatar, Button } from '@mui/material';
import Box from '@mui/material/Box';
import { useGoogleLogin } from '@react-oauth/google';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { API_URL } from '../../configuration';

function SignInButton(props) {

  const router = useRouter()
  const queryClient = useQueryClient()

  function logout() {
    // Call the backend logout endpoint to clear cookies
    fetch(`${API_URL}/logout`, {
      method: 'POST',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    })
    .then(() => {
      // Clear any remaining localStorage items (for backward compatibility)
      localStorage.removeItem("token");
      localStorage.removeItem("id_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("expiry");
      
      // Invalidate queries and redirect
      queryClient.clear()
      router.push('/')
    })
    .catch((error) => {
      console.error('Logout error:', error)
      // Even if logout fails, clear local data and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("id_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("expiry");
      router.push('/')
    })
  }

  const login = useGoogleLogin({
    onSuccess: codeResponse => {

      fetch(`${API_URL}/auth?code=${codeResponse.code}`, {
        method: 'GET',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': 'Bearer ' + codeResponse.code
        }
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Authentication successful:', data.message)
          // No need to manually store tokens - they are in HTTP-only cookies
        })
        .then(() => queryClient.invalidateQueries())
        .catch((error) => {
          console.error('Authentication failed:', error)
        })
    },
    flow: 'auth-code',
  });

  if (props.user) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>

        <Button variant="outlined" onClick={() => login()} startIcon={<Avatar src={props.picture} />}>
          {props.user}
        </Button>
        <Button variant="outlined" color='error' onClick={() => logout()} sx={{ my: 1 }}>
          Cerrar sesión
        </Button>
      </Box >)
  }

  else {
    return (
      <Button variant="outlined" onClick={() => login()}>
        Iniciar sesión
      </Button>)
  }

}

export default SignInButton