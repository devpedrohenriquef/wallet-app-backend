const express = require("express");
const router = express.Router();
const db = require("../db");
const usersQueries = require("../queries/users");

// Rota para criar um novo usuário
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validação: O nome deve ter pelo menos 3 caracteres
    if (name.length < 3) {
      return res
        .status(400)
        .json({ error: "Name should have more than 3 characters." });
    }

    // Validação: O e-mail deve ter pelo menos 5 caracteres e conter '@'
    if (email.length < 5 || !email.includes("@")) {
      return res.status(400).json({ error: "E-mail is invalid." });
    }

    // Verifica se o e-mail já existe no banco de dados
    const query = usersQueries.findByEmail(email);
    const alreadyExists = await db.query(query);
    if (alreadyExists.rows.length > 0) {
      return res.status(403).json({ error: "User already exists." });
    }

    // Inserção do novo usuário na tabela 'users'
    const text = "INSERT INTO users(name, email) VALUES($1,$2) RETURNING *";
    const values = [name, email];
    const createResponse = await db.query(text, values);

    // Verifica se o usuário foi criado com sucesso
    if (!createResponse.rows[0]) {
      return res.status(400).json({ error: "User not created" });
    }

    // Retorna os dados do usuário criado
    return res.status(201).json(createResponse.rows[0]); // Código 201 para criação bem-sucedida
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Rota para atualizar os dados de um usuário existente
router.put("/", async (req, res) => {
  try {
    const oldEmail = req.headers.email; // Obtém o e-mail do usuário a ser atualizado a partir dos headers
    const { name, email } = req.body;

    // Validação: O nome deve ter pelo menos 3 caracteres
    if (name.length < 3) {
      return res
        .status(400)
        .json({ error: "Name should have more than 3 characters." });
    }

    // Validação: O novo e-mail deve ter pelo menos 5 caracteres e conter '@'
    if (email.length < 5 || !email.includes("@")) {
      return res.status(400).json({ error: "E-mail is invalid." });
    }

    // Validação: O e-mail antigo (oldEmail) também deve ser válido
    if (oldEmail.length < 5 || !oldEmail.includes("@")) {
      return res.status(400).json({ error: "Old e-mail is invalid." });
    }

    // Verifica se o usuário com o e-mail antigo existe no banco de dados
    const query = usersQueries.findByEmail(oldEmail);
    const alreadyExists = await db.query(query);
    if (!alreadyExists.rows[0]) {
      return res.status(404).json({ error: "User does not exist." });
    }

    // Atualiza os dados do usuário (nome e e-mail)
    const text =
      "UPDATE users SET name =$1, email=$2 WHERE email=$3 RETURNING *";
    const values = [name, email, oldEmail];
    const updateResponse = await db.query(text, values);

    // Verifica se a atualização foi bem-sucedida
    if (!updateResponse.rows[0]) {
      return res.status(400).json({ error: "User not updated" });
    }

    // Retorna os dados do usuário atualizado
    return res.status(200).json(updateResponse.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Rota para buscar um usuário pelo e-mail
router.get("/", async (req, res) => {
  try {
    const { email } = req.query; // Obtém o e-mail da query string

    // Validação: O e-mail deve ser válido
    if (!email || email.length < 5 || !email.includes("@")) {
      return res.status(400).json({ error: "E-mail is invalid." });
    }

    // Busca o usuário no banco de dados pelo e-mail fornecido
    const query = usersQueries.findByEmail(email);
    const userExist = await db.query(query);
    if (!userExist.rows[0]) {
      return res.status(404).json({ error: "User does not exist." });
    }

    // Retorna os dados do usuário encontrado
    return res.status(200).json(userExist.rows[0]);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router; // Exporta o roteador para ser usado no app principal
