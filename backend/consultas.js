import pkg from 'pg'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pkg

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  allowExitOnIdle: true
})

/*
REGISTRAR USUARIO
*/

export const registrarUsuario = async (user) => {
  let { email, password, rol, lenguage } = user

  const passwordEncriptada = bcrypt.hashSync(password, 10)

  const consulta =
    'INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4) RETURNING *'

  const values = [email, passwordEncriptada, rol, lenguage]

  const result = await pool.query(consulta, values)

  return result.rows[0]
}

/*
VERIFICAR LOGIN
*/

export const verificarCredenciales = async (email, password) => {
  const consulta = 'SELECT * FROM usuarios WHERE email = $1'

  const values = [email]

  const { rows, rowCount } = await pool.query(consulta, values)

  if (!rowCount) {
    throw { code: 404, message: 'Usuario no encontrado' }
  }

  const usuario = rows[0]

  const passwordCorrecta = bcrypt.compareSync(
    password,
    usuario.password
  )

  if (!passwordCorrecta) {
    throw { code: 401, message: 'Contraseña incorrecta' }
  }

  return usuario
}

/*
OBTENER USUARIO
*/

export const obtenerUsuario = async (email) => {
  const consulta =
    'SELECT email, rol, lenguage FROM usuarios WHERE email = $1'

  const values = [email]

  const { rows } = await pool.query(consulta, values)

  return rows
}