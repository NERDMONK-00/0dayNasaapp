import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SpaceNav } from './components/SpaceNav'
import { Starfield } from './components/Starfield'
import { MascotAssistant } from './components/MascotAssistant'
import { HomePage } from './pages/HomePage'
import { AstronautPage } from './pages/AstronautPage'
import { TestPage } from './pages/TestPage'
import { ResultsPage } from './pages/ResultsPage'
import { HowItWorksPage } from './pages/HowItWorksPage'
import { AboutPage } from './pages/AboutPage'

function AppLayout() {
  return (
    <div className="relative min-h-screen bg-[#02070d] text-slate-100">
      <Starfield />
      <div className="relative z-10">
        <SpaceNav />
        <main className="mx-auto max-w-[1500px] px-2 py-3 md:px-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/astronauts" element={<AstronautPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
      <MascotAssistant />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App
