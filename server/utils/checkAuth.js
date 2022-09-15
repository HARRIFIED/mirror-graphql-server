const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');

module.exports = (context) => {
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try{
                const user = jwt.verify(token, process.env.JWT_SECRET);
                return user
            } catch (err) {
                throw new AuthenticationError('Invalid or expired token', {
                    error: 'Invalid or expired token'
                })
            }
        }
        throw new Error('Authentication must have a token in the format "Bearer {token}"')
    }
    throw new Error('Auth Header must be provided')
}