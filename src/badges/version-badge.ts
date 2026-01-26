/**
 * Version Badge with Slot Machine Animation
 *
 * Trigger Rule: version changes
 * Animation: Slot machine reel effect for each version component
 *
 * Pure SVG implementation using <animateTransform type="translate">
 * Timing: 1.8s - 2.2s duration, fill="freeze", 1x per change
 * Direction: Vertical spin with blur effect
 */

import { BaseBadge, BadgeConfig } from './base-badge';

export interface VersionBadgeConfig {
  version: string;
  previousVersion?: string;
  label?: string;
}

export class VersionBadge extends BaseBadge {
  private versionConfig: VersionBadgeConfig;

  constructor(config: VersionBadgeConfig) {
    // Validate and sanitize version string
    const version = config.version?.trim() || '0.0.0';
    const previousVersion = config.previousVersion?.trim() || '0.0.0';

    // Calculate width based on version length
    const isTextVersion = VersionBadge.hasTextSuffix(version);
    const versionWidth = VersionBadge.calculateVersionWidth(version, isTextVersion);
    const totalWidth = 60 + versionWidth;

    const baseConfig: BadgeConfig = {
      width: totalWidth,
      height: 20,
      viewBox: `0 0 ${totalWidth} 20`,
      title: `Version: ${version}`,
      backgroundColor: 'transparent',
    };
    super(baseConfig);
    this.versionConfig = {
      version,
      previousVersion,
      label: config.label,
    };
  }

  /**
   * Generate version badge with slot machine animation
   */
  generate(): string {
    this.renderBadgeBackground();
    this.renderVersionText();

    // Add slot machine animation
    if (this.shouldAnimate()) {
      this.addSlotMachineAnimation();
    }

    return super.generate();
  }

  /**
   * Check if version has changed and should animate
   */
  private shouldAnimate(): boolean {
    return this.versionConfig.version !== this.versionConfig.previousVersion!;
  }

  /**
   * Render badge background
   */
  private renderBadgeBackground(): void {
    const versionWidth = this.config.width - 60;

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
      width: versionWidth,
      height: 20,
      fill: '#0366d6',
    });

    // Connector rect (for rounded corner appearance)
    this.addRect({
      x: 60,
      y: 0,
      width: 5,
      height: 20,
      fill: '#0366d6',
    });
  }

  /**
   * Render version text with slot machine reels
   */
  private renderVersionText(): void {
    const label = this.versionConfig.label || 'version';
    const version = this.versionConfig.version;
    const previousVersion = this.versionConfig.previousVersion!;
    const isTextVersion = VersionBadge.hasTextSuffix(version);
    const versionWidth = this.config.width - 60;

    // Label text
    this.addText({
      x: 30,
      y: 14,
      text: label,
      fill: '#fff',
      textAnchor: 'middle',
    });

    // Create clip path and blur filter
    const clipPathId = 'version-clip';
    this.addGroup('version-container', [
      `<defs>
        <clipPath id="${clipPathId}">
          <rect x="60" y="0" width="${versionWidth}" height="20"/>
        </clipPath>
        <filter id="blurFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0,0">
            <animate attributeName="stdDeviation"
              values="0,0; 0,0; 0,2; 0,0"
              keyTimes="0; 0.4; 0.7; 1"
              dur="2s" begin="0.01s" fill="freeze" />
          </feGaussianBlur>
        </filter>
      </defs>`,
      `<g clip-path="url(#${clipPathId})" text-anchor="middle" filter="url(#blurFilter)">`,
      `  ${this.generateVersionContent(version, previousVersion, isTextVersion, versionWidth)}`,
      `</g>`,
    ]);
  }

  /**
   * Parse version string into components
   */
  private parseVersion(version: string): { major: string; minor: string; patch: string } {
    // Remove 'v' prefix and any suffix
    const cleaned = version.replace(/^v/i, '').split(/[-+]/)[0];

    // Split by dots and get components
    const parts = cleaned.split('.');

    // Handle different version formats (e.g., "1.2", "1.2.3", "1.2.3.4")
    const major = parts[0] || '0';
    const minor = parts[1] || '0';
    const patch = parts[2] || '0';

    return { major, minor, patch };
  }

  /**
   * Check if version has text suffix (alpha, beta, rc, etc.)
   */
  private static hasTextSuffix(version: string): boolean {
    const cleaned = version.replace(/^v/i, '');
    return /[-+][a-zA-Z]/.test(cleaned);
  }

  /**
   * Calculate version display width
   */
  private static calculateVersionWidth(version: string, isTextVersion: boolean): number {
    if (isTextVersion) {
      // For text versions, estimate based on character count
      // Each character is approximately 6.5 pixels wide at 11px font
      const charWidth = 6.5;
      const padding = 10;
      return Math.max(50, Math.ceil(version.length * charWidth + padding));
    } else {
      // For numeric versions, fixed width for X.X.X format
      return 50;
    }
  }

  /**
   * Generate version content based on type
   */
  private generateVersionContent(
    version: string,
    previousVersion: string,
    isTextVersion: boolean,
    versionWidth: number
  ): string {
    if (isTextVersion) {
      // Single reel for text versions
      const centerX = 60 + versionWidth / 2;
      return `<g id="reel-single">${this.generateSingleReelHTML(version, previousVersion, centerX)}</g>`;
    } else {
      // Three reels for numeric versions
      const currentVersion = this.parseVersion(version);
      const previousVersionParsed = this.parseVersion(previousVersion);
      return `
        <g id="reel-major">${this.generateReelHTML(currentVersion.major, previousVersionParsed.major)}</g>
        <text x="75" y="14" fill="#fff" font-size="11" font-family="Verdana,Geneva,sans-serif">.</text>
        <g id="reel-minor">${this.generateReelHTML(currentVersion.minor, previousVersionParsed.minor)}</g>
        <text x="90" y="14" fill="#fff" font-size="11" font-family="Verdana,Geneva,sans-serif">.</text>
        <g id="reel-patch">${this.generateReelHTML(currentVersion.patch, previousVersionParsed.patch)}</g>
      `;
    }
  }

  /**
   * Generate single reel HTML for text versions
   */
  private generateSingleReelHTML(currentValue: string, previousValue: string, centerX: number): string {
    const values = this.generateTextReelValues(previousValue, currentValue);

    let html = '';
    values.forEach((value, index) => {
      html += `<text x="${centerX}" y="${14 + index * 20}" fill="#fff" font-size="11" font-family="Verdana,Geneva,sans-serif">${this.escapeXml(value)}</text>`;
    });

    return html;
  }

  /**
   * Generate sequence of text values for reel
   */
  private generateTextReelValues(startValue: string, endValue: string): string[] {
    const values: string[] = [];
    const numValues = 5;

    // Prefixes to create variety
    const prefixes = ['alpha', 'beta', 'rc', 'stable', 'hotfix'];
    const suffixes = ['', '1', '2', '3', '-test'];

    for (let i = 0; i < numValues; i++) {
      let value: string;
      if (i === 0) {
        value = startValue;
      } else if (i === numValues - 1) {
        value = endValue;
      } else {
        // Generate random-looking version strings
        const baseNum = `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`;
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        value = `${baseNum}-${prefix}${suffix}`;
      }
      values.push(value);
    }

    return values;
  }

  /**
   * Generate reel HTML with multiple values for slot machine effect
   */
  private generateReelHTML(currentValue: string, previousValue: string): string {
    // Generate intermediate values for the spinning effect
    const values = this.generateReelValues(previousValue, currentValue);

    // Create text elements stacked vertically with proper styling
    let html = '';
    values.forEach((value, index) => {
      html += `<text y="${14 + index * 20}" fill="#fff" font-size="11" font-family="Verdana,Geneva,sans-serif">${value}</text>`;
    });

    return html;
  }

  /**
   * Generate sequence of values for slot machine reel
   */
  private generateReelValues(startValue: string, endValue: string): string[] {
    const startNum = parseInt(startValue, 10) || 0;
    const endNum = parseInt(endValue, 10) || 0;

    // Generate 5 values including start and end
    const values: string[] = [];
    const numValues = 5;

    for (let i = 0; i < numValues; i++) {
      let value: number;
      if (i === 0) {
        value = startNum;
      } else if (i === numValues - 1) {
        value = endNum;
      } else {
        // Random intermediate values
        value = Math.floor(Math.random() * 10);
      }
      values.push(value.toString());
    }

    return values;
  }

  /**
   * Add slot machine animation to each reel
   */
  private addSlotMachineAnimation(): void {
    const version = this.versionConfig.version;
    const previousVersion = this.versionConfig.previousVersion!;
    const isTextVersion = VersionBadge.hasTextSuffix(version);
    const versionWidth = this.config.width - 60;

    if (isTextVersion) {
      // Single reel animation for text versions
      const centerX = 60 + versionWidth / 2;
      this.animateSingleReel('reel-single', version, previousVersion, centerX, 2.0);
    } else {
      // Three reel animations for numeric versions
      const currentVersion = this.parseVersion(version);
      const previousVersionParsed = this.parseVersion(previousVersion);

      // Animate major reel (leftmost)
      this.animateReel('reel-major', currentVersion.major, previousVersionParsed.major, 68, 2.0, 0.5);

      // Animate minor reel (middle)
      this.animateReel('reel-minor', currentVersion.minor, previousVersionParsed.minor, 82, 2.2, 0.35);

      // Animate patch reel (rightmost)
      this.animateReel('reel-patch', currentVersion.patch, previousVersionParsed.patch, 98, 1.8, 0.45);
    }
  }

  /**
   * Animate a single reel for text versions
   */
  private animateSingleReel(
    reelId: string,
    currentValue: string,
    previousValue: string,
    centerX: number,
    duration: number
  ): void {
    const values = this.generateTextReelValues(previousValue, currentValue);
    const finalY = -(values.length - 1) * 20; // Move to show final value

    // Create custom animation with all required attributes
    const animation = `<animateTransform
      xlink:href="#${reelId}"
      attributeName="transform"
      type="translate"
      values="0,0; 0,0; 0,${finalY}"
      keyTimes="0; 0.4; 1"
      keySplines="0,0,1,1; 0.5, 0, 0.5, 1"
      calcMode="spline"
      dur="${duration}s"
      begin="0.5s"
      fill="freeze" />`;

    // Inject animation into the animations array
    (this.animations as string[]).push(animation);
  }

  /**
   * Animate a single reel with slot machine effect
   */
  private animateReel(
    reelId: string,
    currentValue: string,
    previousValue: string,
    xPos: number,
    duration: number,
    keyTimeOffset: number
  ): void {
    const values = this.generateReelValues(previousValue, currentValue);
    const finalY = -(values.length - 1) * 20; // Move to show final value

    // Create custom animation with all required attributes
    const animation = `<animateTransform
      xlink:href="#${reelId}"
      attributeName="transform"
      type="translate"
      values="${xPos},0; ${xPos},0; ${xPos},${finalY}"
      keyTimes="0; ${keyTimeOffset}; 1"
      keySplines="0,0,1,1; 0.5, 0, 0.5, 1"
      calcMode="spline"
      dur="${duration}s"
      begin="0.5s"
      fill="freeze" />`;

    // Inject animation into the animations array
    (this.animations as string[]).push(animation);
  }
}
