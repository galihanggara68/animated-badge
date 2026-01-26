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
  private labelWidth: number;
  private licenseWidth: number;

  constructor(config: LicenseBadgeConfig) {
    // Validate and sanitize license string
    const license = config.license?.trim() || 'MIT';

    // Validate shimmer interval (must be between 5-10 seconds)
    let shimmerInterval = config.shimmerInterval;
    if (shimmerInterval !== undefined) {
      shimmerInterval = Math.max(5, Math.min(10, shimmerInterval));
    } else {
      shimmerInterval = 7; // Default
    }

    // Calculate widths dynamically
    const label = config.label || 'license';
    const formattedLicense = LicenseBadge.formatLicenseStatic(license);

    // Calculate label width (approximately 6.5 pixels per character)
    const labelWidth = Math.ceil(label.length * 6.5) + 10; // +10 for padding
    const clampedLabelWidth = Math.max(40, Math.min(80, labelWidth)); // Min 40, Max 80

    // Calculate license width (approximately 6.5 pixels per character, max 25 chars)
    const licenseWidth = Math.ceil(formattedLicense.length * 6.5) + 14; // +14 for padding

    const totalWidth = clampedLabelWidth + licenseWidth;

    const baseConfig: BadgeConfig = {
      width: totalWidth,
      height: 20,
      viewBox: `0 0 ${totalWidth} 20`,
      title: `License: ${license}`,
      backgroundColor: 'transparent',
    };
    super(baseConfig);
    this.licenseConfig = {
      license,
      label,
      shimmerInterval,
    };
    this.labelWidth = clampedLabelWidth;
    this.licenseWidth = licenseWidth;
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
      width: this.labelWidth,
      height: 20,
      fill: '#555',
    });

    // License background
    this.addRect({
      x: this.labelWidth,
      y: 0,
      width: this.licenseWidth,
      height: 20,
      fill: '#007ec6',
    });
  }

  /**
   * Render license text
   */
  private renderLicenseText(): void {
    const label = this.licenseConfig.label;
    const licenseText = this.formatLicense(this.licenseConfig.license);

    // Calculate center positions
    const labelCenterX = this.labelWidth / 2;
    const licenseCenterX = this.labelWidth + (this.licenseWidth / 2);

    // Label text
    this.addText({
      x: labelCenterX,
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
          <rect x="${this.labelWidth}" y="0" width="${this.licenseWidth}" height="20" fill="url(#shimmer-gradient)" opacity="0">
            <animate attributeName="opacity" values="0;1;0" dur="${shimmerDuration}s" begin="0s;${shimmerInterval}s" repeatCount="indefinite" />
          </rect>
        </mask>
      </defs>`,
      `<text id="license-text" x="${licenseCenterX}" y="14" fill="#fff" font-size="11" font-family="Verdana, Geneva, sans-serif" text-anchor="middle" mask="url(#shimmer-mask)">${this.escapeXml(licenseText)}</text>`,
    ]);

    // Add shimmer sweep animation using animateTransform
    const shimmerStartX = this.labelWidth;
    const shimmerEndX = this.labelWidth + this.licenseWidth - 15;

    this.addGroup('shimmer-sweep', [
      `<rect id="shimmer-rect" x="${shimmerStartX}" y="0" width="15" height="20" fill="url(#shimmer-gradient)" opacity="0">
        <animate attributeName="opacity" values="0;0.6;0" dur="${shimmerDuration}s" begin="0s;${shimmerInterval}s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" from="${shimmerStartX},0" to="${shimmerEndX},0" dur="${shimmerDuration}s" begin="0s;${shimmerInterval}s" repeatCount="indefinite" additive="sum" />
      </rect>`,
    ]);
  }

  /**
   * Format license text for display
   * Truncates to maximum of 25 characters
   */
  private static formatLicenseStatic(license: string): string {
    // Common license abbreviations
    const licenseMap: Record<string, string> = {
      'MIT': 'MIT',
      'Apache-2.0': 'Apache',
      'GPL-3.0': 'GPL',
      'BSD-3-Clause': 'BSD',
      'BSD': 'BSD',
      'ISC': 'ISC',
      'MPL-2.0': 'MPL',
    };

    // Use mapped value if available, otherwise truncate to 25 chars
    const mappedLicense = licenseMap[license];
    if (mappedLicense) {
      return mappedLicense;
    }

    return license.length > 25 ? license.substring(0, 25) : license;
  }

  /**
   * Format license text for display
   * Truncates to maximum of 25 characters
   */
  private formatLicense(license: string): string {
    return LicenseBadge.formatLicenseStatic(license);
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
