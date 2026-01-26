/**
 * Build Status Badge with Status-Based Animations
 *
 * Trigger Rule: All statuses have animations
 * - Success: Checkmark drawing animation (stroke-dashoffset)
 * - Failed: Text shaking animation (animateTransform)
 * - Pending: Three dots loading animation (staggered opacity)
 * - Running: Animated stripes pattern (pattern translation)
 *
 * Pure SVG implementation using <animate> and <animateTransform>
 * Timing: Varies by status (0.2s - 1.5s duration, indefinite repeat)
 */

import { BaseBadge, BadgeConfig } from './base-badge';

export type BuildStatus = 'success' | 'failed' | 'pending' | 'running';

export interface BuildStatusBadgeConfig {
  status: BuildStatus;
  label?: string;
  message?: string;
}

export class BuildStatusBadge extends BaseBadge {
  private statusConfig: BuildStatusBadgeConfig;

  constructor(config: BuildStatusBadgeConfig) {
    // Validate and sanitize status
    const validStatuses: BuildStatus[] = ['success', 'failed', 'pending', 'running'];
    const status = config.status && validStatuses.includes(config.status)
      ? config.status
      : 'success'; // Default fallback

    const baseConfig: BadgeConfig = {
      width: 120,
      height: 20,
      viewBox: '0 0 120 20',
      title: `Build Status: ${status}`,
      backgroundColor: 'transparent',
    };
    super(baseConfig);
    this.statusConfig = {
      ...config,
      status,
    };
  }

  /**
   * Generate build status badge with status animations
   */
  generate(): string {
    this.renderBadgeBackground();
    this.renderStatusText();

    // Add appropriate animation based on status
    this.addStatusAnimation();

    return super.generate();
  }

  /**
   * Render badge background with status color
   */
  private renderBadgeBackground(): void {
    const colors = {
      success: '#28a745',
      failed: '#cb2431',
      pending: '#dfb317',
      running: '#007bff',
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
  }

  /**
   * Render label and status text with appropriate animations
   */
  private renderStatusText(): void {
    const label = this.statusConfig.label || 'build';
    const statusMessages = {
      success: 'pass',
      failed: 'failing',
      pending: 'pending',
      running: 'running',
    };

    const message = this.statusConfig.message || statusMessages[this.statusConfig.status];
    const status = this.statusConfig.status;

    // Label text
    this.addText({
      x: 35,
      y: 14,
      text: label,
      fill: '#fff',
      textAnchor: 'middle',
    });

    // Status text with appropriate animation based on status
    if (status === 'failed') {
      // Failed: Shake animation
      this.addGroup('failing-text', [
        `<text x="95" y="14" fill="#fff" font-size="11" font-family="Verdana, Geneva, sans-serif" text-anchor="middle">${this.escapeXml(message)}</text>`,
        `<animateTransform attributeName="transform" type="translate" values="0,0; -2,0; 2,0; 0,0" dur="0.2s" repeatCount="indefinite" />`,
      ]);
    } else if (status === 'success') {
      // Success: Checkmark animation + text
      // Status text
      this.addText({
        x: 98,
        y: 14,
        text: message,
        fill: '#fff',
        textAnchor: 'middle',
      });

      // Checkmark with drawing animation
      this.addGroup('checkmark', [
        `<path d="M75 10 l3 3 l5 -7" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`,
        `<animate attributeName="stroke-dashoffset" from="20" to="1" dur="1.5s" fill="freeze" repeatCount="indefinite"/>`,
        `<set attributeName="stroke-dasharray" to="20" />`,
        `</path>`,
      ]);
    } else if (status === 'running') {
      // Running: Animated stripes + text
      this.addGroup('stripes-pattern', [
        `<defs>
          <pattern id="stripes" x="0" y="0" width="10" height="20" patternUnits="userSpaceOnUse">
            <path d="M-3,20 l10,-20 M2,20 l10,-20 M7,20 l10,-20" stroke="rgba(255,255,255,0.3)" stroke-width="3" />
          </pattern>
        </defs>`,
        `<rect x="70" y="0" width="50" height="20" fill="url(#stripes)">
          <animate attributeName="x" from="0" to="20" dur="1.5s" repeatCount="indefinite" />
        </rect>`,
      ]);

      // Status text
      this.addText({
        x: 95,
        y: 14,
        text: message,
        fill: '#fff',
        textAnchor: 'middle',
      });
    } else if (status === 'pending') {
      // Pending: Three loading dots + text
      // Status text
      this.addText({
        x: 95,
        y: 14,
        text: message,
        fill: '#fff',
        textAnchor: 'middle',
      });

      // Three dots with staggered fade animations
      this.addGroup('loading-dots', [
        `<circle cx="85" cy="10" r="2" fill="#fff">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0s" />
        </circle>`,
        `<circle cx="95" cy="10" r="2" fill="#fff">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0.2s" />
        </circle>`,
        `<circle cx="105" cy="10" r="2" fill="#fff">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0.4s" />
        </circle>`,
      ]);
    }
  }

  /**
   * Add appropriate animation based on status
   * Animations are now handled in renderStatusText()
   */
  private addStatusAnimation(): void {
    // Animations are embedded in renderStatusText() for better control
  }
}
