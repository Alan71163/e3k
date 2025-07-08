import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Bot, Send, BarChart3, DollarSign, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CryptoData, Message } from '@/types/crypto';

interface CryptoDetailModalProps {
  crypto: CryptoData | null;
  isOpen: boolean;
  onClose: () => void;
}

const CryptoDetailModal: React.FC<CryptoDetailModalProps> = ({ crypto, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (crypto && isOpen) {
      const initialMessage: Message = {
        id: '1',
        type: 'ai',
        content: `Hello! I'm analyzing ${crypto.name} (${crypto.symbol}) for you. Based on current market data, I recommend ${crypto.aiRecommendation} with ${crypto.confidence}% confidence. The main factors are: ${crypto.aiReason}. What would you like to know more about?`,
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    }
  }, [crypto, isOpen]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !crypto) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response based on crypto data
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateContextualResponse(newMessage, crypto),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);

    setNewMessage('');
  };

  const generateContextualResponse = (question: string, crypto: CryptoData): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('price') || lowerQuestion.includes('cost')) {
      return `${crypto.name} is currently trading at $${crypto.price.toLocaleString()} with a 24h change of ${crypto.changePercent24h > 0 ? '+' : ''}${crypto.changePercent24h.toFixed(2)}%. The 24h high was $${crypto.high24h.toLocaleString()} and low was $${crypto.low24h.toLocaleString()}.`;
    }
    
    if (lowerQuestion.includes('buy') || lowerQuestion.includes('sell') || lowerQuestion.includes('hold')) {
      return `My recommendation for ${crypto.name} is ${crypto.aiRecommendation} with ${crypto.confidence}% confidence. This is based on ${crypto.aiReason}. The potential profit/loss is estimated at ${crypto.potentialProfit > 0 ? '+' : ''}${crypto.potentialProfit}%.`;
    }
    
    if (lowerQuestion.includes('technical') || lowerQuestion.includes('rsi') || lowerQuestion.includes('indicator')) {
      return `Technical analysis for ${crypto.name}: RSI is at ${crypto.technicalIndicators.rsi.toFixed(1)} (${crypto.technicalIndicators.rsi < 30 ? 'oversold' : crypto.technicalIndicators.rsi > 70 ? 'overbought' : 'neutral'}), 20-day SMA: $${crypto.technicalIndicators.sma20.toLocaleString()}, 50-day SMA: $${crypto.technicalIndicators.sma50.toLocaleString()}. Support level: $${crypto.technicalIndicators.support.toLocaleString()}, Resistance: $${crypto.technicalIndicators.resistance.toLocaleString()}.`;
    }
    
    if (lowerQuestion.includes('volume') || lowerQuestion.includes('market cap')) {
      return `${crypto.name} has a market cap of ${crypto.marketCap} with 24h trading volume of ${crypto.volume}. It's ranked #${crypto.fundamentals.rank} by market cap. Circulating supply: ${crypto.fundamentals.circulatingSupply}.`;
    }
    
    if (lowerQuestion.includes('risk') || lowerQuestion.includes('safe')) {
      const riskLevel = crypto.confidence > 80 ? 'low' : crypto.confidence > 60 ? 'moderate' : 'high';
      return `Based on my analysis, ${crypto.name} has ${riskLevel} risk. The confidence level of ${crypto.confidence}% suggests ${riskLevel === 'low' ? 'a relatively stable investment' : riskLevel === 'moderate' ? 'moderate volatility expected' : 'high volatility and uncertainty'}. Always consider your risk tolerance and diversify your portfolio.`;
    }
    
    // Default responses
    const responses = [
      `${crypto.name} is showing ${crypto.changePercent24h > 0 ? 'positive' : 'negative'} momentum with ${crypto.changePercent24h > 0 ? 'bullish' : 'bearish'} indicators. Consider the ${crypto.aiRecommendation} recommendation with ${crypto.confidence}% confidence.`,
      `The current market conditions for ${crypto.name} suggest ${crypto.aiReason}. This supports the ${crypto.aiRecommendation} recommendation.`,
      `Based on technical analysis, ${crypto.name} has potential for ${crypto.potentialProfit > 0 ? 'gains' : 'losses'} of approximately ${Math.abs(crypto.potentialProfit)}%. Monitor key levels at $${crypto.technicalIndicators.support.toLocaleString()} (support) and $${crypto.technicalIndicators.resistance.toLocaleString()} (resistance).`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'SELL':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'HOLD':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY':
        return <CheckCircle className="w-4 h-4" />;
      case 'SELL':
        return <AlertTriangle className="w-4 h-4" />;
      case 'HOLD':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (!crypto) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              {crypto.symbol.slice(0, 2)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{crypto.name}</h2>
              <p className="text-muted-foreground">{crypto.symbol}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-3xl font-bold">${crypto.price.toLocaleString()}</p>
              <div className="flex items-center gap-1">
                {crypto.changePercent24h > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={crypto.changePercent24h > 0 ? 'text-green-500' : 'text-red-500'}>
                  {crypto.changePercent24h > 0 ? '+' : ''}{crypto.changePercent24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(90vh-120px)]">
          {/* Stats and Analysis */}
          <div className="lg:col-span-2 space-y-6 overflow-y-auto">
            {/* AI Recommendation */}
            <Card className="border-2 border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-500" />
                  AI Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge className={`${getRecommendationColor(crypto.aiRecommendation)} text-lg px-4 py-2`}>
                    {getRecommendationIcon(crypto.aiRecommendation)}
                    <span className="ml-2">{crypto.aiRecommendation}</span>
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="text-2xl font-bold">{crypto.confidence}%</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{crypto.aiReason}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Potential Profit/Loss</p>
                    <p className={`text-xl font-bold ${crypto.potentialProfit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {crypto.potentialProfit > 0 ? '+' : ''}{crypto.potentialProfit}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <p className="text-xl font-bold">
                      {crypto.confidence > 80 ? 'Low' : crypto.confidence > 60 ? 'Medium' : 'High'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">24h High</p>
                      <p className="text-lg font-bold">${crypto.high24h.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">24h Low</p>
                      <p className="text-lg font-bold">${crypto.low24h.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Volume</p>
                      <p className="text-lg font-bold">{crypto.volume}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Market Cap</p>
                      <p className="text-lg font-bold">{crypto.marketCap}</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="technical" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">RSI (14)</p>
                      <p className="text-lg font-bold">{crypto.technicalIndicators.rsi.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">
                        {crypto.technicalIndicators.rsi < 30 ? 'Oversold' : crypto.technicalIndicators.rsi > 70 ? 'Overbought' : 'Neutral'}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">SMA 20</p>
                      <p className="text-lg font-bold">${crypto.technicalIndicators.sma20.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">SMA 50</p>
                      <p className="text-lg font-bold">${crypto.technicalIndicators.sma50.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Support</p>
                      <p className="text-lg font-bold text-green-500">${crypto.technicalIndicators.support.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Resistance</p>
                      <p className="text-lg font-bold text-red-500">${crypto.technicalIndicators.resistance.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">MACD</p>
                      <p className="text-lg font-bold">{crypto.technicalIndicators.macd.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="fundamentals" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Rank</p>
                      <p className="text-lg font-bold">#{crypto.fundamentals.rank}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Circulating Supply</p>
                      <p className="text-lg font-bold">{crypto.fundamentals.circulatingSupply}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Total Supply</p>
                      <p className="text-lg font-bold">{crypto.fundamentals.totalSupply}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Max Supply</p>
                      <p className="text-lg font-bold">{crypto.fundamentals.maxSupply || 'N/A'}</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* AI Chat */}
          <div className="flex flex-col h-full">
            <Card className="flex-1 flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-500" />
                  AI Analysis Chat
                </CardTitle>
                <CardDescription>
                  Ask me anything about {crypto.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted text-foreground p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 animate-spin" />
                            <span className="text-sm">AI is analyzing...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <Separator />
                <div className="p-4 flex-shrink-0">
                  <div className="flex gap-2">
                    <Input
                      placeholder={`Ask about ${crypto.symbol}...`}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
                      disabled={isLoading}
                    />
                    <Button onClick={sendMessage} size="sm" disabled={isLoading || !newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CryptoDetailModal;