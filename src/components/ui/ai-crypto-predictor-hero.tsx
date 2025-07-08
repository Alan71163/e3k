"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, animate } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Zap, 
  Shield, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Bitcoin,
  DollarSign,
  Activity,
  Star,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AICryptoPredictorHeroProps {
  onNavigateToDashboard: () => void;
}

// Utility function for animated text
function useAnimatedText(text: string, delimiter: string = "") {
  const [cursor, setCursor] = useState(0);
  const [startingCursor, setStartingCursor] = useState(0);
  const [prevText, setPrevText] = useState(text);

  if (prevText !== text) {
    setPrevText(text);
    setStartingCursor(text.startsWith(prevText) ? cursor : 0);
  }

  useEffect(() => {
    const parts = text.split(delimiter);
    const duration = delimiter === "" ? 8 : delimiter === " " ? 4 : 2;
    
    const controls = animate(startingCursor, parts.length, {
      duration,
      ease: "easeOut",
      onUpdate(latest) {
        setCursor(Math.floor(latest));
      },
    });

    return () => controls.stop();
  }, [startingCursor, text, delimiter]);

  return text.split(delimiter).slice(0, cursor).join(delimiter);
}

// Glow component
interface GlowProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'top' | 'above' | 'bottom' | 'below' | 'center';
}

const Glow = React.forwardRef<HTMLDivElement, GlowProps>(
  ({ className, variant = 'top', ...props }, ref) => {
    const variantClasses = {
      top: 'top-0',
      above: '-top-[128px]',
      bottom: 'bottom-0',
      below: '-bottom-[128px]',
      center: 'top-[50%]',
    };

    return (
      <div
        ref={ref}
        className={cn('absolute w-full', variantClasses[variant], className)}
        {...props}
      >
        <div
          className={cn(
            'absolute left-1/2 h-[256px] w-[60%] -translate-x-1/2 scale-[2.5] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_hsl(210_100%_50%/.5)_10%,_transparent_60%)] sm:h-[512px]',
            variant === 'center' && '-translate-y-1/2',
          )}
        />
        <div
          className={cn(
            'absolute left-1/2 h-[128px] w-[40%] -translate-x-1/2 scale-[2] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_hsl(213_100%_60%/.3)_10%,_transparent_60%)] sm:h-[256px]',
            variant === 'center' && '-translate-y-1/2',
          )}
        />
      </div>
    );
  }
);
Glow.displayName = 'Glow';

// Crypto data interface
interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  prediction: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  icon: React.ReactNode;
}

// Mock crypto data
const cryptoData: CryptoData[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 67420,
    change: 5.2,
    prediction: 'BUY',
    confidence: 94,
    icon: <Bitcoin className="w-6 h-6" />
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3840,
    change: -2.1,
    prediction: 'HOLD',
    confidence: 78,
    icon: <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">E</div>
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 245,
    change: 12.8,
    prediction: 'BUY',
    confidence: 89,
    icon: <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">S</div>
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    price: 1.23,
    change: -5.4,
    prediction: 'SELL',
    confidence: 82,
    icon: <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
  }
];

// Prediction card component
interface PredictionCardProps {
  crypto: CryptoData;
  delay?: number;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ crypto, delay = 0 }) => {
  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case 'BUY': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'SELL': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'HOLD': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getPredictionIcon = (prediction: string) => {
    switch (prediction) {
      case 'BUY': return <ArrowUpRight className="w-4 h-4" />;
      case 'SELL': return <ArrowDownRight className="w-4 h-4" />;
      case 'HOLD': return <Minus className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="p-4 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {crypto.icon}
            <div>
              <h3 className="font-semibold text-foreground">{crypto.symbol}</h3>
              <p className="text-sm text-muted-foreground">{crypto.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-foreground">${crypto.price.toLocaleString()}</p>
            <p className={`text-sm flex items-center gap-1 ${crypto.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {crypto.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {crypto.change >= 0 ? '+' : ''}{crypto.change}%
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getPredictionColor(crypto.prediction)}`}>
            {getPredictionIcon(crypto.prediction)}
            <span className="text-sm font-medium">{crypto.prediction}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">{crypto.confidence}% confidence</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Main hero component
interface AICryptoPredictorHeroProps {
  onNavigateToDashboard: () => void;
}

const AICryptoPredictorHero: React.FC<AICryptoPredictorHeroProps> = ({ onNavigateToDashboard }) => {
  const [currentRecommendation, setCurrentRecommendation] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const heroText = "AI-Powered Crypto Predictions That Actually Work";
  const animatedHeroText = useAnimatedText(heroText, " ");

  const descriptions = [
    "Our advanced AI algorithms analyze thousands of market indicators in real-time to give you precise buy, sell, and hold recommendations.",
    "Get instant insights on the best crypto investments with 94% accuracy backed by machine learning and blockchain analytics.",
    "Stop guessing. Start winning. Our AI processes market sentiment, technical patterns, and whale movements to predict price movements."
  ];

  const animatedDescription = useAnimatedText(descriptions[0], " ");

  const recommendations = [
    "Bitcoin (BTC) - Strong BUY signal detected",
    "Solana (SOL) - High growth potential identified", 
    "Ethereum (ETH) - HOLD recommended for stability",
    "Cardano (ADA) - SELL signal - risk detected"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRecommendation((prev) => (prev + 1) % recommendations.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [recommendations.length]);

  const handleAnalyze = useCallback(() => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      onNavigateToDashboard();
    }, 2000);
  }, [onNavigateToDashboard]);

  const handleViewTrackRecord = useCallback(() => {
    onNavigateToDashboard();
  }, [onNavigateToDashboard]);

  return (
    <section className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Glow variant="above" className="animate-pulse" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {/* AI Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8"
            >
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium">Powered by Advanced AI</span>
              <Zap className="w-4 h-4" />
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent leading-tight">
              {animatedHeroText}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              {animatedDescription}
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button
                size="lg"
                onClick={() => {
                  handleAnalyze();
                  setTimeout(() => onNavigateToDashboard(), 2000);
                }}
                disabled={isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isAnalyzing ? (
                  <>
                    <Activity className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Markets...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Get AI Predictions Now
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleViewTrackRecord}
                className="px-8 py-4 text-lg font-semibold rounded-xl border-border/50 hover:bg-accent/50 transition-all duration-300"
              >
                <Shield className="w-5 h-5 mr-2" />
                View Track Record
              </Button>
            </motion.div>

            {/* Live Recommendation Ticker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card/50 border border-border/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-muted-foreground">Live Recommendation:</span>
              </div>
              <motion.span
                key={currentRecommendation}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-sm font-semibold text-foreground"
              >
                {recommendations[currentRecommendation]}
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            {[
              {
                icon: <Brain className="w-8 h-8 text-blue-500" />,
                title: "Advanced AI Analysis",
                description: "Machine learning algorithms process thousands of market signals every second"
              },
              {
                icon: <Shield className="w-8 h-8 text-green-500" />,
                title: "94% Accuracy Rate",
                description: "Proven track record with verified predictions and transparent results"
              },
              {
                icon: <Zap className="w-8 h-8 text-yellow-500" />,
                title: "Real-Time Alerts",
                description: "Instant notifications when market conditions change or opportunities arise"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border-border/50 bg-card/30 backdrop-blur-sm">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Live Predictions Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Live AI Predictions
              </h2>
              <p className="text-muted-foreground text-lg">
                Real-time analysis of top cryptocurrencies
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cryptoData.map((crypto, index) => (
                <PredictionCard
                  key={crypto.symbol}
                  crypto={crypto}
                  delay={1.6 + index * 0.1}
                />
              ))}
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="text-center"
          >
            <Card className="p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                Ready to Start Winning?
              </h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Join thousands of traders who trust our AI predictions
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  onClick={onNavigateToDashboard}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Start Free Trial
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>4.9/5 from 10,000+ users</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AICryptoPredictorHero;