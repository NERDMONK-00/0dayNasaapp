import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import AppShell from './components/AppShell'
import { AboutPage } from './pages/AboutPage'
import { AstronautPage } from './pages/AstronautPage'
import { HomePage } from './pages/HomePage'
import { HowItWorksPage } from './pages/HowItWorksPage'
import { ResultsPage } from './pages/ResultsPage'
import { TestPage } from './pages/TestPage'

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/astronauts', element: <AstronautPage /> },
      { path: '/test', element: <TestPage /> },
      { path: '/results', element: <ResultsPage /> },
      { path: '/how-it-works', element: <HowItWorksPage /> },
      { path: '/about', element: <AboutPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
)
