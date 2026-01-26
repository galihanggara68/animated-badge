/**
 * Version Badge with Scroll Animation
 *
 * Trigger Rule: version changes
 * Animation: Odometer / Scroll effect when version changes
 *
 * Pure SVG implementation using <animateTransform type="translate">
 * Timing: 0.6s - 1.2s duration, fill="freeze", 1x per change
 * Direction: Vertical scroll
 */

import { BaseBadge, BadgeConfig, AnimationTiming } from './base-badge';

export interface VersionBadgeConfig {
  version: string;
  previousVersion?: string;
  label?: string;
}

export class VersionBadge extends BaseBadge {
  private versionConfig: VersionBadgeConfig;

  constructor(config: VersionBadgeConfig) {
    const baseConfig: BadgeConfig = {
      width: 110,
      height: 20,
      viewBox: '0 0 110 20',
      title: `Version: ${config.version}`,
      backgroundColor: 'transparent',
    };
    super(baseConfig);
    this.versionConfig = config;
  }

  /**
   * Generate version badge with optional scroll animation
   */
  generate(): string {
    this.renderBadgeBackground();
    this.renderVersionText();

    // Only add scroll animation if version changed
    if (this.shouldAnimate()) {
      this.addScrollAnimation();
    }

    return super.generate();
  }

  /**
   * Check if version has changed and should animate
   */
  private shouldAnimate(): boolean {
    return !!(
      this.versionConfig.previousVersion &&
      this.versionConfig.version !== this.versionConfig.previousVersion
    );
  }

  /**
   * Render badge background
   */
  private renderBadgeBackground(): void {
    // Label background
    this.addRect({
      x: 0,
      y: 0,
      width: 60,
      height: 20,
      fill: '#555',
    });

    // Version background
    this.addRect({
      x: 60,
      y: 0,
      width: 50,
      height: 20,
      fill: '#0366d6',
    });
  }

  /**
   * Render version text with stacked digits for animation
   */
  private renderVersionText(): void {
    const label = this.versionConfig.label || 'version';

    // Label text
    this.addText({
      x: 30,
      y: 14,
      text: label,
      fill: '#fff',
      textAnchor: 'middle',
    });

    // Version text container with clip path
    const versionText = this.formatVersion(this.versionConfig.version);
    const previousVersionText = this.versionConfig.previousVersion
      ? this.formatVersion(this.versionConfig.previousVersion)
      : versionText;

    // Create stacked text for scroll effect
    // Position: OLD (previous) at y=14 (visible initially), NEW (current) at y=34 (below, hidden initially)
    // With clipPath y=0 to y=20:
    // - At start (translate 0,0): OLD at y=14 is visible, NEW at y=34 is hidden below
    // - At end (translate 0,-20): OLD at y=14-20=-6 is hidden above, NEW at y=34-20=14 is visible
    this.addGroup('version-container', [
      `<defs>
        <clipPath id="version-clip">
          <rect x="60" y="0" width="50" height="20" />
        </clipPath>
      </defs>`,
      `<g clip-path="url(#version-clip)">`,
      `  <g id="version-scroller">`,
      `     <text x="85" y="14" fill="#fff" font-size="11" font-family="Verdana, Geneva, sans-serif" text-anchor="middle">${this.escapeXml(previousVersionText)}</text>`,
      `     <text x="85" y="34" fill="#fff" font-size="11" font-family="Verdana, Geneva, sans-serif" text-anchor="middle">${this.escapeXml(versionText)}</text>`,
      `  </g>`,
      `</g>`,
    ]);
  }

  /**
   * Format version string for display
   */
  private formatVersion(version: string): string {
    // Remove 'v' prefix if present, truncate if too long
    const cleaned = version.replace(/^v/i, '');
    return cleaned.length > 8 ? cleaned.substring(0, 8) + '+' : cleaned;
  }

  /**
   * Add scroll animation for version change
   * Uses <animateTransform type="translate"> for vertical scroll
   *
   * Timing Contract:
   * - Duration: 0.6s - 1.2s (using 0.9s as middle ground)
   * - Fill: freeze (animation stays at final state)
   * - Repeat: 1 (one-time animation on version change)
   * - Direction: Vertical (translate Y axis)
   */
  private addScrollAnimation(): void {
    const timing: AnimationTiming = {
      dur: '0.9s',
      repeatCount: '1',
      fill: 'freeze',
    };

    // Scroll effect: translate from 0,0 to 0,-20
    // Start: previous at y=14 visible, current at y=34 hidden
    // End: previous at y=14-20=-6 hidden, current at y=34-20=14 visible
    this.addTransformAnimation('version-scroller', 'translate', timing, '0,0;0,-20');
  }
}
