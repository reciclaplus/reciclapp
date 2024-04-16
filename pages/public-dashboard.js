import Head from 'next/head'
import PublicDashboard from '../components/public-dashboard/PublicDashboard'
import styles from '../styles/Home.module.css'

export default function WeightPage() {
    return (
        <div className={styles.container}>
            <Head>
                <title>ReciclApp</title>
                <meta name="public dashboard" content="public dashboard" />
                <link rel="icon" type="image/png" href="/logo.png" />
            </Head>
            <PublicDashboard />
        </div>
    )
}
