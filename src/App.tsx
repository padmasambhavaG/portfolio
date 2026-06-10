import { useState, useEffect, lazy, Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Hero from './components/Hero';

// Lazy load below-the-fold components to optimize initial JS bundle (LCP/FID)
const SelectedWorks = lazy(() => import('./components/SelectedWorks'));
const Skills = lazy(() => import('./components/Skills'));
const Journal = lazy(() => import('./components/Journal'));
const Explorations = lazy(() => import('./components/Explorations'));
const Stats = lazy(() => import('./components/Stats'));
const ContactFooter = lazy(() => import('./components/ContactFooter'));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Force page to always load and reload from the top (home)
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <main className="w-full bg-bg min-h-screen">
        <Hero />

        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center text-muted">Loading section...</div>}>
          <SelectedWorks />
          <Skills />
          <Journal />
          <Explorations />
          <Stats />
          <ContactFooter />
        </Suspense>
      </main>
    </>
  );
}

export default App;
