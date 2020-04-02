const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.cadastrarUsuario = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if(err) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM usuarios WHERE descricao = ?', [req.body.descricao], (error, results) => {
      if(error){ return res.status(500).send({ error: error }) }
      if(results.length > 0){
        res.status(409).send({ mensagem: 'Usário já cadastrado' })
      }else{
        bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
          if(errBcrypt){  return res.status(500).send({ error: errBcrypt }) }
          conn.query(
            `INSERT INTO usuarios (descricao, senha) VALUES(?,?)`,
            [req.body.descricao, hash],
            (error, results) => {
              conn.release();
              if(error){ return res.status(500).send({ error: error }) }
              response = {
                mensagem: 'Usuário cadastrado com sucesso.',
                usuarioCriado: {
                  id_usuario: results.insertId,
                  descricao: req.body.descricao,              
                }
              }
              return res.status(201).send(response);
            })
        });
      }
    })
  });
};

exports.Login = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error }) }
    const query = `SELECT * from usuarios WHERE descricao = ?`;
    conn.query(query, [req.body.descricao], (error, results, fields) => {
      conn.release();
      if(error) { return res.status(500).send({ error: error }) }
      if(results.length < 1) {
        return res.status(401).send({ mensagem: 'Falha na autenticação.' });
      }
      bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
        if(err){
          return res.status(500).send({ error: error })
        }
        if(result) {
          const token = jwt.sign({
            id_usuario: results[0].id_usuario,
            descricao: results[0].descricao,
          }, 
          process.env.JWT_KEY,
          {
            expiresIn: "1h"
          });
          return res.status(200).send({ 
            mensagem: 'Autenticado com sucesso.' ,
            token: token
          });
        }
        return res.status(401).send({ mensagem: 'Falha na autenticação.' });
      });
    });
  });
}
