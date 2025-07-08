"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { Search, TrendingUp, TrendingDown, Bot, Send, Star, Filter, RefreshCw, DollarSign, BarChart3, Zap, MessageCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { CryptoData, Message } from '@/types/crypto'
import { yahooFinanceService } from '@/services/yahooFinanceApi'
import CryptoDetailModal from './crypto-detail-modal'

interface CryptoDashboardProps {
  onBack: () => void;
}

const CryptoDashboard: React.FC<CryptoDashboardProps> = ({ onBack }) => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI crypto advisor. I can help you analyze market trends and make informed trading decisions. What would you like to know?',
      timestamp: new Date()
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [sortBy, setSortBy] = useState('marketCap')
  const [filterBy, setFilterBy] = useState('all')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadCryptoData()
  }, [])

  const loadCryptoData = async () => {
    try {
      setLoading(true)
      const data = await yahooFinanceService.getAllCryptoData()
      setCryptoData(data)
    } catch (error) {
      console.error('Error loading crypto data:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await loadCryptoData()
    setRefreshing(false)
  }

  const filteredCryptos = useMemo(() => {
    let filtered = cryptoData.filter(crypto =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (filterBy !== 'all') {
      filtered = filtered.filter(crypto => crypto.aiRecommendation === filterBy.toUpperCase())
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price
        case 'change':
          return b.changePercent24h - a.changePercent24h
        case 'profit':
          return b.potentialProfit - a.potentialProfit
        case 'confidence':
          return b.confidence - a.confidence
        default:
          return parseFloat(b.marketCap.replace(/[$BTM]/g, '')) - parseFloat(a.marketCap.replace(/[$BTM]/g, ''))
      }
    })
  }, [cryptoData, searchTerm, sortBy, filterBy])

  const topPicks = useMemo(() => {
    return cryptoData
      .filter(crypto => crypto.aiRecommendation === 'BUY')
      .sort((a, b) => b.potentialProfit - a.potentialProfit)
      .slice(0, 3)
  }, [cryptoData])

  const marketStats = useMemo(() => {
    const totalMarketCap = cryptoData.reduce((sum, crypto) => {
      const cap = parseFloat(crypto.marketCap.replace(/[$BTM]/g, ''))
      const multiplier = crypto.marketCap.includes('T') ? 1e12 : crypto.marketCap.includes('B') ? 1e9 : 1e6
      return sum + (cap * multiplier)
    }, 0)

    const totalVolume = cryptoData.reduce((sum, crypto) => {
      const vol = parseFloat(crypto.volume.replace(/[$BTM]/g, ''))
      const multiplier = crypto.volume.includes('T') ? 1e12 : crypto.volume.includes('B') ? 1e9 : 1e6
      return sum + (vol * multiplier)
    }, 0)

    const btcData = cryptoData.find(crypto => crypto.symbol === 'BTC')
    const btcMarketCap = btcData ? parseFloat(btcData.marketCap.replace(/[$BTM]/g, '')) * (btcData.marketCap.includes('T') ? 1e12 : 1e9) : 0
    const btcDominance = totalMarketCap > 0 ? (btcMarketCap / totalMarketCap) * 100 : 0

    return {
      totalMarketCap: totalMarketCap >= 1e12 ? `$${(totalMarketCap / 1e12).toFixed(2)}T` : `$${(totalMarketCap / 1e9).toFixed(1)}B`,
      volume24h: totalVolume >= 1e12 ? `$${(totalVolume / 1e12).toFixed(2)}T` : `$${(totalVolume / 1e9).toFixed(1)}B`,
      btcDominance: btcDominance.toFixed(1),
      fearGreedIndex: 65 + Math.floor(Math.random() * 20),
      activeCoins: cryptoData.length
    }
  }, [cryptoData])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(newMessage),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)

    setNewMessage('')
  }

  const generateAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('bitcoin') || lowerMessage.includes('btc')) {
      const btc = cryptoData.find(crypto => crypto.symbol === 'BTC')
      if (btc) {
        return `Bitcoin is currently at $${btc.price.toLocaleString()} with a ${btc.changePercent24h > 0 ? 'gain' : 'loss'} of ${Math.abs(btc.changePercent24h).toFixed(2)}% today. My recommendation is ${btc.aiRecommendation} with ${btc.confidence}% confidence based on ${btc.aiReason}.`
      }
    }
    
    if (lowerMessage.includes('market') || lowerMessage.includes('overview')) {
      return `The crypto market has a total cap of ${marketStats.totalMarketCap} with ${marketStats.volume24h} in 24h volume. Bitcoin dominance is at ${marketStats.btcDominance}%. I'm tracking ${marketStats.activeCoins} cryptocurrencies with AI recommendations.`
    }
    
    if (lowerMessage.includes('buy') || lowerMessage.includes('recommend')) {
      const buyRecommendations = cryptoData.filter(crypto => crypto.aiRecommendation === 'BUY').slice(0, 3)
      if (buyRecommendations.length > 0) {
        const recommendations = buyRecommendations.map(crypto => `${crypto.name} (${crypto.potentialProfit > 0 ? '+' : ''}${crypto.potentialProfit}% potential)`).join(', ')
        return `Based on my analysis, I recommend considering: ${recommendations}. These show strong technical indicators and positive market sentiment.`
      }
    }

    const responses = [
      `The market is showing mixed signals today. I'm analyzing ${cryptoData.length} cryptocurrencies and ${topPicks.length} show strong BUY signals.`,
      `Current market sentiment appears ${marketStats.fearGreedIndex > 50 ? 'optimistic' : 'cautious'}. Focus on cryptocurrencies with strong fundamentals and clear use cases.`,
      `Technical indicators suggest volatility ahead. Consider dollar-cost averaging and maintaining a diversified portfolio across different crypto sectors.`,
      `DeFi and Layer 1 tokens are showing interesting patterns. Monitor trading volumes and institutional adoption for confirmation signals.`,
      `Remember to always do your own research and never invest more than you can afford to lose. Crypto markets are highly volatile.`
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'SELL':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'HOLD':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const handleCryptoClick = (crypto: CryptoData) => {
    setSelectedCrypto(crypto)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <h2 className="text-2xl font-bold mb-2">Loading Crypto Data</h2>
          <p className="text-muted-foreground">Fetching real-time data from Yahoo Finance...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                AI Crypto Predictor
              </h1>
              <p className="text-muted-foreground mt-2">
                Real-time cryptocurrency analysis powered by Yahoo Finance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={refreshData} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
            <Badge variant="secondary" className="bg-green-500/10 text-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Live Data
            </Badge>
          </div>
        </div>

        {/* Top Picks */}
        {topPicks.length > 0 && (
          <Card className="border-2 border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                AI Top Picks Today
              </CardTitle>
              <CardDescription>
                Highest potential profit opportunities identified by our AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topPicks.map((crypto, index) => (
                  <div 
                    key={crypto.symbol} 
                    className="relative p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => handleCryptoClick(crypto)}
                  >
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                          {crypto.symbol.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{crypto.name}</h3>
                        <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="font-medium">${crypto.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Potential</span>
                        <span className="font-medium text-green-500">+{crypto.potentialProfit}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Confidence</span>
                        <span className="font-medium">{crypto.confidence}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search cryptocurrencies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketCap">Market Cap</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="change">24h Change</SelectItem>
                      <SelectItem value="profit">Potential Profit</SelectItem>
                      <SelectItem value="confidence">AI Confidence</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="hold">Hold</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Crypto List */}
            <Card>
              <CardHeader>
                <CardTitle>Cryptocurrency Analysis</CardTitle>
                <CardDescription>
                  Real-time data with AI-powered recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {filteredCryptos.map((crypto) => (
                      <div
                        key={crypto.symbol}
                        className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => handleCryptoClick(crypto)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                                {crypto.symbol.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{crypto.name}</h3>
                              <p className="text-muted-foreground">{crypto.symbol}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">${crypto.price.toLocaleString()}</p>
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
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Volume</p>
                            <p className="font-medium">{crypto.volume}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Market Cap</p>
                            <p className="font-medium">{crypto.marketCap}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">AI Confidence</p>
                            <p className="font-medium">{crypto.confidence}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Potential</p>
                            <p className={`font-medium ${crypto.potentialProfit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {crypto.potentialProfit > 0 ? '+' : ''}{crypto.potentialProfit}%
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <Badge className={getRecommendationColor(crypto.aiRecommendation)}>
                            <Bot className="w-3 h-3 mr-1" />
                            {crypto.aiRecommendation}
                          </Badge>
                          <p className="text-sm text-muted-foreground max-w-md truncate">
                            {crypto.aiReason}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant Sidebar */}
          <div className="space-y-6">
            <Card className="h-[700px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-500" />
                  AI Assistant
                </CardTitle>
                <CardDescription>
                  Ask me anything about crypto markets
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
                          className={`max-w-[80%] p-3 rounded-lg ${
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
                  </div>
                </ScrollArea>
                <Separator />
                <div className="p-4 flex-shrink-0">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask about crypto trends..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage} size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Market Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Market Cap</span>
                  <span className="font-semibold">{marketStats.totalMarketCap}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">24h Volume</span>
                  <span className="font-semibold">{marketStats.volume24h}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">BTC Dominance</span>
                  <span className="font-semibold">{marketStats.btcDominance}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Fear & Greed</span>
                  <Badge variant="secondary" className={marketStats.fearGreedIndex > 50 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}>
                    {marketStats.fearGreedIndex > 75 ? 'Extreme Greed' : marketStats.fearGreedIndex > 50 ? 'Greed' : marketStats.fearGreedIndex > 25 ? 'Fear' : 'Extreme Fear'} ({marketStats.fearGreedIndex})
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tracked Coins</span>
                  <span className="font-semibold">{marketStats.activeCoins}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CryptoDetailModal
        crypto={selectedCrypto}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedCrypto(null)
        }}
      />
    </div>
  )
}

export default CryptoDashboard