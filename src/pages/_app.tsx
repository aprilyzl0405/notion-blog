import '../styles/tailwind.css'
import '../styles/global.css'

import { AppProps, NextWebVitalsMetric } from 'next/app'
import Footer from '../components/footer'

import { webVitals, trackPageChanges } from '../lib/gtag'
import { useEffect } from 'react'

// this function will report web vitals
export function reportWebVitals(metric: NextWebVitalsMetric) {
  webVitals(metric)
}

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    trackPageChanges() // this will report route changes
  }, [])

  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  )
}

export default App
