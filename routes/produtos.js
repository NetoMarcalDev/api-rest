const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');
const ProdutosController = require('../controllers/produtos-Controller');

const storage = multer.diskStorage({
  destination: function (rec, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (rec, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.get('/', ProdutosController.getProdutos);
router.post('/', login, upload.single('produto_imagem'), ProdutosController.postProduto);
router.get('/:id_produto', ProdutosController.getProduto);
router.patch('/', ProdutosController.petchPrdoto);
router.delete('/', ProdutosController.deleteProduto);

module.exports = router;