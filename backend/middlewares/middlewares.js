import jwt from 'jsonwebtoken'

export const reportarConsulta = (req, res, next) => {
  console.log(`
  Hoy ${new Date()}
  Se ha recibido una consulta en la ruta ${req.url}
  `)

  next()
}

export const verificarToken = (req, res, next) => {
  const Authorization = req.header('Authorization')

  if (!Authorization) {
    return res.status(401).json({
      message: 'Token no proporcionado'
    })
  }

  const token = Authorization.split('Bearer ')[1]

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: 'Token inválido'
      })
    }

    req.email = decoded.email

    next()
  })
}

export const validarCredenciales = async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email y password son obligatorios'
    })
  }

  next()
}