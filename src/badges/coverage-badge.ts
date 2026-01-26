/**
 * Coverage Badge with Fill Level Animation
 *
 * Trigger Rule: coveragePercentage
 * Animation: Fill Level / Wave effect based on coverage percentage
 *
 * Pure SVG implementation using <animate> on rect height/y
 * Timing: 0.8s - 1.5s duration, fill="freeze", 1x per update
 * Direction: Bottom → Top fill
 */

import { BaseBadge, BadgeConfig } from './base-badge';

export interface CoverageBadgeConfig {
  coveragePercentage: number;
  label?: string;
}

export class CoverageBadge extends BaseBadge {
  private coverageConfig: CoverageBadgeConfig;

  constructor(config: CoverageBadgeConfig) {
    const baseConfig: BadgeConfig = {
      width: 120,
      height: 20,
      viewBox: '0 0 120 20',
      title: `Coverage: ${config.coveragePercentage}%`,
      backgroundColor: 'transparent',
    };
    super(baseConfig);
    this.coverageConfig = config;
  }

  /**
   * Generate coverage badge with fill animation
   */
  generate(): string {
    this.renderBadgeBackground();
    this.renderCoverageText();
    this.addFillAnimation();

    return super.generate();
  }

  /**
   * Render badge background and fill bar
   */
  private renderBadgeBackground(): void {
    // Label background
    this.addRect({
      x: 0,
      y: 0,
      width: 70,
      height: 20,
      fill: '#555',
    });

    // Coverage value background (empty bar)
    this.addRect({
      x: 70,
      y: 0,
      width: 50,
      height: 20,
      fill: '#444',
    });

    // Coverage fill bar (animated)
    const fillHeight = Math.max(2, Math.round((this.coverageConfig.coveragePercentage / 100) * 18));
    const fillColor = this.getCoverageColor();

    this.addGroup('coverage-fill', [
      `<rect id="fill-bar" x="70" y="${20 - fillHeight}" width="50" height="${fillHeight}" fill="${fillColor}" opacity="0.9">
        <animate attributeName="height" from="0" to="${fillHeight}" dur="1.2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
        <animate attributeName="y" from="20" to="${20 - fillHeight}" dur="1.2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
      </rect>`,
    ]);
  }

  /**
   * Get color based on coverage percentage
   */
  private getCoverageColor(): string {
    const coverage = this.coverageConfig.coveragePercentage;
    if (coverage >= 80) return '#2cbe4e'; // Green
    if (coverage >= 60) return '#dbab09'; // Yellow
    if (coverage >= 40) return '#df8e32'; // Orange
    return '#cb2431'; // Red
  }

  /**
   * Render label and coverage percentage text
   */
  private renderCoverageText(): void {
    const label = this.coverageConfig.label || 'coverage';
    const coverageText = `${this.coverageConfig.coveragePercentage}%`;

    // Label text
    this.addText({
      x: 35,
      y: 14,
      text: label,
      fill: '#fff',
      textAnchor: 'middle',
    });

    // Coverage percentage text
    const textColor = this.coverageConfig.coveragePercentage >= 50 ? '#fff' : '#ddd';
    this.addText({
      x: 95,
      y: 14,
      text: coverageText,
      fill: textColor,
      fontWeight: 'bold',
      textAnchor: 'middle',
    });
  }

  /**
   * Add fill animation
   * Uses <animate> on rect height and y attributes
   *
   * Timing Contract:
   * - Duration: 0.8s - 1.5s (using 1.2s as middle ground)
   * - Fill: freeze (animation stays at final state)
   * - Repeat: 1 (one-time animation on update)
   * - Direction: Bottom → Top (y decreases, height increases)
   *
   * The animation is already embedded in renderBadgeBackground()
   * This method is kept for API consistency and future extensions
   */
  private addFillAnimation(): void {
    // Animation is embedded in the rect element in renderBadgeBackground()
    // This provides better performance and simpler code structure
  }
}
