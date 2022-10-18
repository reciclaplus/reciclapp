import Head from 'next/head'
import Layout from '../components/layout/Layout'
import { MapComponent } from '../components/map/Map'
import { MapsWrapper } from '../components/map/MapsWrapper'
import styles from '../styles/Home.module.css'

export default function MapPage () {
  return (
    <div className={styles.container}>
      <Head>
        <title>ReciclApp</title>
        <meta name="description" content="Mapa de familias" />
        <link rel="icon" type="image/png" href="/logo.png" />
      </Head>
      <Layout>
        <MapsWrapper>
          <MapComponent />
        </MapsWrapper>
      </Layout>
    </div>
  )
}
