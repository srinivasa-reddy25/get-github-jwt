const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// POST endpoint to generate GitHub JWT
app.post('/get-github-jwt', (req, res) => {
    try {
        const { private_key, app_id } = req.body;

        // Validate required fields
        if (!private_key) {
            return res.status(400).json({
                error: 'private_key is required in request body'
            });
        }

        if (!app_id) {
            return res.status(400).json({
                error: 'app_id is required in request body'
            });
        }

        // Generate JWT payload
        const now = Math.floor(Date.now() / 1000);
        const payload = {
            iat: now - 60,           // issued at (60 seconds ago to account for clock skew)
            exp: now + (10 * 60),    // expires after 10 minutes
            iss: app_id              // issuer (GitHub App ID)
        };

        // Sign the JWT with the private key
        const token = jwt.sign(payload, private_key, { algorithm: 'RS256' });

        // Return the JWT
        res.json({
            jwt: token,
            expires_in: 600, // 10 minutes in seconds
            issued_at: now
        });

    } catch (error) {
        console.error('JWT generation error:', error.message);

        // Handle specific JWT errors
        if (error.message.includes('PEM')) {
            return res.status(400).json({
                error: 'Invalid private key format. Please provide a valid RSA private key in PEM format.'
            });
        }

        if (error.message.includes('sign')) {
            return res.status(400).json({
                error: 'Failed to sign JWT. Please check your private key format.'
            });
        }

        // Generic error response
        res.status(500).json({
            error: 'Internal server error while generating JWT'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`POST /get-github-jwt - Generate GitHub JWT token`);
    console.log(`GET /health - Health check`);
});

module.exports = app;
