import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { CircularProgress } from "@mui/material";
import { GOOGLE_API_KEY } from '../gcloud/google';

const render = (status) => {
  if (status === Status.FAILURE) return <ErrorComponent />;
  return <CircularProgress size={130} thickness={6} sx={{ ml: 2 }}/>;
};

export const MapsWrapper = ({ children }) => (
  <Wrapper apiKey={GOOGLE_API_KEY} render={render}>
    {children}
  </Wrapper>
);