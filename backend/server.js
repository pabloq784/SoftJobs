import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import {
  registrarUsuario,
  verificarCredenciales,
  obtenerUsuario
} from './consultas.js'

import {
  reportarConsulta,
  verificarToken,
  validarCredenciales
} from './middlewares/middlewares.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(reportarConsulta)

app.listen(3000, () => {
  console.log('Servidor levantado en puerto 3000')
})

/*
REGISTRAR USUARIO
*/

app.post('/usuarios', async (req, res) => {
  try {
    const user = req.body

    await registrarUsuario(user)

    res.status(201).send('Usuario creado con éxito')
  } catch (error) {
    console.error(error)

        // Evitar Email Duplicado
        
    if (error.code === '23505') {
      return res.status(400).json({
        message: 'Este correo ya está registrado'
      })
    }

    res.status(error.code || 500).json({
      message: error.message
    })
  }
})

/*
LOGIN
*/

app.post('/login', validarCredenciales, async (req, res) => {
  try {
    const { email, password } = req.body

    await verificarCredenciales(email, password)

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({ token })
  } catch (error) {
    console.error(error)

    res.status(error.code || 500).json({
      message: error.message
    })
  }
})

/*
OBTENER USUARIO
*/

app.get('/usuarios', verificarToken, async (req, res) => {
  try {
    const { email } = req

    const usuario = await obtenerUsuario(email)

    res.json(usuario)
  } catch (error) {
    console.error(error)

    res.status(error.code || 500).json({
      message: error.message
    })
  }
})