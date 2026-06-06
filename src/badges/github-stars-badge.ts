/**
 * GitHub Stars Badge with Pulsing Animation
 *
 * Trigger Rule: Badge loads
 * Animation: Star icon pulses (scales 1 -> 1.2 -> 1) once
 *
 * Pure SVG implementation using <animateTransform type="scale">
 * Timing: 0.8s duration, 1x on load
 * Colors: GitHub-standard colors (#dfb317 for star background)
 */

import { BaseBadge, BadgeConfig } from './base-badge';

export interface GithubStarsBadgeConfig {
  stars: number | string;
  label?: string;
}

export class GitHubStarsBadge extends BaseBadge {
  private starsConfig: GithubStarsBadgeConfig;

  constructor(config: GithubStarsBadgeConfig) {
    const label = config.label || 'stars';
    const stars = String(config.stars);
    
    // Estimate width: 
    // label "stars" is about 40px
    // count + icon: icon is 14px, count is about 7px per char + padding
    const labelWidth = 40;
    const valuePadding = 20; // for icon and spacing
    const valueWidth = Math.max(40, stars.length * 7 + valuePadding);
    const totalWidth = labelWidth + valueWidth;

    const baseConfig: BadgeConfig = {
      width: totalWidth,
      height: 20,
      viewBox: `0 0 ${totalWidth} 20`,
      title: `GitHub Stars: ${stars}`,
      backgroundColor: 'transparent',
    };
    super(baseConfig);
    this.starsConfig = {
      stars,
      label,
    };
  }

  /**
   * Generate GitHub stars badge with pulsing animation
   */
  generate(): string {
    this.renderBadgeBackground();
    this.renderStarsContent();
    return super.generate();
  }

  /**
   * Render badge background
   */
  private renderBadgeBackground(): void {
    const labelWidth = 40;
    const valueWidth = this.config.width - labelWidth;

    // Label background
    this.addRect({
      x: 0,
      y: 0,
      width: labelWidth,
      height: 20,
      fill: '#555',
    });

    // Stars count background
    this.addRect({
      x: labelWidth,
      y: 0,
      width: valueWidth,
      height: 20,
      fill: '#dfb317',
    });
  }

  /**
   * Render stars label, icon and count
   */
  private renderStarsContent(): void {
    const label = this.starsConfig.label || 'stars';
    const stars = this.starsConfig.stars;
    const labelWidth = 40;
    const valueWidth = this.config.width - labelWidth;

    // Label text
    this.addText({
      x: labelWidth / 2,
      y: 14,
      text: label,
      fill: '#fff',
      textAnchor: 'middle',
    });

    // Star icon path (12x12)
    // Centered vertically at y=10. x starts at labelWidth + 6
    const starPath = "M6 0L7.714 3.473L11.541 4.027L8.77 6.727L9.425 10.545L6 8.745L2.575 10.545L3.23 6.727L0.459 4.027L4.286 3.473L6 0Z";
    
    const iconX = labelWidth + 6;
    const iconY = 5;
    const halfWidth = 6;
    const halfHeight = 5.27;
    const cx = iconX + halfWidth;
    const cy = iconY + halfHeight;

    // Add "laser sparks" shooting from the center
    const laserCount = 8;
    for (let i = 0; i < laserCount; i++) {
      const angle = i * (360 / laserCount);
      const laserId = `laser-${i}`;
      const begin = `${(i % 4) * 0.2}s`; // Staggered start

      this.elements.push(`
        <g transform="translate(${cx}, ${cy}) rotate(${angle})">
          <line id="${laserId}" x1="0" y1="0" x2="0" y2="0" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity="0" />
        </g>
      `);

      // Animate the line "shooting" out by moving both ends
      this.addAttributeAnimation(laserId, 'x1', {
        dur: '0.8s',
        repeatCount: 'indefinite',
        begin: begin
      }, '2; 10');

      this.addAttributeAnimation(laserId, 'x2', {
        dur: '0.8s',
        repeatCount: 'indefinite',
        begin: begin
      }, '6; 14');

      // Fade in and out
      this.addOpacityAnimation(laserId, {
        dur: '0.8s',
        repeatCount: 'indefinite',
        begin: begin
      }, '0; 1; 0');
    }

    this.elements.push(`
      <g transform="translate(${cx}, ${cy})">
        <g id="star-pulse">
          <path d="${starPath}" fill="#fff" transform="translate(-${halfWidth}, -${halfHeight})" />
        </g>
      </g>
    `);
    
    // Continuous pulse animation
    this.addTransformAnimation('star-pulse', 'scale', {
      dur: '2s',
      repeatCount: 'indefinite',
    }, '1; 1.15; 1');

    this.addText({
      x: labelWidth + 20,
      y: 14,
      text: String(stars),
      fill: '#fff',
      textAnchor: 'start',
    });
  }
}
