/**
 * Build Status Badge with Pulse Animation
 *
 * Trigger Rule: status == success
 * Animation: Pulse / Glow effect on success status
 *
 * Pure SVG implementation using <animate> for opacity
 * Timing: 1.2s - 1.8s duration, indefinite repeat
 * Phase: 1 → 0.6 → 1 (opacity)
 */

import { BaseBadge, BadgeConfig, AnimationTiming } from './base-badge';

export type BuildStatus = 'success' | 'failed' | 'pending' | 'running';

export interface BuildStatusBadgeConfig {
  status: BuildStatus;
  label?: string;
  message?: string;
}

export class BuildStatusBadge extends BaseBadge {
  private statusConfig: BuildStatusBadgeConfig;

  constructor(config: BuildStatusBadgeConfig) {
    const baseConfig: BadgeConfig = {
      width: 120,
      height: 20,
      viewBox: '0 0 120 20',
      title: `Build Status: ${config.status}`,
      backgroundColor: 'transparent',
    };
    super(baseConfig);
    this.statusConfig = config;
  }

  /**
   * Generate build status badge with optional pulse animation
   */
  generate(): string {
    this.renderBadgeBackground();
    this.renderStatusText();

    // Only add pulse animation for success status
    if (this.statusConfig.status === 'success') {
      this.addPulseAnimation();
    }

    return super.generate();
  }

  /**
   * Render badge background with status color
   */
  private renderBadgeBackground(): void {
    const colors = {
      success: '#2cbe4e',
      failed: '#cb2431',
      pending: '#dbab09',
      running: '#0366d6',
    };

    const statusColor = colors[this.statusConfig.status];

    // Label background (left side)
    this.addRect({
      x: 0,
      y: 0,
      width: 70,
      height: 20,
      fill: '#555',
    });

    // Status background (right side)
    this.addRect({
      x: 70,
      y: 0,
      width: 50,
      height: 20,
      fill: statusColor,
    });

    // Add status circle for animation target
    if (this.statusConfig.status === 'success') {
      this.addGroup('status-circle', [
        `<circle id="pulse-circle" cx="95" cy="10" r="6" fill="#2cbe4e" opacity="0.6" />`,
      ]);
    }
  }

  /**
   * Render label and status text
   */
  private renderStatusText(): void {
    const label = this.statusConfig.label || 'build';
    const statusMessages = {
      success: 'passing',
      failed: 'failing',
      pending: 'pending',
      running: 'running',
    };

    const message = this.statusConfig.message || statusMessages[this.statusConfig.status];

    // Label text
    this.addText({
      x: 35,
      y: 14,
      text: label,
      fill: '#fff',
      textAnchor: 'middle',
    });

    // Status text
    this.addText({
      x: 95,
      y: 14,
      text: message,
      fill: '#fff',
      textAnchor: 'middle',
    });
  }

  /**
   * Add pulse animation for success status
   * Uses <animate> on opacity attribute
   *
   * Timing Contract:
   * - Duration: 1.2s - 1.8s (using 1.5s as middle ground)
   * - Repeat: indefinite
   * - Phase: 1 → 0.6 → 1
   */
  private addPulseAnimation(): void {
    const timing: AnimationTiming = {
      dur: '1.5s',
      repeatCount: 'indefinite',
    };

    // Animate opacity: 0.6 → 1 → 0.6
    this.addOpacityAnimation('pulse-circle', timing, '0.6;1;0.6');
  }
}
