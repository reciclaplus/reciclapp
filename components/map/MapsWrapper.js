import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { CircularProgress } from "@mui/material";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const render = (status) => {
  if (status === Status.FAILURE) return <ErrorComponent />;
  return <CircularProgress size={130} thickness={6} sx={{ ml: 2 }} />;
};

export const MapsWrapper = ({ children }) => (
  <Wrapper apiKey={GOOGLE_API_KEY} render={render}>
    {children}
  </Wrapper>
);