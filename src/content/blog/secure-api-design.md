---
title: "Essential Security Practices for API Development"
date: "2023-12-20"
readTime: "6 min read"
excerpt: "Essential security practices for API development including authentication, authorization, rate limiting, and input validation."
tags: ["api", "security", "authentication", "best-practices"]
---

# Essential Security Practices for API Development

Building secure APIs is crucial in today's interconnected world. Here are the essential security practices every developer should implement.

## 1. Authentication & Authorization

### JWT Implementation
```javascript
const jwt = require('jsonwebtoken');

// Generate token
function generateToken(user) {
    return jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
}

// Verify token middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}
```

### Role-Based Access Control
```javascript
function authorize(roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
}

// Usage
app.get('/admin/users', authenticateToken, authorize(['admin']), getUsersHandler);
```

## 2. Input Validation & Sanitization

### Schema Validation with Joi
```javascript
const Joi = require('joi');

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
    name: Joi.string().alphanum().min(2).max(30).required()
});

function validateUser(req, res, next) {
    const { error, value } = userSchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({ 
            error: 'Validation failed',
            details: error.details.map(d => d.message)
        });
    }
    
    req.validatedData = value;
    next();
}
```

### SQL Injection Prevention
```javascript
// ❌ Vulnerable to SQL injection
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Safe with parameterized queries
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [email], (err, results) => {
    // Handle results
});
```

## 3. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

// API rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests, please try again later.'
    }
});

// Stricter limits for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // Only 5 login attempts per 15 minutes
    skipSuccessfulRequests: true
});

app.use('/api/', apiLimiter);
app.use('/auth/login', authLimiter);
```

## 4. HTTPS & Security Headers

```javascript
const helmet = require('helmet');

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"]
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// Additional security headers
app.use((req, res, next) => {
    res.setHeader('X-API-Version', '1.0');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});
```

## 5. Data Encryption

### Password Hashing
```javascript
const bcrypt = require('bcrypt');

// Hash password before storing
async function hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
}

// Verify password during login
async function verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}
```

### Sensitive Data Encryption
```javascript
const crypto = require('crypto');

function encrypt(text) {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
        encrypted,
        iv: iv.toString('hex'),
        tag: cipher.getAuthTag().toString('hex')
    };
}
```

## 6. API Monitoring & Logging

```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// Security event logging
function logSecurityEvent(event, req, details = {}) {
    logger.warn('Security Event', {
        event,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id,
        ...details
    });
}

// Usage in middleware
function detectSuspiciousActivity(req, res, next) {
    if (req.body && JSON.stringify(req.body).includes('<script>')) {
        logSecurityEvent('XSS_ATTEMPT', req, { payload: req.body });
        return res.status(400).json({ error: 'Invalid request' });
    }
    next();
}
```

## 7. Environment Security

```bash
# .env file (never commit this!)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
DATABASE_URL=postgresql://user:pass@localhost:5432/myapp
ENCRYPTION_KEY=your-encryption-key-in-hex-format
API_KEY=your-third-party-api-key
```

```javascript
// config/security.js
module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiry: process.env.JWT_EXPIRY || '24h',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    
    // Validate required environment variables
    validate() {
        const required = ['JWT_SECRET', 'DATABASE_URL', 'ENCRYPTION_KEY'];
        const missing = required.filter(key => !process.env[key]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
    }
};
```

## Quick Security Checklist

- ✅ **Authentication**: Implement JWT or similar
- ✅ **Authorization**: Role-based access control
- ✅ **HTTPS**: Enforce SSL/TLS everywhere
- ✅ **Input Validation**: Validate all user inputs
- ✅ **Rate Limiting**: Prevent abuse and DDoS
- ✅ **Password Security**: Hash with bcrypt (12+ rounds)
- ✅ **Error Handling**: Don't leak sensitive information
- ✅ **Logging**: Monitor security events
- ✅ **Dependencies**: Keep packages updated
- ✅ **Environment**: Secure config and secrets

## Tools We Recommend

- **OWASP ZAP** - Security testing
- **Helmet.js** - Security headers
- **Rate-limiter** - Request throttling  
- **Joi/Yup** - Input validation
- **ESLint Security** - Code analysis

Remember: **Security is not a feature, it's a foundation**. Build it in from day one!

---

*Questions about API security? Reach out on [LinkedIn](https://linkedin.com/in/yagizkilicarslan) or [Twitter](https://twitter.com/yagizklc).* 