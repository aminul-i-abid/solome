import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

/**
 * Interface for token payload
 */
export interface TokenPayload {
  userId: string;
  username?: string;
  email?: string;
  [key: string]: any; // Allow for additional custom claims
}

/**
 * Interface for token response
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Token generation utility class
 * Provides methods for generating and verifying JWT tokens
 */
export class TokenUtil {
  /**
   * Default expiration times (in seconds)
   */
  private static readonly DEFAULT_ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes
  private static readonly DEFAULT_REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days

  /**
   * Validates that required environment variables are set
   * @throws HttpException if environment variables are missing
   */
  private static validateEnvironment(): void {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new HttpException(
        'ACCESS_TOKEN_SECRET environment variable is not set',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new HttpException(
        'REFRESH_TOKEN_SECRET environment variable is not set',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Generates an access token
   * @param payload Data to include in the token
   * @param expiresIn Token expiration time in seconds (default: 15 minutes)
   * @returns JWT access token
   */
  static generateAccessToken(
    payload: TokenPayload,
    expiresIn: number = this.DEFAULT_ACCESS_TOKEN_EXPIRY,
  ): string {
    this.validateEnvironment();

    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn,
      algorithm: 'HS256',
    });
  }

  /**
   * Generates a refresh token
   * @param payload Data to include in the token
   * @param expiresIn Token expiration time in seconds (default: 7 days)
   * @returns JWT refresh token
   */
  static generateRefreshToken(
    payload: TokenPayload,
    expiresIn: number = this.DEFAULT_REFRESH_TOKEN_EXPIRY,
  ): string {
    this.validateEnvironment();

    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
      expiresIn,
      algorithm: 'HS256',
    });
  }

  /**
   * Generates both access and refresh tokens
   * @param payload Data to include in the tokens
   * @param accessTokenExpiry Access token expiration time in seconds (default: 15 minutes)
   * @param refreshTokenExpiry Refresh token expiration time in seconds (default: 7 days)
   * @returns Object containing both tokens and expiration time
   */
  static generateTokens(
    payload: TokenPayload,
    accessTokenExpiry: number = this.DEFAULT_ACCESS_TOKEN_EXPIRY,
    refreshTokenExpiry: number = this.DEFAULT_REFRESH_TOKEN_EXPIRY,
  ): TokenResponse {
    const accessToken = this.generateAccessToken(payload, accessTokenExpiry);
    const refreshToken = this.generateRefreshToken(payload, refreshTokenExpiry);

    return {
      accessToken,
      refreshToken,
      expiresIn: accessTokenExpiry,
    };
  }

  /**
   * Verifies an access token
   * @param token JWT access token to verify
   * @returns Decoded token payload
   * @throws Error if token is invalid
   */
  static verifyAccessToken(token: string): TokenPayload {
    this.validateEnvironment();

    try {
      return jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
      ) as TokenPayload;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        'Invalid or expired access token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /**
   * Verifies a refresh token
   * @param token JWT refresh token to verify
   * @returns Decoded token payload
   * @throws Error if token is invalid
   */
  static verifyRefreshToken(token: string): TokenPayload {
    this.validateEnvironment();

    try {
      return jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET as string,
      ) as TokenPayload;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        'Invalid or expired refresh token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
