import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout'
import Dashboard from '../components/Dashboard';
import DashboardSample from '../components/sample/DashboardSample';
import { useContext } from 'react';
import { TownContext } from '../context/TownContext';

export default function Stats() {

  const {town, setTown} = useContext(TownContext)
  
  return (
    <div className={styles.container}>
      <Head>
        <title>ReciclApp</title>
        <meta name="description" content="Mapa de familias" />
        <link rel="icon" type="image/png" href="/logo.png" />
      </Head>
      <Layout>
        {town == "sample" ? <DashboardSample /> : <Dashboard />}
      </Layout>
    </div>
  )
}
