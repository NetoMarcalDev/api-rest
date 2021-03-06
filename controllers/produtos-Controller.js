const mysql = require('../mysql').pool;

exports.getProdutos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query(
      'SELECT * FROM produtos;',
      (error, result, field) => {
        if(error) { return res.status(500).send({ error: error })}
        const response = {     
          quantidade: result.length,     
          produtos: result.map(prod => {
            return {              
              id_produto: prod.id_produto,
              nome: prod.nome,
              preco: prod.preco,
              request: {
                tipo: 'GET',
                descricao: 'Retorna detalhes de um Produto específico.',
                url: 'http://localhost:3000/produtos/' + prod.id_produto
              }
            }
          })
        }    
        return res.status(200).send(response)
      }
    )
  })
};

exports.postProduto = (req, res, next) => {
  console.log(req.file);
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query(
      `INSERT INTO produtos(nome, preco) VALUES (?,?);`,
      [req.body.nome, req.body.preco],
      (error, result, field) => {
        conn.release();
        if(error) { return res.status(500).send({ error: error })}
        const response = {
          mensagem: 'Produto Inserido com sucesso.',
          produtoCriado: {
            id_produto: result.id_produto,
            nome: req.body.nome,
            preco: req.body.preco,
            request: {
              tipo: 'GET',
              descricao: 'Retorna todos os Produtos',
              url: 'http://localhost:3000/produtos'
            }
          }
        }
        return res.status(201).send(response);
      }
    )
  });  
};

exports.getProduto = (req, res, next) => {  
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query(
      'SELECT * FROM produtos WHERE id_produto = ?;',
      [req.params.id_produto],
      (error, result, field) => {
        if(error) { return res.status(500).send({ error: error })}        
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: 'ID não encontrado.'
          })
        }        
        const response = {
          produto: {
            id_produto: result[0].id_produto,
            nome:result[0].nome,
            preco: result[0].preco,
            request: {
              tipo: 'GET',
              descricao: 'Retorna todos os Produtos',
              url: 'http://localhost:3000/produtos'
            }
          }
        }
        return res.status(200).send(response);
      }
    )
  })
};

exports.petchPrdoto = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query(
      `UPDATE produtos
          SET nome       = ?,
              preco      = ?
        WHERE id_produto = ?;`,
      [
        req.body.nome, 
        req.body.preco,
        req.body.id_produto
      ],
      (error, result, field) => {
        conn.release();
        if(error) { return res.status(500).send({ error: error })}
        const response = {
          mensagem: 'Produto Atualizado com sucesso.',
          produtoAtualizado: {
            id_produto: req.body.id_produto,
            nome: req.body.nome,
            preco: req.body.preco,
            request: {
              tipo: 'GET',
              descricao: 'Retorna os detalhes de um Produto específico',
              url: 'http://localhost:3000/produtos/' + req.body.id_produto
            }
          }
        }
        return res.status(202).send(response);
      }
    )
  });
};

exports.deleteProduto = (req, res, next) => {  
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error })}
    conn.query(
      'DELETE FROM produtos WHERE id_produto = ?;',
      [req.body.id_produto],
      (error, result, field) => {
        conn.release();
        if(error) { return res.status(500).send({ error: error })}
        const response = {
          mensagem: 'Produto Excluídodo com sucesso.',
          request: {
            tipo: 'POST',
            descricao: 'Insere um Produto',
            url: 'http://localhost:3000/produtos',
            body: {
              nome: 'String',
              preco: 'Float'
            }
          }
        }        
        return res.status(202).send(response);
      }
    )
  });
};