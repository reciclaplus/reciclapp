import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Layout from '../components/layout/Layout';
import AddWeightForm from '../components/weight/AddWeightForm';
import WeightLog from '../components/weight/WeightLog';

export default function AddWeightPage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>ReciclApp - Añadir Peso</title>
        <meta name="description" content="Añadir nueva medición de peso" />
        <link rel="icon" type="image/png" href="/logo.png" />
      </Head>
      <Layout>
        <h1>Añadir Paca</h1>
        <AddWeightForm />
        <h2>Últimas Entradas</h2>
        <WeightLog />
      </Layout>
    </div>
  );
}
