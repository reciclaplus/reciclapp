
import Head from 'next/head'
import LandingPage from '../components/landing/LandingPage'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>ReciclApp</title>
        <meta name="description" content="Landing page" />
        <link rel="icon" type="image/png" href="/logo.png" />
      </Head>
      < LandingPage />
    </div>
  )
}
