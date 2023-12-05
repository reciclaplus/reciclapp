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
        }
      })
        .then((response) => response.json())
        .then((data) => {
          sessionStorage.setItem("token", data[0])
          sessionStorage.setItem("id_token", data[1])
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