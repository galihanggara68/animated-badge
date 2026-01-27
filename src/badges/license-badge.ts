/**
 * License Badge with Shimmer/Glint Animation
 *
 * Animation: Continuous shimmer sweep effect across the entire badge
 *
 * Pure SVG implementation using <animateTransform> on a gradient rectangle
 * Timing: 3s duration, continuous repeat (indefinite)
 * Direction: Left → Right
 */

import { BaseBadge, BadgeConfig, AnimationTiming } from './base-badge';

export interface LicenseBadgeConfig {
  license: string;
  label?: string;
}

export class LicenseBadge extends BaseBadge {
  private licenseConfig: LicenseBadgeConfig;
  private labelWidth: number;
  private licenseWidth: number;

  constructor(config: LicenseBadgeConfig) {
    // Validate and sanitize license string
    const license = config.license?.trim() || 'MIT';

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

    // License text
    this.addText({
      x: licenseCenterX,
      y: 14,
      text: licenseText,
      fill: '#fff',
      textAnchor: 'middle',
    });
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
   * Uses <animateTransform> for left-to-right sweep across the entire badge
   * Simpler approach using a sweeping gradient rectangle
   *
   * Timing Contract:
   * - Duration: 3s (continuous animation)
   * - Repeat: indefinite
   * - Direction: Left → Right
   */
  private addShimmerAnimation(): void {
    const shimmerWidth = 30;
    const shimmerDuration = 3;
    const totalWidth = this.labelWidth + this.licenseWidth;

    // Add shimmer gradient definition and animation
    this.addGroup('shimmer-container', [
      `<defs>
        <linearGradient id="shimmer-gradient" x1="0%" y1="10%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#fff" stop-opacity="0"/>
          <stop offset="50%" stop-color="#fff" stop-opacity=".4"/>
          <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
      </defs>`,
      `<rect x="0" y="0" width="${shimmerWidth}" height="20" fill="url(#shimmer-gradient)">
        <animateTransform
          attributeName="transform"
          type="translate"
          from="-${shimmerWidth},0"
          to="${totalWidth},0"
          dur="${shimmerDuration}s"
          begin="0s"
          repeatCount="indefinite"/>
      </rect>`,
    ]);
  }
}
