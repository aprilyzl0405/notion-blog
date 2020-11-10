import '../styles/tailwind.css'
import '../styles/global.css'
import Footer from '../components/footer'

const App = ({ Component, pageProps }) => (
  <>
    <Component {...pageProps} />
    <Footer />
  </>
)

export default App
