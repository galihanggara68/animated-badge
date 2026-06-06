/**
 * Cloudflare Worker for Animated Badge API
 * Serves animated SVG badges with proper headers
 */

import { BuildStatusBadge, BuildStatus } from './badges/build-status-badge';
import { VersionBadge } from './badges/version-badge';
import { CoverageBadge } from './badges/coverage-badge';
import { LicenseBadge } from './badges/license-badge';
import { GitHubStarsBadge } from './badges/github-stars-badge';
import { GithubIssuesBadge } from './badges/github-issues-badge';
import { rootPageHtml } from './templates/root-page';

interface Env {
  // Add any environment variables here
  GITHUB_TOKEN?: string;
}

/**
 * Fetch the latest build status from GitHub Actions
 */
async function fetchGitHubStatus(
  owner: string,
  repo: string,
  branch: string | null,
  env: Env
): Promise<BuildStatus | null> {
  let apiUrl = `https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=1`;
  if (branch) {
    apiUrl += `&branch=${encodeURIComponent(branch)}`;
  }

  const headers: Record<string, string> = {
    'User-Agent': 'Animated-Badge-Service',
    Accept: 'application/vnd.github.v3+json',
  };

  if (env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`;
  }

  try {
    const response = await fetch(apiUrl, {
      headers,
      // @ts-ignore - Cloudflare specific fetch options
      cf: {
        cacheTtl: 60,
        cacheEverything: true,
      },
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: any = await response.json();
    if (!data.workflow_runs || data.workflow_runs.length === 0) {
      return null;
    }

    const run = data.workflow_runs[0];

    // Map GitHub status/conclusion to BuildStatus
    if (run.status === 'queued' || run.status === 'waiting' || run.status === 'requested') {
      return 'pending';
    } else if (run.status === 'in_progress') {
      return 'running';
    } else if (run.status === 'completed') {
      return run.conclusion === 'success' ? 'success' : 'failed';
    }

    return null;
  } catch (e) {
    console.error('Failed to fetch from GitHub', e);
    return null;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Route to appropriate badge handler
      if (path.startsWith('/build-status')) {
        return handleBuildStatusBadge(url, env);
      } else if (path.startsWith('/version')) {
        return handleVersionBadge(url);
      } else if (path.startsWith('/coverage')) {
        return handleCoverageBadge(url);
      } else if (path.startsWith('/license')) {
        return handleLicenseBadge(url);
      } else if (path.startsWith('/github/stars')) {
        return handleGitHubStarsBadge(url);
      } else if (path.startsWith('/github/issues')) {
        return handleGithubIssuesBadge(url);
      } else if (path === '/') {
        return handleRootPage();
      } else if (path === '/health') {
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
 * Query params: owner, repo, branch, status (success|failed|pending|running), label, message
 */
async function handleBuildStatusBadge(url: URL, env: Env): Promise<Response> {
  const owner = url.searchParams.get('owner');
  const repo = url.searchParams.get('repo');
  const branch = url.searchParams.get('branch');

  let status: BuildStatus = 'success';

  if (owner && repo) {
    const githubStatus = await fetchGitHubStatus(owner, repo, branch, env);
    if (githubStatus) {
      status = githubStatus;
    } else {
      // Fallback if GitHub fetch fails
      const statusParam = url.searchParams.get('status');
      const validStatuses: BuildStatus[] = ['success', 'failed', 'pending', 'running'];
      status = validStatuses.includes(statusParam as BuildStatus)
        ? (statusParam as BuildStatus)
        : 'success';
    }
  } else {
    const statusParam = url.searchParams.get('status');
    const validStatuses: BuildStatus[] = ['success', 'failed', 'pending', 'running'];
    status = validStatuses.includes(statusParam as BuildStatus)
      ? (statusParam as BuildStatus)
      : 'success';
  }

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
  const version = url.searchParams.get('version')?.trim() || '0.0.0';
  const previousVersion = url.searchParams.get('previousVersion')?.trim() || undefined;
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
  const coverageParam = url.searchParams.get('coverage');
  let coverage = 0;

  // Parse and validate coverage percentage
  if (coverageParam) {
    const parsed = parseFloat(coverageParam);
    if (!isNaN(parsed)) {
      coverage = Math.max(0, Math.min(100, parsed));
    }
  }

  const label = url.searchParams.get('label') || undefined;

  const badge = new CoverageBadge({ coveragePercentage: coverage, label });
  const svg = badge.generate();

  return createSvgResponse(svg);
}

/**
 * Handle license badge requests
 * Query params: license, label
 */
async function handleLicenseBadge(url: URL): Promise<Response> {
  const license = url.searchParams.get('license')?.trim() || 'MIT';
  const label = url.searchParams.get('label') || undefined;

  const badge = new LicenseBadge({ license, label });
  const svg = badge.generate();

  return createSvgResponse(svg);
}

/**
 * Handle GitHub stars badge requests
 * Query params: stars (number|string), label
 */
async function handleGitHubStarsBadge(url: URL): Promise<Response> {
  const stars = url.searchParams.get('stars')?.trim() || '0';
  const label = url.searchParams.get('label') || undefined;

  const badge = new GitHubStarsBadge({ stars, label });
  const svg = badge.generate();

  return createSvgResponse(svg);
}

/**
 * Handle GitHub issues badge requests
 * Query params: open (number), closed (number), label
 */
async function handleGithubIssuesBadge(url: URL): Promise<Response> {
  const openParam = url.searchParams.get('open') || '0';
  const closedParam = url.searchParams.get('closed') || '0';
  const label = url.searchParams.get('label') || undefined;

  const open = parseInt(openParam, 10) || 0;
  const closed = parseInt(closedParam, 10) || 0;

  const badge = new GithubIssuesBadge({ open, closed, label });
  const svg = badge.generate();

  return createSvgResponse(svg);
}

/**
 * Handle root page with HTML documentation
 */
function handleRootPage(): Response {
  return new Response(rootPageHtml, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

/**
 * Handle health check endpoint
 */
function handleHealthCheck(): Response {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'Animated Badge API',
      version: '1.0.0',
      endpoints: [
        '/build-status',
        '/version',
        '/coverage',
        '/license',
        '/github/stars',
        '/github/issues',
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
      message: 'Badge endpoint not found.',
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
