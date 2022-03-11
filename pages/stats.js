import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout'
import Dashboard from '../components/Dashboard';

export default function Stats() {

  return (
    <div className={styles.container}>
      <Head>
        <title>ReciclApp</title>
        <meta name="description" content="Mapa de familias" />
        <link rel="icon" type="image/png" href="/logo.png" />
      </Head>
      <Layout>
        <Dashboard />
      </Layout>
    </div>
  )
}
