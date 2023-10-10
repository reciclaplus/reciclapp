/* eslint-disable no-undef */
import { Button } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { conf } from '../../configuration'
import { PdrContext } from '../../context/PdrContext'
import { StatsContext } from '../../context/StatsContext'
import { TownContext } from '../../context/TownContext'
import { WeightContext } from '../../context/WeightContext'
import CustomAlert from '../CustomAlert'
import { BUCKET_NAME } from './google'

function OpenFile(props) {
  const router = useRouter()
  const { setPdr } = useContext(PdrContext)
  const { setStats } = useContext(StatsContext)
  const { town } = useContext(TownContext)
  const { setWeight } = useContext(WeightContext)
  const [isOpening, setIsOpening] = useState(false)
  const [alertMessage, setAlertMessage] = useState(null)

  const file = conf[town].file

  const bucket = town === 'sample' ? 'reciclaplus-public' : BUCKET_NAME

  function downloadFunctionFastApi() {
    setIsOpening(true)
    fetch(`https://fastapi-dot-norse-voice-343214.uc.r.appspot.com/download-file?file=${file}&bucket=${bucket}&token=${sessionStorage.token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    }).then(function (response) {

      if (response.status != 200) {
        throw new Error(`${response.status}: ${response.statusText}`)
      }
      return response.json()
    })
      .then(function (data) {
        setPdr(data.pdr)
        setWeight(data.peso)
        setStats(data.stats)
        router.push('/list')
        setIsOpening(false)
      })
      .catch((error) => {
        setAlertMessage(
          <CustomAlert
            message='No tienes acceso al archivo'
            setAlertMessage={setAlertMessage}
            severity='error' />
        )
        setIsOpening(false)
      });
  }

  return (<>
    {alertMessage}
    <Button id="open-btn" variant="contained" onClick={downloadFunctionFastApi}>Abrir</Button>
    {isOpening ? <CircularProgress size={30} thickness={6} sx={{ ml: 2 }} /> : <></>}
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
  </>
  )
}

export default OpenFile
