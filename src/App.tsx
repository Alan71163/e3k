import { useState } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import AICryptoPredictorHero from '@/components/ui/ai-crypto-predictor-hero';
import CryptoDashboard from '@/components/ui/crypto-dashboard';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'hero' | 'dashboard'>('hero');

  const navigateToDashboard = () => {
    setCurrentView('dashboard');
  };

  const navigateToHero = () => {
    setCurrentView('hero');
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="crypto-app-theme">
      <div className="dark">
        {currentView === 'hero' ? (
          <AICryptoPredictorHero onNavigateToDashboard={navigateToDashboard} />
        ) : (
          <CryptoDashboard onBack={navigateToHero} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;