export function validateDto(dto) {
    return (req, res, next) => {
      const { error } = dto.validate(req.body, { abortEarly: false }); // Captura todos los errores
  
      if (error) {
        return res.status(400).json({
          error: "Bad Request",
          details: error.details.map(detail => detail.message),
        });
      }
  
      next();
    };
  }
  