// Objeto que contém consultas SQL relacionadas à tabela 'categories'
const categoriesQueries = {
  // Função para buscar uma categoria pelo ID
  findById: (id) => {
    return {
      name: "fetch-category", // Nome da query para facilitar o rastreamento no PostgreSQL
      text: "SELECT * FROM categories WHERE id = $1", // Consulta SQL parametrizada para evitar SQL Injection
      values: [Number(id)], // Parâmetro da consulta (ID da categoria a ser buscada, convertido para número)
    };
  },
};

// Exporta o objeto 'categoriesQueries' para ser utilizado em outras partes da aplicação
module.exports = categoriesQueries;
