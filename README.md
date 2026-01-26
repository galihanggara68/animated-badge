# Animated SVG Badge System

A production-ready animated badge system using **pure SVG animations** (no CSS, no JavaScript) served via Cloudflare Workers.

## Features

- **Pure SVG Animations** - Uses only SMIL elements
- **GitHub Compatible** - Preserves viewBox and geometry, works on README files
- **Lightweight** - All badges under 256 KB
- **Data-Driven** - Animations triggered by actual data changes
- **Cloudflare Workers** - Global edge deployment
- **TypeScript** - Fully typed for maintainability

## Badge Types

### 1. Build Status Badge (Pulse Animation)

**Trigger:** Build status = success

**Animation:** Pulse effect on success status

```markdown
![Build Status](https://your-worker.workers.dev/badge/build-status?status=success)
```

**Query Parameters:**
- `status` (required): `success` | `failed` | `pending` | `running`
- `label` (optional): Custom label text
- `message` (optional): Custom status message

**Examples:**
```bash
# Success build (with pulse)
/badge/build-status?status=success

# Failed build (no animation)
/badge/build-status?status=failed

# Custom label and message
/badge/build-status?status=success&label=ci&message=passing
```

---

### 2. Version Badge (Scroll Animation)

**Trigger:** Version changes

**Animation:** Vertical odometer scroll

```markdown
![Version](https://your-worker.workers.dev/badge/version?version=2.1.0&previousVersion=2.0.5)
```

**Query Parameters:**
- `version` (required): Current version
- `previousVersion` (optional): Previous version (triggers animation if different)
- `label` (optional): Custom label text

**Examples:**
```bash
# Version with animation
/badge/version?version=2.1.0&previousVersion=2.0.5

# Static version (no animation)
/badge/version?version=1.0.0
```

---

### 3. Coverage Badge (Fill Animation)

**Trigger:** Coverage percentage updates

**Animation:** Fill level from bottom to top

```markdown
![Coverage](https://your-worker.workers.dev/badge/coverage?coverage=87)
```

**Query Parameters:**
- `coverage` (required): Coverage percentage (0-100)
- `label` (optional): Custom label text

**Examples:**
```bash
# High coverage (green)
/badge/coverage?coverage=87

# Medium coverage (yellow)
/badge/coverage?coverage=65

# Low coverage (red)
/badge/coverage?coverage=35
```

---

### 4. License Badge (Shimmer Animation)

**Trigger:** Time-based (every 5-10 seconds)

**Animation:** Shimmer sweep effect

```markdown
![License](https://your-worker.workers.dev/badge/license?license=MIT)
```

**Query Parameters:**
- `license` (required): License name
- `label` (optional): Custom label text
- `shimmerInterval` (optional): Seconds between shimmers (default: 7)

**Examples:**
```bash
# MIT license with shimmer
/badge/license?license=MIT

# Apache with custom interval
/badge/license?license=Apache-2.0&shimmerInterval=10
```

---

## Installation

```bash
# Clone repository
git clone https://github.com/galihanggara68/animated-badge
cd animated-badge

# Install dependencies
npm install

# Build
npm run build
```

---

## Deployment

### Local Development

```bash
# Start local development server
npm run dev

# Test badges
curl "http://localhost:8787/badge/build-status?status=success"
```

### Deploy to Cloudflare

```bash
# Login to Cloudflare
npx wrangler login

# Deploy to production
npm run deploy

# Deploy to development environment
npm run deploy:dev
```

### Configuration

Edit `wrangler.toml` to configure:

```toml
name = "animated-badge-service"
main = "src/worker.ts"
compatibility_date = "2024-01-01"

[env.dev]
name = "animated-badge-service-dev"
```

---

## API Usage

### Response Headers

All badge responses include:

```
Content-Type: image/svg+xml
Cache-Control: no-cache, no-store, must-revalidate
Access-Control-Allow-Origin: *
```

### Health Check

```bash
curl https://your-worker.workers.dev/health
```

Response:
```json
{
  "status": "ok",
  "service": "Animated Badge API",
  "version": "1.0.0",
  "endpoints": [
    "/badge/build-status",
    "/badge/version",
    "/badge/coverage",
    "/badge/license"
  ]
}
```

---

## Programmatic Usage

### TypeScript/JavaScript

```typescript
import { BuildStatusBadge } from './badges';

const badge = new BuildStatusBadge({ status: 'success' });
const svg = badge.generate();

console.log(svg);
```

### Node.js

```javascript
const { BuildStatusBadge } = require('./badges');

const badge = new BuildStatusBadge({ status: 'success' });
const svg = badge.generate();
```

---

## Testing

Generate example badges:

```bash
npm run test:badges
```

This creates SVG files in `./examples/` directory for visual inspection.

---

## Troubleshooting

### Animation Not Playing

- Check browser supports SMIL (most modern browsers do)
- Verify SVG is served with `Content-Type: image/svg+xml`
- Ensure `repeatCount="indefinite"` for looping animations

### File Size Too Large

- Reduce path complexity
- Optimize text length
- Remove unused definitions

### GitHub Not Displaying

- Verify viewBox matches original
- Check file size is under 256 KB
- Ensure proper MIME type

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new badge types
4. Ensure requirements compliance
5. Submit a pull request

---

## License

MIT

---

## Credits

Built with pure SVG SMIL animations and Cloudflare Workers.
