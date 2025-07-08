export interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume: string;
  marketCap: string;
  high24h: number;
  low24h: number;
  open: number;
  previousClose: number;
  aiRecommendation: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  aiReason: string;
  potentialProfit: number;
  technicalIndicators: {
    rsi: number;
    macd: number;
    sma20: number;
    sma50: number;
    support: number;
    resistance: number;
  };
  fundamentals: {
    circulatingSupply: string;
    totalSupply: string;
    maxSupply: string;
    rank: number;
  };
}

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface MarketStats {
  totalMarketCap: string;
  volume24h: string;
  btcDominance: number;
  fearGreedIndex: number;
  activeCoins: number;
}