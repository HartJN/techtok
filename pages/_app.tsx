import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'

import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import '../styles/globals.css'
import styles from '../styles/_app.module.scss'

const App = ({ Component, pageProps }: AppProps) => {
  const [isSSR, setIsSSR] = useState(true)

  useEffect(() => {
    setIsSSR(false)
  }, [])

  if (isSSR) return null

  return (
    <GoogleOAuthProvider
      clientId={`${process.env.NEXT_PUBLIC_GOOGLE_API_TOKEN}`}
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <Navbar />
        </header>
        <div className={styles.sidebar_wrapper}>
          <Sidebar />
        </div>
        <div className={styles.main_wrapper}>
          <Component {...pageProps} />
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}

export default App
