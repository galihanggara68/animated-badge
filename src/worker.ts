/**
 * Cloudflare Worker for Animated Badge API
 * Serves animated SVG badges with proper headers
 */

import { BuildStatusBadge } from './badges/build-status-badge';
import { VersionBadge } from './badges/version-badge';
import { CoverageBadge } from './badges/coverage-badge';
import { LicenseBadge } from './badges/license-badge';

interface Env {
  // Add any environment variables here
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Route to appropriate badge handler
      if (path.startsWith('/badge/build-status')) {
        return handleBuildStatusBadge(url);
      } else if (path.startsWith('/badge/version')) {
        return handleVersionBadge(url);
      } else if (path.startsWith('/badge/coverage')) {
        return handleCoverageBadge(url);
      } else if (path.startsWith('/badge/license')) {
        return handleLicenseBadge(url);
      } else if (path === '/' || path === '/health') {
        return handleHealthCheck();
      } else {
        return handleNotFound();
      }
    } catch (error) {
      return handleError(error);
    }
  },
};

/**
 * Handle build status badge requests
 * Query params: status (success|failed|pending|running), label, message
 */
async function handleBuildStatusBadge(url: URL): Promise<Response> {
  const status = url.searchParams.get('status') as 'success' | 'failed' | 'pending' | 'running' || 'success';
  const label = url.searchParams.get('label') || undefined;
  const message = url.searchParams.get('message') || undefined;

  const badge = new BuildStatusBadge({ status, label, message });
  const svg = badge.generate();

  return createSvgResponse(svg);
}

/**
 * Handle version badge requests
 * Query params: version, previousVersion, label
 */
async function handleVersionBadge(url: URL): Promise<Response> {
  const version = url.searchParams.get('version') || '0.0.0';
  const previousVersion = url.searchParams.get('previousVersion') || undefined;
  const label = url.searchParams.get('label') || undefined;

  const badge = new VersionBadge({ version, previousVersion, label });
  const svg = badge.generate();

  return createSvgResponse(svg);
}

/**
 * Handle coverage badge requests
 * Query params: coverage (number), label
 */
async function handleCoverageBadge(url: URL): Promise<Response> {
  const coverage = parseFloat(url.searchParams.get('coverage') || '0');
  const label = url.searchParams.get('label') || undefined;

  const badge = new CoverageBadge({ coveragePercentage: coverage, label });
  const svg = badge.generate();

  return createSvgResponse(svg);
}

/**
 * Handle license badge requests
 * Query params: license, label, shimmerInterval
 */
async function handleLicenseBadge(url: URL): Promise<Response> {
  const license = url.searchParams.get('license') || 'MIT';
  const label = url.searchParams.get('label') || undefined;
  const shimmerInterval = url.searchParams.get('shimmerInterval')
    ? parseInt(url.searchParams.get('shimmerInterval')!)
    : undefined;

  const badge = new LicenseBadge({ license, label, shimmerInterval });
  const svg = badge.generate();

  return createSvgResponse(svg);
}

/**
 * Handle health check and root path
 */
function handleHealthCheck(): Response {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'Animated Badge API',
      version: '1.0.0',
      endpoints: [
        '/badge/build-status',
        '/badge/version',
        '/badge/coverage',
        '/badge/license',
      ],
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

/**
 * Handle 404 errors
 */
function handleNotFound(): Response {
  return new Response(
    JSON.stringify({
      error: 'Not Found',
      message: 'Badge endpoint not found. Check /health for available endpoints.',
    }),
    {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

/**
 * Handle errors
 */
function handleError(error: unknown): Response {
  console.error('Badge generation error:', error);

  return new Response(
    JSON.stringify({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

/**
 * Create SVG response with proper headers
 * Per requirements: Content-Type: image/svg+xml, Cache-Control: no-cache
 */
function createSvgResponse(svg: string): Response {
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
