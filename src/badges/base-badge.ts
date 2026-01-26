/**
 * Base Badge Generator
 * Provides core functionality for generating animated SVG badges
 * Ensures strict compliance with requirements:
 * - Pure SVG animation (no CSS/JS)
 * - Preserves viewBox and geometry
 * - File size ≤ 256 KB
 */

export interface BadgeConfig {
  width: number;
  height: number;
  viewBox: string;
  title: string;
  backgroundColor?: string;
}

export interface AnimationTiming {
  dur: string; // Duration (e.g., "1.5s")
  begin?: string; // Start time (e.g., "0s", "2s")
  repeatCount: string; // "indefinite" or number
  fill?: string; // "freeze" or "remove"
}

export class BaseBadge {
  protected config: BadgeConfig;
  protected animations: string[] = [];
  protected elements: string[] = [];

  constructor(config: BadgeConfig) {
    this.config = config;
  }

  /**
   * Generate SVG opening tag with required attributes
   */
  protected generateSvgOpen(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${this.config.width}"
  height="${this.config.height}"
  viewBox="${this.config.viewBox}"
  role="img"
  aria-label="${this.config.title}">`;
  }

  /**
   * Generate SVG closing tag
   */
  protected generateSvgClose(): string {
    return '</svg>';
  }

  /**
   * Add a rectangle element (used for backgrounds, fills, etc.)
   */
  protected addRect(props: {
    x?: number;
    y?: number;
    width: number;
    height: number;
    fill?: string;
    rx?: number;
    ry?: number;
  }): void {
    const attrs = [
      props.x !== undefined ? `x="${props.x}"` : '',
      props.y !== undefined ? `y="${props.y}"` : '',
      `width="${props.width}"`,
      `height="${props.height}"`,
      props.fill ? `fill="${props.fill}"` : '',
      props.rx !== undefined ? `rx="${props.rx}"` : '',
      props.ry !== undefined ? `ry="${props.ry}"` : '',
    ].filter(Boolean).join(' ');

    this.elements.push(`<rect ${attrs} />`);
  }

  /**
   * Add text element
   */
  protected addText(props: {
    x: number;
    y: number;
    text: string;
    fill?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    textAnchor?: 'start' | 'middle' | 'end';
  }): void {
    const attrs = [
      `x="${props.x}"`,
      `y="${props.y}"`,
      props.fill ? `fill="${props.fill}"` : '',
      props.fontSize ? `font-size="${props.fontSize}"` : 'font-size="11"',
      `font-family="${props.fontFamily || 'Verdana, Geneva, sans-serif'}"`,
      props.fontWeight ? `font-weight="${props.fontWeight}"` : '',
      `text-anchor="${props.textAnchor || 'start'}"`,
    ].filter(Boolean).join(' ');

    this.elements.push(`<text ${attrs}>${this.escapeXml(props.text)}</text>`);
  }

  /**
   * Add group element for organizing elements
   * @param id - Group identifier
   * @param elements - Array of SVG element strings
   * @param attrs - Additional attributes (e.g., 'clip-path="url(#bar-clip)"')
   */
  protected addGroup(id: string, elements: string[], attrs?: string): void {
    const attrString = attrs ? ` ${attrs}` : '';
    this.elements.push(`<g id="${id}"${attrString}>${elements.join('')}</g>`);
  }

  /**
   * Add opacity animation
   * Used for pulse effects
   */
  protected addOpacityAnimation(targetId: string, timing: AnimationTiming, values: string): void {
    const anim = `<animate
  xlink:href="#${targetId}"
  attributeName="opacity"
  values="${values}"
  dur="${timing.dur}"
  ${timing.begin ? `begin="${timing.begin}"` : ''}
  repeatCount="${timing.repeatCount}"
  ${timing.fill ? `fill="${timing.fill}"` : ''} />`;
    this.animations.push(anim);
  }

  /**
   * Add transform animation
   * Used for scroll, shimmer effects
   */
  protected addTransformAnimation(
    targetId: string,
    type: 'translate' | 'scale' | 'rotate',
    timing: AnimationTiming,
    values: string
  ): void {
    const anim = `<animateTransform
  xlink:href="#${targetId}"
  attributeName="transform"
  type="${type}"
  values="${values}"
  dur="${timing.dur}"
  ${timing.begin ? `begin="${timing.begin}"` : ''}
  repeatCount="${timing.repeatCount}"
  ${timing.fill ? `fill="${timing.fill}"` : ''} />`;
    this.animations.push(anim);
  }

  /**
   * Add attribute animation
   * Used for fill level, width changes, etc.
   */
  protected addAttributeAnimation(
    targetId: string,
    attributeName: string,
    timing: AnimationTiming,
    values: string
  ): void {
    const anim = `<animate
  xlink:href="#${targetId}"
  attributeName="${attributeName}"
  values="${values}"
  dur="${timing.dur}"
  ${timing.begin ? `begin="${timing.begin}"` : ''}
  repeatCount="${timing.repeatCount}"
  ${timing.fill ? `fill="${timing.fill}"` : ''} />`;
    this.animations.push(anim);
  }

  /**
   * Generate complete SVG markup
   * Final validation for file size and requirements
   */
  generate(): string {
    const svg = [
      this.generateSvgOpen(),
      ...this.elements,
      ...this.animations,
      this.generateSvgClose(),
    ].join('\n');

    // Validate file size (256 KB = 262144 bytes)
    // Use TextEncoder for Cloudflare Workers compatibility
    const fileSize = new TextEncoder().encode(svg).length;
    if (fileSize > 262144) {
      throw new Error(`SVG file size ${fileSize} bytes exceeds 256 KB limit`);
    }

    // Validate height constraint
    if (this.config.height < 20 || this.config.height > 28) {
      throw new Error(`SVG height ${this.config.height}px must be between 20-28px`);
    }

    return svg;
  }

  /**
   * Escape XML special characters in text
   */
  protected escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
