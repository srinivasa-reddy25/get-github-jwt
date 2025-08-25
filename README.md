# GitHub JWT Generator

A simple Express.js server that generates GitHub App JWT tokens from a private key.

## Installation

```bash
npm install
```

## Usage

Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will run on port 3000 by default (or the PORT environment variable).

## API Endpoints

### POST /get-github-jwt

Generates a GitHub App JWT token.

**Request Body:**
```json
{
  "private_key": "-----BEGIN RSA PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END RSA PRIVATE KEY-----",
  "app_id": 123456
}
```

**Response:**
```json
{
  "jwt": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 600,
  "issued_at": 1234567890
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:3000/get-github-jwt \
  -H "Content-Type: application/json" \
  -d '{
    "private_key": "-----BEGIN RSA PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END RSA PRIVATE KEY-----",
    "app_id": 123456
  }'
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request` - Missing required fields or invalid private key format
- `500 Internal Server Error` - Server-side errors during JWT generation

## Notes

- JWT tokens expire after 10 minutes (GitHub's maximum)
- The `iat` (issued at) claim is set to 60 seconds in the past to account for clock skew
- Private keys must be in RSA PEM format
- The server uses RS256 algorithm for signing (required by GitHub)
