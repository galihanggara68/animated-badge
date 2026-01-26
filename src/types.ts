/**
 * Type Definitions for Animated Badge System
 * Provides TypeScript types and interfaces for all badge configurations
 */

/**
 * Base badge configuration interface
 */
export interface BaseBadgeConfig {
  width: number;
  height: number;
  viewBox: string;
  title: string;
  backgroundColor?: string;
}

/**
 * Animation timing configuration
 */
export interface AnimationTiming {
  dur: string; // Duration in seconds (e.g., "1.5s")
  begin?: string; // Start time (e.g., "0s", "2s")
  repeatCount: string; // "indefinite" or number as string
  fill?: string; // "freeze" or "remove"
}

/**
 * Build status types
 */
export type BuildStatus = 'success' | 'failed' | 'pending' | 'running';

/**
 * Build status badge configuration
 */
export interface BuildStatusBadgeConfig {
  status: BuildStatus;
  label?: string;
  message?: string;
}

/**
 * Version badge configuration
 */
export interface VersionBadgeConfig {
  version: string;
  previousVersion?: string;
  label?: string;
}

/**
 * Coverage badge configuration
 */
export interface CoverageBadgeConfig {
  coveragePercentage: number;
  label?: string;
}

/**
 * License badge configuration
 */
export interface LicenseBadgeConfig {
  license: string;
  label?: string;
  shimmerInterval?: number; // Seconds between shimmer animations
}

/**
 * Cloudflare Worker environment interface
 */
export interface Env {
  // Add any environment variables here
  // Example: API_KEY: string;
}

/**
 * Badge type union
 */
export type BadgeConfig =
  | BuildStatusBadgeConfig
  | VersionBadgeConfig
  | CoverageBadgeConfig
  | LicenseBadgeConfig;

/**
 * Badge type enum
 */
export enum BadgeType {
  BUILD_STATUS = 'build-status',
  VERSION = 'version',
  COVERAGE = 'coverage',
  LICENSE = 'license',
}

/**
 * API response interface
 */
export interface ApiResponse {
  status: string;
  message?: string;
  data?: unknown;
}

/**
 * Health check response interface
 */
export interface HealthCheckResponse {
  status: string;
  service: string;
  version: string;
  endpoints: string[];
}

/**
 * Error response interface
 */
export interface ErrorResponse {
  error: string;
  message: string;
}

/**
 * Color scheme interface
 */
export interface ColorScheme {
  success: string;
  failed: string;
  pending: string;
  running: string;
  [key: string]: string;
}

/**
 * Coverage color ranges
 */
export interface CoverageColorRange {
  min: number;
  max: number;
  color: string;
}

/**
 * SVG element attributes
 */
export interface SvgElementAttributes {
  [key: string]: string | number | undefined;
  fill?: string;
  stroke?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  opacity?: number;
}

/**
 * Animation values interface
 */
export interface AnimationValues {
  from: string | number;
  to: string | number;
  values?: string;
}

/**
 * Transform animation interface
 */
export interface TransformAnimation extends AnimationValues {
  type: 'translate' | 'scale' | 'rotate' | 'skewX' | 'skewY';
}

/**
 * Badge validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * File size validation
 */
export interface FileSizeValidation {
  valid: boolean;
  size: number;
  maxSize: number;
  percentage: number;
}
