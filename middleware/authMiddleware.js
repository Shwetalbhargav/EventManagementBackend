const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secret';

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, SECRET);
        req.userId = decoded.userId;
        next();
    } catch {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
