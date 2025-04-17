import jwt from 'jsonwebtoken';

// Verify the token from the header
export const verifyToken = async (req) => {
    console.log('Headers data:', req.headers);

    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Authorization header is missing or invalid');
    }

    const token = authHeader.split(" ")[1];
    if (!token) throw new Error("Token not provided");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("Decoded Token:", decoded);
        return decoded;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error("Token has expired. Please log in again.");
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error("Invalid token. Please provide a valid token.");
        } else {
            throw new Error("Authentication error");
        }
    }
};

// Role-based authorization
export const roleAuth = async (req) => {
    const decoded = await verifyToken(req);
    console.log("Decoded Token for Role:", decoded);

    if (decoded.role !== 1 && decoded.role !== 2 ) {
        throw new Error(`Access denied for role ${decoded.role}`);
    }

    return decoded;
};

export const readOnlyAcess = async (req) => {
    const decoded = await verifyToken(req);
    console.log("Decoded Token for Role:", decoded);

    if (decoded.role !== 1 && decoded.role !== 2 && decoded.role !==3) {
        throw new Error(`Access denied for role ${decoded.role}`);
    }

    return decoded;
};
