import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Script from 'next/script'
import { Button } from "@material-ui/core";
import React, { useEffect, useState } from 'react';

import Layout from '../components/Layout'
import Pesada from '../components/Pesada'
import WeightTable from '../components/WeightTable'
export default function List() {

  return (
    <div className={styles.container}>
      <Head>
        <title>ReciclApp</title>
        <meta name="description" content="Pesada semanal" />
        <link rel="icon" type="image/png" href="/logo.png" />
      </Head>
      <Layout>
        {/* <Pesada/> */}
        <WeightTable/>
      </Layout>
    </div>
  )
}
