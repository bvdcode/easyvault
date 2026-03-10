[![CI](https://github.com/bvdcode/EasyVault/actions/workflows/publish-release.yml/badge.svg)](https://github.com/bvdcode/EasyVault/actions/workflows/publish-release.yml)
[![Release](https://img.shields.io/github/v/release/bvdcode/EasyVault?sort=semver)](https://github.com/bvdcode/EasyVault/releases)
[![Docker Pulls](https://img.shields.io/docker/pulls/bvdcode/easyvault)](https://hub.docker.com/r/bvdcode/easyvault)
[![Image Size](https://img.shields.io/docker/image-size/bvdcode/easyvault/latest)](https://hub.docker.com/r/bvdcode/easyvault/tags)
[![CodeFactor](https://www.codefactor.io/repository/github/bvdcode/EasyVault/badge)](https://www.codefactor.io/repository/github/bvdcode/EasyVault)
[![Nuget](https://img.shields.io/nuget/dt/EasyVault?color=%239100ff)](https://www.nuget.org/packages/EasyVault/)
[![Static Badge](https://img.shields.io/badge/fuget-f88445?logo=readme&logoColor=white)](https://www.fuget.org/packages/EasyVault)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/bvdcode/EasyVault/.github%2Fworkflows%2Fpublish-release.yml)](https://github.com/bvdcode/EasyVault/actions)
[![NuGet version (EasyVault)](https://img.shields.io/nuget/v/EasyVault.svg?label=stable)](https://www.nuget.org/packages/EasyVault/)
![GitHub repo size](https://img.shields.io/github/repo-size/bvdcode/EasyVault)
[![License](https://img.shields.io/github/license/bvdcode/EasyVault)](LICENSE)

# EasyVault

> Live: [vault.splidex.com](https://vault.splidex.com) - The key you enter will encrypt your secrets (Easy)

Lightweight, self‑contained Zero-Trust secrets service — a single Docker image with a built‑in Web UI. Run the container, open the UI, enter any encryption key and manage secrets without extra setup.

## What's inside

- Single image, built‑in UI (served from the same server at `/`).
- AES‑256 (PBKDF2‑SHA256) at rest; only a SHA‑512 of the password is stored.
- Per‑secret IP and User‑Agent allowlists (wildcards supported).
- SQLite by default; migrations apply automatically.
- Health check at `/api/v1/health`.
- Minimal .NET SDK (Dictionary or typed mapping).

## Quick start (UI‑first)

### Docker Hub (recommended)

Pull and run with persistence:

```powershell
docker pull bvdcode/easyvault:latest
docker run --name easyvault -p 8080:8080 -v easyvault_data:/data -d bvdcode/easyvault:latest
# UI: http://localhost:8080
```

Or with Docker Compose (Traefik example):

```yaml
services:
  vault:
    image: bvdcode/easyvault:latest
    restart: always
    # if you don't have Traefik:
    # ports:
    # - "8080:8080"
    volumes:
      - /data/vault:/data
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.vault.rule=Host(`vault.${ROOT_DOMAIN}`)"
```

Open the Web UI at your domain (e.g., https://vault.${ROOT_DOMAIN}) and manage secrets from the UI.

In Docker (locally):

```powershell
### From source (optional)

```powershell
# Build the image from this repo
docker build -t easyvault:local -f .\Sources\EasyVault.Server\Dockerfile .\Sources

# Run locally
docker run --name easyvault -p 8080:8080 -v easyvault_data:/data easyvault:local
# UI: http://localhost:8080
```
```

Local run without Docker (optional):

```powershell
cd .\Sources\EasyVault.Server
dotnet run
```

By default the server listens on `8080`. The UI is available at `/`. DB path: `/data/easyvault.db` (for Docker).

## Configuration (optional)

Settings in `Sources/EasyVault.Server/appsettings.json`:

```json
{
  "SqliteConnectionString": "Data Source=/data/easyvault.db;Cache=Shared;Foreign Keys=True;Pooling=True;Mode=ReadWriteCreate;"
}
```

You can override these with ASP.NET Core environment variables.

## API (brief)

1. Create/update vault (encrypt and save) — the UI does this for you:

```
POST /api/v1/vault/{password}
Content-Type: application/json

[
  {
    "keyId": "b7c1e6b6-4321-4c9c-1234-0bb2d6bf9b4a",
    "appName": "MyApp",
    "values": { "DB_PASSWORD": "supersecret", "API_TOKEN": "abcdef" },
    "allowedAddresses": ["127.0.0.1", "10.0.*"],
    "allowedUserAgents": ["PostmanRuntime", "MyService/*"]
  }
]
```

2. Get secrets by `keyId` (allowed by IP/UA; vault must be unsealed, the UI handles unseal):

```
GET /api/v1/vault/secrets/{keyId}?format=json|plain
```

- `format=json` — returns `{ "KEY": "VALUE" }`.
- `format=plain` — returns strings like `KEY=VALUE`.

Also available: `GET /api/v1/vault/{password}` — decrypts the latest vault for this password and unseals in‑memory cache.

Note: the password (`{password}`) is used only for encryption/decryption and is not stored (only its SHA‑512 hash).

## .NET SDK (optional)

Client usage example:

```csharp
using EasyVault.SDK;

var client = new EasyVaultClient("http://localhost:8080", new Guid("b7c1e6b6-1234-4c9c-4321-0bb2d6bf9b4a"));

// Key-value dictionary
var map = client.GetSecrets();

// Typed mapping by property names (case-insensitive)
var typed = client.GetSecrets<MySecrets>();

public class MySecrets
{
    public string DB_PASSWORD { get; set; } = string.Empty;
    public string API_TOKEN { get; set; } = string.Empty;
}
```

## Development

- Server: `Sources/EasyVault.Server` — ASP.NET Core 9.0, SQLite.
- Web client (optional): `Sources/easyvault.client` — Vite + React.
- Tests: `Sources/EasyVault.Tests`.

```powershell
cd .\Sources
dotnet build
dotnet test

# frontend (optional)
cd .\easyvault.client; npm i; npm run dev
```

## License

MIT. See [LICENSE](LICENSE) file.
