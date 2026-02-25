// src/types/index.ts

// Interface for representing a Liquidity Pool
export interface LiquidityPool {
    id: string;
    tokenA: string;
    tokenB: string;
    reserveA: number;
    reserveB: number;
    fee: number;
}

// Interface for representing Gas-Free Trades
export interface GasFreeTrade {
    id: string;
    trader: string;
    amount: number;
    timestamp: Date;
}

// Interface for representing AI Trading Agents
export interface AITradingAgent {
    id: string;
    strategy: string;
    performanceMetrics: PerformanceMetrics;
}

// Interface for Performance Metrics
interface PerformanceMetrics {
    returnOnInvestment: number;
    riskLevel: string;
}

// Interface for Market Data
export interface MarketData {
    symbol: string;
    price: number;
    volume: number;
    marketCap: number;
}

// Interface for Trading Statistics
export interface TradingStatistics {
    totalTrades: number;
    winRate: number;
    averageReturn: number;
}