import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout'
import PasarPuntos from '../components/PasarPuntos';

export default function Map() {

  return (
    <div className={styles.container}>
      <Head>
        <title>ReciclApp</title>
        <meta name="description" content="Mapa de familias" />
        <link rel="icon" type="image/png" href="/logo.png" />
      </Head>
      <Layout>
        <PasarPuntos></PasarPuntos>
      </Layout>
    </div>
  )
}
