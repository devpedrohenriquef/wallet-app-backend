const express = require("express");
const router = express.Router();
const db = require("../db");
const categoriesQueries = require("../queries/categories");
const usersQueries = require("../queries/users");

// Rota para criar uma nova entrada financeira
router.post("/", async (req, res) => {
  try {
    const { email } = req.headers; // Obtém o e-mail do usuário a partir dos headers
    const { category_id, title, date, value } = req.body; // Obtém os dados do corpo da requisição

    // Validação do e-mail
    if (email.length < 5 || !email.includes("@")) {
      return res.status(400).json({ error: "E-mail is invalid." });
    }

    // Validação dos campos obrigatórios
    if (!category_id) {
      return res.status(400).json({ error: "Category is mandatory" });
    }

    if (!value) {
      return res.status(400).json({ error: "Value is mandatory" });
    }

    if (!title || title.length < 3) {
      return res.status(400).json({
        error: "Title is mandatory and should have more than 3 characters",
      });
    }

    if (!date || date.length != 10) {
      return res.status(400).json({
        error: "Date is mandatory and should be in the format yyyy-mm-dd",
      });
    }

    // Busca o usuário no banco de dados pelo e-mail
    const userQuery = await db.query(usersQueries.findByEmail(email));
    if (!userQuery.rows[0]) {
      return res.status(404).json({ error: "User does not exist." });
    }

    // Busca a categoria para garantir que ela existe
    const category = await db.query(categoriesQueries.findById(category_id));
    if (!category.rows[0]) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Insere a nova entrada financeira no banco de dados
    const text =
      "INSERT INTO finances(user_id, category_id, date, title, value) VALUES($1, $2, $3, $4, $5) RETURNING *";
    const values = [userQuery.rows[0].id, category_id, date, title, value];

    const createResponse = await db.query(text, values);
    if (!createResponse.rows[0]) {
      return res.status(400).json({ error: "Finance row not created" });
    }

    // Retorna a entrada financeira criada
    return res.status(200).json(createResponse.rows[0]);
  } catch (error) {
    return res.status(500).json(error); // Retorna erro interno do servidor
  }
});

// Rota para excluir uma entrada financeira
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Obtém o ID da entrada financeira a ser deletada
    const { email } = req.headers; // Obtém o e-mail do usuário

    // Validação do e-mail
    if (email.length < 5 || !email.includes("@")) {
      return res.status(400).json({ error: "E-mail is invalid." });
    }

    // Validação do ID
    if (!id) {
      return res.status(400).json({ error: "Id is mandatory" });
    }

    // Busca o usuário no banco de dados pelo e-mail
    const userQuery = await db.query(usersQueries.findByEmail(email));
    if (!userQuery.rows[0]) {
      return res.status(404).json({ error: "User does not exist." });
    }

    // Busca a entrada financeira no banco de dados pelo ID
    const findFinanceText = "SELECT * FROM finances WHERE id=$1";
    const findFinanceValue = [Number(id)];
    const financeItemQuery = await db.query(findFinanceText, findFinanceValue);

    if (!financeItemQuery.rows[0]) {
      return res.status(400).json({ error: "Finance row not found" });
    }

    // Verifica se a entrada financeira pertence ao usuário autenticado
    if (financeItemQuery.rows[0].user_id !== userQuery.rows[0].id) {
      return res
        .status(401)
        .json({ error: "Finance row does not belong to the user" });
    }

    // Deleta a entrada financeira
    const text = "DELETE FROM finances WHERE id = $1 RETURNING *";
    const values = [Number(id)];
    const deleteResponse = await db.query(text, values);

    if (!deleteResponse.rows[0]) {
      return res.status(400).json({ error: "Finance row not deleted" });
    }

    // Retorna a entrada financeira deletada
    return res.status(200).json(deleteResponse.rows[0]);
  } catch (error) {
    return res.status(500).json(error); // Retorna erro interno do servidor
  }
});

router.get("/", async (req, res) => {
  try {
    // Obtém a data dos parâmetros da URL e o e-mail do cabeçalho da requisição
    const { date } = req.query;
    const { email } = req.headers;

    // Valida se a data foi fornecida e se está no formato correto (yyyy-mm-dd)
    if (!date || date.length != 10) {
      return res.status(400).json({
        error: "Date is mandatory and should be in the format yyyy-mm-dd",
      });
    }

    // Valida se o e-mail foi fornecido corretamente (mínimo 5 caracteres e contém "@")
    if (email.length < 5 || !email.includes("@")) {
      return res.status(400).json({ error: "E-mail is invalid." });
    }

    // Consulta o banco de dados para buscar o usuário pelo e-mail
    const userQuery = await db.query(usersQueries.findByEmail(email));

    // Se o usuário não for encontrado, retorna um erro 404
    if (!userQuery.rows[0]) {
      return res.status(404).json({ error: "User does not exist." });
    }

    // Converte a string de data recebida em um objeto Date
    const dateObject = new Date(date);

    // Extrai o ano e o mês da data informada
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth(); // Janeiro = 0, Fevereiro = 1, etc.

    // Define o primeiro dia do mês no formato ISO (exemplo: '2025-03-01T00:00:00.000Z')
    const initDate = new Date(year, month, 1).toISOString();

    // Define o último dia do mês no formato de string de data (exemplo: 'Sat Mar 31 2025')
    const finDate = new Date(year, month + 1, 0).toDateString();

    // Query para buscar os registros financeiros do usuário dentro do período selecionado
    const text =
      "SELECT fin.title, fin.value, fin.date, fin.user_id, fin.category_id, cat.name FROM finances as fin JOIN categories as cat ON fin.category_id = cat.id WHERE fin.user_id = $1 AND fin.date BETWEEN $2 AND $3 ORDER BY fin.date ASC ";

    // Parâmetros da consulta: ID do usuário, data inicial e data final
    const values = [userQuery.rows[0].id, initDate, finDate];

    // Executa a query no banco de dados
    const financesQuery = await db.query(text, values);

    // Retorna os registros encontrados no formato JSON
    return res.status(200).json(financesQuery.rows);
  } catch (error) {
    // Em caso de erro interno, retorna um erro 500 com a mensagem de erro
    return res.status(500).json(error);
  }
});

module.exports = router;
