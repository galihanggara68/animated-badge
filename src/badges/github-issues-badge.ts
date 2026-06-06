/**
 * GitHub Issues Badge with Slide-in Animation
 *
 * Trigger Rule: Badge loads
 * Animation: Issue counts slide in from bottom (y+5 to y) once
 *
 * Pure SVG implementation using <animateTransform type="translate">
 * Colors: Open (#d73a49), Closed (#28a745)
 */

import { BaseBadge, BadgeConfig } from './base-badge';

export interface GithubIssuesBadgeConfig {
  open: number;
  closed: number;
  label?: string;
}

export class GithubIssuesBadge extends BaseBadge {
  private issuesConfig: GithubIssuesBadgeConfig;

  constructor(config: GithubIssuesBadgeConfig) {
    const label = config.label || 'issues';
    const openText = `${config.open} open`;
    const closedText = `${config.closed} closed`;

    // Estimate widths
    // Character width is approx 6.5px at 11px font size
    const labelWidth = Math.ceil(label.length * 6.5) + 10;
    const openWidth = Math.ceil(openText.length * 6.5) + 12;
    const closedWidth = Math.ceil(closedText.length * 6.5) + 12;
    const totalWidth = labelWidth + openWidth + closedWidth;

    const baseConfig: BadgeConfig = {
      width: totalWidth,
      height: 20,
      viewBox: `0 0 ${totalWidth} 20`,
      title: `GitHub Issues: ${config.open} open, ${config.closed} closed`,
      backgroundColor: 'transparent',
    };
    super(baseConfig);
    this.issuesConfig = {
      ...config,
      label,
    };
  }

  /**
   * Generate GitHub issues badge
   */
  generate(): string {
    this.renderBadgeBackground();
    this.renderIssuesContent();
    return super.generate();
  }

  /**
   * Render badge background with 3 segments
   */
  private renderBadgeBackground(): void {
    const label = this.issuesConfig.label || 'issues';
    const openText = `${this.issuesConfig.open} open`;
    
    const labelWidth = Math.ceil(label.length * 6.5) + 10;
    const openWidth = Math.ceil(openText.length * 6.5) + 12;
    const closedWidth = this.config.width - labelWidth - openWidth;

    // Label background
    this.addRect({
      x: 0,
      y: 0,
      width: labelWidth,
      height: 20,
      fill: '#555',
    });

    // Open issues background
    this.addRect({
      x: labelWidth,
      y: 0,
      width: openWidth,
      height: 20,
      fill: '#d73a49',
    });

    // Closed issues background
    this.addRect({
      x: labelWidth + openWidth,
      y: 0,
      width: closedWidth,
      height: 20,
      fill: '#28a745',
    });
  }

  /**
   * Render text content with slide-in animation
   */
  private renderIssuesContent(): void {
    const label = this.issuesConfig.label || 'issues';
    const openText = `${this.issuesConfig.open} open`;
    const closedText = `${this.issuesConfig.closed} closed`;

    const labelWidth = Math.ceil(label.length * 6.5) + 10;
    const openWidth = Math.ceil(openText.length * 6.5) + 12;

    // Label text (static)
    this.addText({
      x: labelWidth / 2,
      y: 14,
      text: label,
      fill: '#fff',
      textAnchor: 'middle',
    });

    // Open issues text (animated)
    const openTextId = 'open-issues-text';
    this.elements.push(`
      <g id="${openTextId}">
        <text x="${labelWidth + openWidth / 2}" y="14" fill="#fff" font-size="11" font-family="Verdana, Geneva, sans-serif" text-anchor="middle">
          ${this.escapeXml(openText)}
        </text>
      </g>
    `);

    // Closed issues text (animated)
    const closedTextId = 'closed-issues-text';
    const closedX = labelWidth + openWidth + (this.config.width - labelWidth - openWidth) / 2;
    this.elements.push(`
      <g id="${closedTextId}">
        <text x="${closedX}" y="14" fill="#fff" font-size="11" font-family="Verdana, Geneva, sans-serif" text-anchor="middle">
          ${this.escapeXml(closedText)}
        </text>
      </g>
    `);

    // Add slide-in animations
    // From y+5 to y (0,5 to 0,0 in translation)
    this.addTransformAnimation(openTextId, 'translate', {
      dur: '0.6s',
      begin: '0s',
      repeatCount: '1',
      fill: 'freeze'
    }, '0,5; 0,0');

    this.addTransformAnimation(closedTextId, 'translate', {
      dur: '0.6s',
      begin: '0.1s', // Slight delay for staggered effect
      repeatCount: '1',
      fill: 'freeze'
    }, '0,5; 0,0');
    
    // Initial opacity to avoid jump? BaseBadge doesn't have an easy way to set initial state 
    // unless I put it in the element string.
    // Let's add opacity animation too for a smoother entrance.
    this.addOpacityAnimation(openTextId, { dur: '0.4s', repeatCount: '1', fill: 'freeze' }, '0; 1');
    this.addOpacityAnimation(closedTextId, { dur: '0.4s', begin: '0.1s', repeatCount: '1', fill: 'freeze' }, '0; 1');
  }
}
