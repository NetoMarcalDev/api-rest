const mysql = require('../mysql').pool;

exports.getPedidos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query( 
      `SELECT pedidos.id_pedido,
              pedidos.quantidade,
              produtos.id_produto,
              produtos.nome,
              produtos.preco
          FROM 
              pedidos
          INNER JOIN
              produtos
          ON produtos.id_produto = pedidos.id_produto`,
      (error, result, field) => {
        if(error) { return res.status(500).send({ error: error })}
        const response = {          
          pedidos: result.map(pedido => {
            return {
              id_pedido: pedido.id_pedido,              
              quantidade: pedido.quantidade,
              produto: {
                id_produto: pedido.id_produto,
                nome: pedido.nome,
                preco: pedido.preco
              },
              request: {
                tipo: 'GET',
                descricao: 'Retorna detalhes de um Pedido específico.',
                url: 'http://localhost:3000/pedidos/' + pedido.id_pedido
              }
            }
          })
        }    
        return res.status(200).send(response)
      }
    )
  })
  };

exports.postPedido = (req, res, next) => {  
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query(
      `INSERT INTO pedidos(id_produto, quantidade) VALUES (?,?);`,
      [req.body.id_produto, req.body.quantidade],
      (error, result, field) => {
        conn.release();
        if(error) { 
          if (error.sqlMessage === "Cannot add or update a child row: a foreign key constraint fails (`ecommerce`.`pedidos`, CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`))") {
            return res.status(500).send({ mensagem: 'Produto inexistente.' })
          }         
          return res.status(500).send({ error: error })
        }
        const response = {
          mensagem: 'Pedido Inserido com sucesso.',
          pedidoCriado: {
            id_pedido: result.id_pedido,
            id_produto: req.body.id_produto,
            quantidade: req.body.quantidade,
            request: {
              tipo: 'GET',
              descricao: 'Retorna todos os Pedidos',
              url: 'http://localhost:3000/pedidos'
            }
          }
        }  
        return res.status(201).send(response);
      }
    )
  });    
};

exports.getPedido = (req, res, next) => {  
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query(
      'SELECT * FROM pedidos WHERE id_pedido = ?;',
      [req.params.id_pedido],
      (error, result, field) => {
        if(error) { return res.status(500).send({ error: error })}          
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: 'ID não encontrado.'
          })
        }          
        const response = {  
          pedido: {
            id_pedido: result[0].id_pedido,
            id_produto: result[0].id_produto,
            quantidade: result[0].quantidade,
            request: {
              tipo: 'GET',
              descricao: 'Retorna todos os Pedidos',
              url: 'http://localhost:3000/pedidos'
            }
          }
        }  
        return res.status(200).send(response);
      }
    )
  })  
};

exports.petchPedido = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query(
      `UPDATE pedidos
          SET id_produto = ?,
              quantidade = ?
        WHERE id_pedido = ?;`,
      [
        req.body.id_produto, 
        req.body.quantidade,
        req.body.id_pedido
      ],
      (error, result, field) => {
        conn.release();
        if(error) { return res.status(500).send({ error: error })}

        const response = {
          mensagem: 'Pedido Atualizado com sucesso.',
          pedidooAtualizado: {
            id_produto: req.body.id_produto,
            quantidade: req.body.quantidade,
            id_pedido: req.body.pedido,
            request: {
              tipo: 'GET',
              descricao: 'Retorna os detalhes de um Pedido específico',
              url: 'http://localhost:3000/pedidos/' + req.body.id_pedido
            }
          }
        }
        return res.status(202).send(response);
      }
    )
  });
}

exports.deletePedido = (req, res, next) => { 
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query(
      'DELETE FROM pedidos WHERE id_pedido = ?',
      [req.body.id_pedido],
      (error, result, field) => {
        conn.release();
        if(error) { return res.status(500).send({ error: error })}
        const response = {
          mensagem: 'Pedido Excluídodo com sucesso.',
          request: {
            tipo: 'POST',
            descricao: 'Insere um Pedido',
            url: 'http://localhost:3000/pedidos',
            body: {
              id_produto: 'Int',
              quantidade: 'Double'
            }
          }
        }
        return res.status(202).send(response);
      }
    )
  });  
}