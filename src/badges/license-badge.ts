/**
 * License Badge with Shimmer/Glint Animation
 *
 * Trigger Rule: time-based (every 5-10s)
 * Animation: Shimmer / Glint sweep effect
 *
 * Pure SVG implementation using <animateTransform> on gradient mask
 * Timing: 1.0s - 1.6s duration, every 5-10s interval, indefinite repeat
 * Direction: Left → Right
 */

import { BaseBadge, BadgeConfig, AnimationTiming } from './base-badge';

export interface LicenseBadgeConfig {
  license: string;
  label?: string;
  shimmerInterval?: number; // Seconds between shimmer animations (default: 7s)
}

export class LicenseBadge extends BaseBadge {
  private licenseConfig: LicenseBadgeConfig;

  constructor(config: LicenseBadgeConfig) {
    const baseConfig: BadgeConfig = {
      width: 110,
      height: 20,
      viewBox: '0 0 110 20',
      title: `License: ${config.license}`,
      backgroundColor: 'transparent',
    };
    super(baseConfig);
    this.licenseConfig = config;
  }

  /**
   * Generate license badge with shimmer animation
   */
  generate(): string {
    this.renderBadgeBackground();
    this.renderLicenseText();
    this.addShimmerAnimation();

    return super.generate();
  }

  /**
   * Render badge background
   */
  private renderBadgeBackground(): void {
    // Label background
    this.addRect({
      x: 0,
      y: 0,
      width: 55,
      height: 20,
      fill: '#555',
    });

    // License background
    this.addRect({
      x: 55,
      y: 0,
      width: 55,
      height: 20,
      fill: '#007ec6',
    });
  }

  /**
   * Render license text
   */
  private renderLicenseText(): void {
    const label = this.licenseConfig.label || 'license';
    const licenseText = this.formatLicense(this.licenseConfig.license);

    // Label text
    this.addText({
      x: 27.5,
      y: 14,
      text: label,
      fill: '#fff',
      textAnchor: 'middle',
    });

    // License text (with gradient definition for shimmer)
    const shimmerInterval = this.licenseConfig.shimmerInterval || 7;
    const shimmerDuration = 1.3;

    this.addGroup('license-container', [
      `<defs>
        <linearGradient id="shimmer-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#fff" stop-opacity="0" />
          <stop offset="50%" stop-color="#fff" stop-opacity=".8" />
          <stop offset="100%" stop-color="#fff" stop-opacity="0" />
        </linearGradient>
        <mask id="shimmer-mask">
          <rect x="55" y="0" width="55" height="20" fill="url(#shimmer-gradient)" opacity="0">
            <animate attributeName="opacity" values="0;1;0" dur="${shimmerDuration}s" begin="0s;${shimmerInterval}s" repeatCount="indefinite" />
          </rect>
        </mask>
      </defs>`,
      `<text id="license-text" x="82.5" y="14" fill="#fff" font-size="11" font-family="Verdana, Geneva, sans-serif" text-anchor="middle" mask="url(#shimmer-mask)">${this.escapeXml(licenseText)}</text>`,
    ]);

    // Add shimmer sweep animation using animateTransform
    this.addGroup('shimmer-sweep', [
      `<rect id="shimmer-rect" x="55" y="0" width="15" height="20" fill="url(#shimmer-gradient)" opacity="0">
        <animate attributeName="opacity" values="0;0.6;0" dur="${shimmerDuration}s" begin="0s;${shimmerInterval}s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" from="55,0" to="95,0" dur="${shimmerDuration}s" begin="0s;${shimmerInterval}s" repeatCount="indefinite" additive="sum" />
      </rect>`,
    ]);
  }

  /**
   * Format license text for display
   */
  private formatLicense(license: string): string {
    // Common license abbreviations
    const licenseMap: Record<string, string> = {
      'MIT': 'MIT',
      'Apache-2.0': 'Apache',
      'GPL-3.0': 'GPL',
      'BSD-3-Clause': 'BSD',
      'ISC': 'ISC',
      'MPL-2.0': 'MPL',
    };

    return licenseMap[license] || license.length > 8 ? license.substring(0, 8) : license;
  }

  /**
   * Add shimmer animation
   * Uses <animateTransform> for left-to-right sweep
   * Combines with <animate> on opacity for fade effect
   *
   * Timing Contract:
   * - Duration: 1.0s - 1.6s (using 1.3s as middle ground)
   * - Interval: Every 5-10s (default: 7s)
   * - Repeat: indefinite
   * - Direction: Left → Right
   *
   * Animation is embedded in renderLicenseText() for better performance
   * This method provides API consistency and future extensibility
   */
  private addShimmerAnimation(): void {
    // Animation is embedded in renderLicenseText()
    // Uses a combination of:
    // 1. <animate> on opacity for fade in/out
    // 2. <animateTransform> for horizontal sweep movement
    // 3. Time-based triggers using begin="0s;7s" pattern
  }
}
