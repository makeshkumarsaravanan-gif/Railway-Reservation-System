const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

function verifyToken(req, res, next) {
    // 1. Get header
    const authHeader = req.headers['authorization'];

    // 2. Check if header exists
    if (!authHeader) {
        return res.status(403).json({ success: false, message: 'Access Denied: No Token Provided' });
    }

    // 3. Extract token (Bearer <token>)
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    if (!token) {
        return res.status(403).json({ success: false, message: 'Invalid Token Format' });
    }

    try {
        // 4. Verify & Decode
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // 5. Attach user info to request object
        // Standardize panna 'user_id' nu use pannalaam
        req.user_id = decoded.id || decoded.user_id; 
        req.email = decoded.email;
        
        next();
    } catch (err) {
        return res.status(401).json({ 
            success: false, 
            message: err.name === 'TokenExpiredError' ? 'Token Expired' : 'Invalid Token' 
        });
    }
}

module.exports = verifyToken;