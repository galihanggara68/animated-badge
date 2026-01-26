/**
 * Coverage Badge with Liquid Fill Animation
 *
 * Trigger Rule: coveragePercentage
 * Animation: Liquid fill with wave effect based on coverage percentage
 *
 * Pure SVG implementation using <animate> and <animateTransform>
 * - Rising fill: 1.5s duration, fill="freeze", calcMode="spline" for smooth easing
 * - Wave motion: indefinite animation for continuous wave effect
 * Direction: Bottom → Top fill with wave motion
 */

import { BaseBadge, BadgeConfig } from './base-badge';

export interface CoverageBadgeConfig {
  coveragePercentage: number;
  label?: string;
}

export class CoverageBadge extends BaseBadge {
  private coverageConfig: CoverageBadgeConfig;

  constructor(config: CoverageBadgeConfig) {
    // Validate and sanitize coverage percentage
    let coverage = config.coveragePercentage;
    if (typeof coverage !== 'number' || isNaN(coverage)) {
      coverage = 0;
    }
    coverage = Math.max(0, Math.min(100, coverage)); // Clamp between 0-100

    const baseConfig: BadgeConfig = {
      width: 120,
      height: 20,
      viewBox: '0 0 120 20',
      title: `Coverage: ${coverage}%`,
      backgroundColor: 'transparent',
    };
    super(baseConfig);
    this.coverageConfig = {
      coveragePercentage: coverage,
      label: config.label,
    };
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
   * Render badge background and liquid fill animation
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

    // Calculate fill height and colors
    const fillHeight = Math.max(2, Math.round((this.coverageConfig.coveragePercentage / 100) * 18));
    const colors = this.getCoverageColors();

    // Add clip path for the bar area
    this.elements.push(`<defs><clipPath id="bar-clip"><rect x="70" y="3" width="50" height="17" /></clipPath></defs>`);

    // Liquid fill animation with wave effect
    const waveOffset = this.getWaveOffset(fillHeight);

    // Background wave (lighter, lower opacity)
    const backWave = `<path fill="${colors.lightColor}" opacity="0.6">
      <animateTransform attributeName="transform" type="translate" from="0 20" to="0 ${waveOffset.backWave}" dur="1.5s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      <animate attributeName="d" dur="2.5s" repeatCount="indefinite" values="M70 10 Q 82.5 13, 95 10 T 120 10 V 30 H 70 Z; M70 10 Q 82.5 7, 95 10 T 120 10 V 30 H 70 Z; M70 10 Q 82.5 13, 95 10 T 120 10 V 30 H 70 Z" />
    </path>`;

    // Front wave (darker, higher opacity)
    const frontWave = `<path fill="${colors.mainColor}" opacity="0.9">
      <animateTransform attributeName="transform" type="translate" from="0 20" to="0 ${waveOffset.frontWave}" dur="1.5s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      <animate attributeName="d" dur="1.8s" repeatCount="indefinite" values="M70 10 Q 82.5 7, 95 10 T 120 10 V 30 H 70 Z; M70 10 Q 82.5 13, 95 10 T 120 10 V 30 H 70 Z; M70 10 Q 82.5 7, 95 10 T 120 10 V 30 H 70 Z" />
    </path>`;

    this.addGroup('coverage-fill', [backWave, frontWave], 'clip-path="url(#bar-clip)"');
  }

  /**
   * Get color based on coverage percentage
   * Red (Critical): 0% – 40% (Color: #d73a49)
   * Yellow (Warning): 41% – 80% (Color: #ffd33d)
   * Green (Healthy): 81% – 100% (Color: #2cbe4e)
   */
  private getCoverageColors(): { mainColor: string; lightColor: string } {
    const coverage = this.coverageConfig.coveragePercentage;

    if (coverage >= 81) {
      // Green (Healthy): 81% – 100%
      return { mainColor: '#2cbe4e', lightColor: '#36d058' };
    } else if (coverage >= 41) {
      // Yellow (Warning): 41% – 80%
      return { mainColor: '#ffd33d', lightColor: '#fff1b8' };
    } else {
      // Red (Critical): 0% – 40%
      return { mainColor: '#d73a49', lightColor: '#ff6b6b' };
    }
  }

  /**
   * Calculate wave offset based on fill height
   * Ensures the waves rise to the correct level based on coverage
   */
  private getWaveOffset(fillHeight: number): { backWave: number; frontWave: number } {
    const finalY = 20 - fillHeight - 10;

    // Calculate wave positions based on fill level
    // The waves should be offset to create a layered effect
    return {
      backWave: finalY + 2,  // Background wave is slightly higher
      frontWave: finalY + 3, // Front wave is slightly higher than back
    };
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
   * Add liquid fill animation
   * Uses <animateTransform> for rising effect and <animate> for wave motion
   *
   * Timing Contract:
   * - Rising Duration: 1.5s with smooth easing (calcMode="spline")
   * - Fill: freeze (animation stays at final state for rising)
   * - Wave Motion: indefinite (continuous wave animation)
   * - Direction: Bottom → Top with layered wave effect
   *
   * The animation is already embedded in renderBadgeBackground()
   * This method is kept for API consistency and future extensions
   */
  private addFillAnimation(): void {
    // Animation is embedded in the wave paths in renderBadgeBackground()
    // This provides better performance and cleaner code structure
  }
}
