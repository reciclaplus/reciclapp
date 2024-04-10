import { Avatar, Button } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { API_URL } from '../../configuration';

function SignInButton(props) {

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
          props.setIdToken(data[1])
        })
    },
    flow: 'auth-code',
  });

  if (props.user) {
    return (
      <Button variant="outlined" onClick={() => login()} startIcon={<Avatar src={props.picture} />}>
        {props.user}
      </Button>)
  }

  else {
    return (
      <Button variant="outlined" onClick={() => login()}>
        Conéctate
      </Button>)
  }

}

export default SignInButton