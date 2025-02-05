// Objeto que contém consultas SQL relacionadas à tabela 'users'
const usersQueries = {
  // Função para buscar um usuário pelo e-mail
  findByEmail: (email) => {
    return {
      name: "fetch-user", // Nome da query para facilitar o rastreamento no PostgreSQL
      text: "SELECT * FROM users WHERE email = $1", // Consulta SQL parametrizada para evitar SQL Injection
      values: [email], // Parâmetro da consulta (e-mail do usuário a ser buscado)
    };
  },
};

// Exporta o objeto 'usersQueries' para ser utilizado em outras partes da aplicação
module.exports = usersQueries;
