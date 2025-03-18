export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    // Default to 500 server error
    res.status(500).json({
      message: err.message || 'Internal Server Error'
    });
  };