const express = require('express');
const router = express.Router();
const UsuariosController = require('../controllers/usuarios-Controller');

router.post('/cadastro', UsuariosController.cadastrarUsuario);
router.post('/login', UsuariosController.Login);

module.exports = router;