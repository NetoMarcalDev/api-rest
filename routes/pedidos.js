const express = require('express');
const router = express.Router();
const PedidosController = require('../controllers/pedidos-Conroller');

router.get('/', PedidosController.getPedidos);
router.post('/', PedidosController.postPedido);
router.get('/:id_pedido', PedidosController.getPedido);
router.patch('/', PedidosController.petchPedido);
router.delete('/', PedidosController.deletePedido);

module.exports = router;