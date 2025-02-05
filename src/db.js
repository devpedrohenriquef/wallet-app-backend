// Importa a classe Pool do módulo 'pg' para gerenciar a conexão com o banco de dados PostgreSQL
const { Pool } = require("pg");

// Configuração da conexão com o banco de dados PostgreSQL
const db = new Pool({
  user: "docker", // Nome do usuário do banco de dados
  password: "docker", // Senha do banco de dados
  database: "finances", // Nome do banco de dados utilizado
  host: "localhost", // Endereço do servidor do banco de dados
  port: 5432, // Porta padrão do PostgreSQL
});

// Exporta a instância de conexão para ser utilizada em outras partes da aplicação
module.exports = db;
