import { Avatar, Button } from '@mui/material';
import Box from '@mui/material/Box';
import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/router';
import { API_URL } from '../../configuration';

function SignInButton(props) {

  const router = useRouter()

  function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expiry");

    router.push('/')
  }

  const login = useGoogleLogin({
    onSuccess: codeResponse => {

      fetch(`${API_URL}/auth?code=${codeResponse.code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': 'Bearer ' + codeResponse.code
        }
      })
        .then((response) => response.json())
        .then((data) => {

          localStorage.setItem("token", data["token"])
          localStorage.setItem("id_token", data["id_token"])
          localStorage.setItem("refresh_token", data["refresh_token"])
          localStorage.setItem("expiry", data["expiry"])

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