/**
 * Moontrade - Main Entry Point
 * Web3 Trading Platform with Liquidity Pools & Gas-Free Trades
 */

import dotenv from 'dotenv';
import { LiquidityPoolManager } from './services/liquidity';
import { GasFreeTradeManager } from './services/trades';
import { AITradingAgent } from './services/aiAgent';

// Load environment variables
dotenv.config();

/**
 * Initialize and start the Moontrade platform
 */
async function main() {
  try {
    console.log('🚀 Starting Moontrade Platform...\n');

    // Initialize services
    const liquidityManager = new LiquidityPoolManager(
      process.env.SOLANA_RPC || 'https://api.mainnet-beta.solana.com',
      process.env.SOLANA_PROGRAM_ID || 'YOUR_PROGRAM_ID'
    );

    const tradeManager = new GasFreeTradeManager(
      process.env.BASE_RPC || 'https://mainnet.base.org',
      process.env.BASE_PROGRAM_ID || 'YOUR_BASE_PROGRAM_ID'
    );

    const aiAgent = new AITradingAgent(
      liquidityManager,
      tradeManager
    );

    console.log('✅ All services initialized successfully!');
    console.log('📊 Platform is ready for trading operations\n');

    // Log available operations
    console.log('Available Operations:');
    console.log('1. Add Liquidity to Pools');
    console.log('2. Execute Gas-Free Trades');
    console.log('3. Monitor AI Trading Agent');
    console.log('4. Manage Trading Positions\n');

  } catch (error) {
    console.error('❌ Error initializing Moontrade:', error);
    process.exit(1);
  }
}

// Run the application
main();

export { LiquidityPoolManager, GasFreeTradeManager, AITradingAgent };