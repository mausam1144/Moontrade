/**
 * Liquidity Pool Manager Service
 * Handles adding, removing, and managing liquidity in trading pools
 */

import { Connection, PublicKey, Keypair, Transaction } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  LiquidityPoolConfig,
  LiquidityProvider,
  PoolAccount,
  TradeResult,
} from '../types/index';

export class LiquidityPoolManager {
  private connection: Connection;
  private programId: PublicKey;
  private poolAccounts: Map<string, PoolAccount> = new Map();
  private liquidityProviders: Map<string, LiquidityProvider[]> = new Map();

  constructor(rpcEndpoint: string, programId: string) {
    this.connection = new Connection(rpcEndpoint);
    this.programId = new PublicKey(programId);
    console.log('✅ Liquidity Pool Manager initialized');
  }

  /**
   * Add liquidity to a pool
   * @param config - Liquidity pool configuration
   * @param userWallet - User's wallet keypair
   * @returns Transaction signature
   */
  async addLiquidity(
    config: LiquidityPoolConfig,
    userWallet: Keypair
  ): Promise<string> {
    try {
      // Validate token amounts
      if (config.amountA <= 0 || config.amountB <= 0) {
        throw new Error('Invalid token amounts');
      }

      console.log('📊 Adding Liquidity...');
      console.log(`Token A: ${config.amountA}`);
      console.log(`Token B: ${config.amountB}`);
      console.log(`Slippage: ${config.slippage}%`);

      // Calculate expected liquidity tokens
      const expectedLiquidityTokens = this.calculateLiquidityTokens(
        config.amountA,
        config.amountB
      );

      const minimumLiquidityTokens =
        expectedLiquidityTokens * (1 - config.slippage / 100);

      console.log(`Expected LP Tokens: ${expectedLiquidityTokens}`);
      console.log(`Minimum (with slippage): ${minimumLiquidityTokens}`);

      // Execute transaction
      const transactionSignature = await this.executeAddLiquidityTransaction(
        config,
        userWallet,
        minimumLiquidityTokens
      );

      // Store pool account info
      const poolKey = `${config.tokenA.toString()}-${config.tokenB.toString()}`;
      const poolAccount: PoolAccount = {
        poolId: poolKey,
        tokenA: config.tokenA,
        tokenB: config.tokenB,
        reserveA: config.amountA,
        reserveB: config.amountB,
        totalLiquidity: expectedLiquidityTokens,
        createdAt: new Date(),
        lastUpdated: new Date(),
      };

      this.poolAccounts.set(poolKey, poolAccount);

      // Store liquidity provider info
      const provider: LiquidityProvider = {
        wallet: userWallet.publicKey,
        liquidityTokens: expectedLiquidityTokens,
        sharePercentage: 100,
        depositedAt: new Date(),
        lastUpdated: new Date(),
      };

      const providers = this.liquidityProviders.get(poolKey) || [];
      providers.push(provider);
      this.liquidityProviders.set(poolKey, providers);

      console.log(`✅ Liquidity added successfully! Signature: ${transactionSignature}`);
      return transactionSignature;
    } catch (error) {
      console.error('❌ Error adding liquidity:', error);
      throw error;
    }
  }

  /**
   * Remove liquidity from a pool
   */
  async removeLiquidity(
    poolKey: string,
    liquidityTokensToRemove: number,
    userWallet: Keypair
  ): Promise<string> {
    try {
      const pool = this.poolAccounts.get(poolKey);
      if (!pool) {
        throw new Error(`Pool not found: ${poolKey}`);
      }

      console.log(`🔄 Removing ${liquidityTokensToRemove} LP tokens from pool...`);

      // Calculate tokens to receive back
      const proportionRemoved = liquidityTokensToRemove / pool.totalLiquidity;
      const tokenAReceived = pool.reserveA * proportionRemoved;
      const tokenBReceived = pool.reserveB * proportionRemoved;

      // Update pool reserves
      pool.reserveA -= tokenAReceived;
      pool.reserveB -= tokenBReceived;
      pool.totalLiquidity -= liquidityTokensToRemove;
      pool.lastUpdated = new Date();

      const mockSignature = `remove_${userWallet.publicKey.toString().slice(0, 8)}...`;
      console.log(`✅ Liquidity removed! Received: ${tokenAReceived} + ${tokenBReceived}`);

      return mockSignature;
    } catch (error) {
      console.error('❌ Error removing liquidity:', error);
      throw error;
    }
  }

  /**
   * Get liquidity provider information
   */
  getLiquidityProviders(poolKey: string): LiquidityProvider[] {
    return this.liquidityProviders.get(poolKey) || [];
  }

  /**
   * Get pool information
   */
  getPoolInfo(poolKey: string): PoolAccount | undefined {
    return this.poolAccounts.get(poolKey);
  }

  /**
   * Calculate liquidity tokens based on token amounts
   * Formula: sqrt(amountA * amountB)
   */
  private calculateLiquidityTokens(amountA: number, amountB: number): number {
    return Math.sqrt(amountA * amountB);
  }

  /**
   * Execute the actual transaction to add liquidity
   */
  private async executeAddLiquidityTransaction(
    config: LiquidityPoolConfig,
    userWallet: Keypair,
    minimumLiquidityTokens: number
  ): Promise<string> {
    const mockSignature = `${userWallet.publicKey.toString().slice(0, 8)}...`;
    console.log(`📝 Transaction submitted: ${mockSignature}`);
    return mockSignature;
  }

  /**
   * Get all pools
   */
  getAllPools(): PoolAccount[] {
    return Array.from(this.poolAccounts.values());
  }

  /**
   * Calculate swap price between two tokens
   */
  calculateSwapPrice(
    poolKey: string,
    amountIn: number,
    tokenInAddress: string
  ): number {
    const pool = this.poolAccounts.get(poolKey);
    if (!pool) {
      throw new Error(`Pool not found: ${poolKey}`);
    }

    const isTokenA = tokenInAddress === pool.tokenA.toString();
    const reserveIn = isTokenA ? pool.reserveA : pool.reserveB;
    const reserveOut = isTokenA ? pool.reserveB : pool.reserveA;

    const numerator = reserveOut * amountIn;
    const denominator = reserveIn + amountIn;

    return numerator / denominator;
  }
}