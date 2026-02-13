import dorsuLogo from './assets/Dorsu_Logo v2.png'
import { ExternalFormPage } from './pages/ExternalFormPage'

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col items-center pb-20 bg-slate-900 text-slate-100">
      <header
        className="fixed top-0 left-0 right-0 z-10 w-full flex flex-row items-center justify-between gap-3 py-3 sm:py-4 px-3 sm:px-6 text-white shadow-md"
        style={{ backgroundColor: '#0f1960' }}
      >
        <img
          src={dorsuLogo}
          alt="DORSU Logo"
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain shrink-0"
        />
        <h1 className="text-xs sm:text-base md:text-lg lg:text-xl font-semibold leading-tight text-right flex-shrink min-w-0 uppercase" style={{ fontFamily: "'Poppins', 'Canva Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
          <span className="block sm:inline">Davao Oriental State University</span>
          <span className="hidden sm:inline"> </span>
          <span className="block sm:inline">Certificate of Appearance</span>
        </h1>
      </header>
      <div className="w-full flex flex-col items-center p-4 pt-24 sm:pt-28 mt-4">
        {children}
      </div>
    </div>
  )
}

function App() {
  return (
    <Layout>
      <ExternalFormPage />
    </Layout>
  )
}

export default App
