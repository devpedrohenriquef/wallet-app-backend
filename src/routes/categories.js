const express = require("express");
const router = express.Router();
const db = require("../db");

// Endpoint para listar todas as categorias
router.get("/", (req, res) => {
  db.query("SELECT * FROM categories", (error, response) => {
    if (error) {
      return res.status(500).json(error);
    }
    return res.status(200).json(response.rows);
  });
});

// Endpoint para criar uma nova categoria
router.post("/", (req, res) => {
  const { name } = req.body;

  // Validação: nome deve ter pelo menos 3 caracteres
  if (!name || name.length < 3) {
    return res
      .status(400)
      .json({ error: "Name should have more than 3 characters" });
  }

  // Consulta SQL corrigida para inserir na tabela `categories`
  const text = "INSERT INTO categories(name) VALUES($1) RETURNING *";
  const values = [name];

  db.query(text, values, (error, response) => {
    if (error) {
      return res.status(500).json(error);
    }
    return res.status(200).json(response.rows[0]); // Retorna apenas o registro criado
  });
});

module.exports = router;
