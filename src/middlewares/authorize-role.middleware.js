export function authorizeRole(...roles) {
    return (req, res, next) => {
      const userRole = req.user.role;
  
      if (!roles.includes(userRole)) {
        return res.status(403).json({
          error: 'No tienes permisos para realizar esta acción',
        });
      }
  
      next();
    };
  }
  