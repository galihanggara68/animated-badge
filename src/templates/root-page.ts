/**
 * Root page HTML template
 * Exports the HTML content for the root documentation page
 */

export const rootPageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Animated Badge API - Documentation</title>

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            gray: {
              50: '#f9fafb',
              100: '#f3f4f6',
              200: '#e5e7eb',
              300: '#d1d5db',
              400: '#9ca3af',
              500: '#6b7280',
              600: '#4b5563',
              700: '#374151',
              800: '#1f2937',
              900: '#111827',
              950: '#030712',
            }
          }
        }
      }
    }
  </script>

  <!-- Alpine.js -->
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

  <style>
    [x-cloak] { display: none !important; }
  </style>
</head>
<body class="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200 transition-colors duration-300 min-h-screen">
  <div x-data="badgePlayground()" x-cloak class="max-w-5xl mx-auto px-4 py-12">
    <!-- Header -->
    <header class="flex justify-between items-center mb-16 pb-8 border-b-2 border-gray-200 dark:border-gray-800">
      <h1 class="text-4xl font-light text-gray-900 dark:text-gray-100">Animated Badge API</h1>
    </header>

    <!-- Introduction -->
    <section class="mb-16 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
      <p>
        A lightweight API for generating animated SVG badges. Perfect for showcasing build status,
        version numbers, code coverage, and license information in your documentation or README files.
      </p>
    </section>

    <!-- Build Status Badge -->
    <section class="mb-12 p-6 bg-gray-50 dark:bg-gray-900 border-l-4 border-gray-500 rounded-lg">
      <h2 class="text-2xl font-normal mb-3 text-gray-900 dark:text-gray-100">Build Status Badge</h2>
      <p class="mb-4 text-gray-600 dark:text-gray-400">Generate animated badges for build statuses with a pulse animation on success.</p>

      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Endpoint:</h3>
      <code class="inline-block bg-white dark:bg-gray-950 px-2 py-1 rounded text-sm border border-gray-300 dark:border-gray-700 font-mono">/build-status</code>

      <h3 class="text-lg font-medium mt-8 mb-4 text-gray-900 dark:text-gray-100">Interactive Preview:</h3>
      <div class="mt-5 border border-gray-300 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-950">
        <!-- Badge Preview -->
        <div class="flex justify-center items-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg mb-5 min-h-20">
          <img :src="buildStatusUrl()" alt="Build Status Badge" class="max-w-full h-auto" />
        </div>

        <!-- Controls -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Status:</label>
            <select x-model="buildStatus.status" class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent">
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
              <option value="running">Running</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Label:</label>
            <input type="text" x-model="buildStatus.label" placeholder="build" class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Message:</label>
            <input type="text" x-model="buildStatus.message" placeholder="auto" class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Quick Presets:</label>
            <div class="flex flex-wrap gap-2">
              <button @click="setBuildStatusPreset('success')" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-200">✓ Passing</button>
              <button @click="setBuildStatusPreset('failed')" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-200">✗ Failing</button>
              <button @click="setBuildStatusPreset('pending')" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-200">⟳ Pending</button>
              <button @click="setBuildStatusPreset('running')" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-200">▶ Running</button>
            </div>
          </div>
        </div>

        <!-- URL Output -->
        <div class="mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">URL:</label>
          <code x-text="buildStatusUrl()" class="block px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-mono break-all text-gray-700 dark:text-gray-300"></code>
        </div>
      </div>
    </section>

    <!-- Version Badge -->
    <section class="mb-12 p-6 bg-gray-50 dark:bg-gray-900 border-l-4 border-gray-500 rounded-lg">
      <h2 class="text-2xl font-normal mb-3 text-gray-900 dark:text-gray-100">Version Badge</h2>
      <p class="mb-4 text-gray-600 dark:text-gray-400">Display version numbers with animated highlighting when version changes.</p>

      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Endpoint:</h3>
      <code class="inline-block bg-white dark:bg-gray-950 px-2 py-1 rounded text-sm border border-gray-300 dark:border-gray-700 font-mono">/version</code>

      <h3 class="text-lg font-medium mt-8 mb-4 text-gray-900 dark:text-gray-100">Interactive Preview:</h3>
      <div class="mt-5 border border-gray-300 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-950">
        <!-- Badge Preview -->
        <div class="flex justify-center items-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg mb-5 min-h-20">
          <img :src="versionUrl()" alt="Version Badge" class="max-w-full h-auto" />
        </div>

        <!-- Controls -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Version:</label>
            <input type="text" x-model="version.version" class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Previous Version:</label>
            <input type="text" x-model="version.previousVersion" placeholder="optional" class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Label:</label>
            <input type="text" x-model="version.label" placeholder="version" class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Quick Presets:</label>
            <div class="flex flex-wrap gap-2">
              <button @click="setVersionPreset('1.0.0', '')" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-200">v1.0.0</button>
              <button @click="setVersionPreset('2.0.0', '1.0.0')" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-200">v2.0.0 (↑)</button>
              <button @click="setVersionPreset('v3.2.1', '')" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-200">v3.2.1</button>
              <button @click="setVersionPreset('beta', 'alpha')" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-200">beta</button>
            </div>
          </div>
        </div>

        <!-- URL Output -->
        <div class="mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">URL:</label>
          <code x-text="versionUrl()" class="block px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-mono break-all text-gray-700 dark:text-gray-300"></code>
        </div>
      </div>
    </section>

    <!-- Coverage Badge -->
    <section class="mb-12 p-6 bg-gray-50 dark:bg-gray-900 border-l-4 border-gray-500 rounded-lg">
      <h2 class="text-2xl font-normal mb-3 text-gray-900 dark:text-gray-100">Coverage Badge</h2>
      <p class="mb-4 text-gray-600 dark:text-gray-400">Show code coverage percentages with color-coded animation.</p>

      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Endpoint:</h3>
      <code class="inline-block bg-white dark:bg-gray-950 px-2 py-1 rounded text-sm border border-gray-300 dark:border-gray-700 font-mono">/coverage</code>

      <h3 class="text-lg font-medium mt-8 mb-4 text-gray-900 dark:text-gray-100">Interactive Preview:</h3>
      <div class="mt-5 border border-gray-300 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-950">
        <!-- Badge Preview -->
        <div class="flex justify-center items-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg mb-5 min-h-20">
          <img :src="coverageUrl()" alt="Coverage Badge" class="max-w-full h-auto" />
        </div>

        <!-- Controls -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Coverage (%):</label>
            <input type="number" x-model="coverage.coverage" min="0" max="100" class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Label:</label>
            <input type="text" x-model="coverage.label" placeholder="coverage" class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Quick Presets:</label>
            <div class="flex flex-wrap gap-2">
              <button @click="setCoveragePreset(95)" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-200">95% Excellent</button>
              <button @click="setCoveragePreset(78)" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-200">78% Good</button>
              <button @click="setCoveragePreset(45)" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-200">45% Low</button>
              <button @click="setCoveragePreset(100)" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-200">100% Perfect</button>
            </div>
          </div>
        </div>

        <!-- URL Output -->
        <div class="mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">URL:</label>
          <code x-text="coverageUrl()" class="block px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-mono break-all text-gray-700 dark:text-gray-300"></code>
        </div>
      </div>
    </section>

    <!-- License Badge -->
    <section class="mb-12 p-6 bg-gray-50 dark:bg-gray-900 border-l-4 border-gray-500 rounded-lg">
      <h2 class="text-2xl font-normal mb-3 text-gray-900 dark:text-gray-100">License Badge</h2>
      <p class="mb-4 text-gray-600 dark:text-gray-400">Display license information with customizable shimmer animation.</p>

      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Endpoint:</h3>
      <code class="inline-block bg-white dark:bg-gray-950 px-2 py-1 rounded text-sm border border-gray-300 dark:border-gray-700 font-mono">/license</code>

      <h3 class="text-lg font-medium mt-8 mb-4 text-gray-900 dark:text-gray-100">Interactive Preview:</h3>
      <div class="mt-5 border border-gray-300 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-950">
        <!-- Badge Preview -->
        <div class="flex justify-center items-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg mb-5 min-h-20">
          <img :src="licenseUrl()" alt="License Badge" class="max-w-full h-auto" />
        </div>

        <!-- Controls -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">License:</label>
            <select x-model="license.license" class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent">
              <option value="MIT">MIT</option>
              <option value="Apache-2.0">Apache-2.0</option>
              <option value="GPL-3.0">GPL-3.0</option>
              <option value="BSD">BSD</option>
              <option value="ISC">ISC</option>
              <option value="MPL-2.0">MPL-2.0</option>
              <option value="UNLICENSE">UNLICENSE</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Label:</label>
            <input type="text" x-model="license.label" placeholder="license" class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Shimmer Interval (seconds):</label>
            <input type="number" x-model="license.shimmerInterval" min="5" max="10" class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Quick Presets:</label>
            <div class="flex flex-wrap gap-2">
              <button @click="setLicensePreset('MIT', 5)" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-200">MIT</button>
              <button @click="setLicensePreset('Apache-2.0', 5)" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-200">Apache</button>
              <button @click="setLicensePreset('GPL-3.0', 8)" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-200">GPL (slow)</button>
              <button @click="setLicensePreset('BSD', 6)" class="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white hover:border-gray-500 transition-all duration-200">BSD</button>
            </div>
          </div>
        </div>

        <!-- URL Output -->
        <div class="mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">URL:</label>
          <code x-text="licenseUrl()" class="block px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-mono break-all text-gray-700 dark:text-gray-300"></code>
        </div>
      </div>
    </section>

    <!-- Usage Section -->
    <section class="mb-12 p-6 bg-gray-50 dark:bg-gray-900 border-l-4 border-gray-500 rounded-lg">
      <h2 class="text-2xl font-normal mb-3 text-gray-900 dark:text-gray-100">Usage</h2>
      <p class="mb-4 text-gray-600 dark:text-gray-400">Simply use the badge URLs in your markdown, HTML, or anywhere else you display images:</p>

      <h3 class="text-base font-medium mb-2 text-gray-700 dark:text-gray-300 mt-6">Markdown:</h3>
      <div class="bg-white dark:bg-gray-950 p-4 rounded-lg border border-gray-300 dark:border-gray-700 mb-4">
        <code class="text-sm font-mono text-gray-700 dark:text-gray-300">![Build Status](/build-status?status=success)</code>
      </div>

      <h3 class="text-base font-medium mb-2 text-gray-700 dark:text-gray-300">HTML:</h3>
      <div class="bg-white dark:bg-gray-950 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
        <code class="text-sm font-mono text-gray-700 dark:text-gray-300">&lt;img src="/build-status?status=success" alt="Build Status"&gt;</code>
      </div>
    </section>

    <!-- Footer -->
    <footer class="mt-16 pt-8 border-t-2 border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400 text-sm">
      <p>Animated Badge API &copy; 2025 | Built with Cloudflare Workers</p>
    </footer>
  </div>

  <!-- Alpine.js Application -->
  <script>
    function badgePlayground() {
      return {
        // Build Status state
        buildStatus: {
          status: 'success',
          label: '',
          message: ''
        },

        // Version state
        version: {
          version: '1.0.0',
          previousVersion: '',
          label: ''
        },

        // Coverage state
        coverage: {
          coverage: '95',
          label: ''
        },

        // License state
        license: {
          license: 'MIT',
          label: '',
          shimmerInterval: '5'
        },

        // Build Status functions
        buildStatusUrl() {
          const params = new URLSearchParams();
          params.append('status', this.buildStatus.status);
          if (this.buildStatus.label) params.append('label', this.buildStatus.label);
          if (this.buildStatus.message) params.append('message', this.buildStatus.message);
          return '/build-status?' + params.toString();
        },

        setBuildStatusPreset(status) {
          this.buildStatus.status = status;
          this.buildStatus.label = '';
          this.buildStatus.message = '';
        },

        // Version functions
        versionUrl() {
          const params = new URLSearchParams();
          params.append('version', this.version.version);
          if (this.version.previousVersion) params.append('previousVersion', this.version.previousVersion);
          if (this.version.label) params.append('label', this.version.label);
          return '/version?' + params.toString();
        },

        setVersionPreset(version, previousVersion) {
          this.version.version = version;
          this.version.previousVersion = previousVersion;
          this.version.label = '';
        },

        // Coverage functions
        coverageUrl() {
          const params = new URLSearchParams();
          params.append('coverage', this.coverage.coverage);
          if (this.coverage.label) params.append('label', this.coverage.label);
          return '/coverage?' + params.toString();
        },

        setCoveragePreset(coverage) {
          this.coverage.coverage = coverage.toString();
          this.coverage.label = '';
        },

        // License functions
        licenseUrl() {
          const params = new URLSearchParams();
          params.append('license', this.license.license);
          if (this.license.label) params.append('label', this.license.label);
          params.append('shimmerInterval', this.license.shimmerInterval);
          return '/license?' + params.toString();
        },

        setLicensePreset(license, shimmerInterval) {
          this.license.license = license;
          this.license.label = '';
          this.license.shimmerInterval = shimmerInterval.toString();
        }
      }
    }
  </script>
</body>
</html>`;
