// Importa a classe Pool do módulo 'pg' para gerenciar a conexão com o banco de dados PostgreSQL
require("dotenv").config();
const { Pool } = require("pg");

const { DB_USER, DB_PASSWORD, DB_NAME, DB_POST, DB_PORT } = process.env;

// Configuração da conexão com o banco de dados PostgreSQL
const db = new Pool({
  user: DB_USER, // Nome do usuário do banco de dados
  password: DB_PASSWORD, // Senha do banco de dados
  database: DB_NAME, // Nome do banco de dados utilizado
  host: DB_POST, // Endereço do servidor do banco de dados
  port: Number(DB_PORT), // Porta padrão do PostgreSQL
});

// Exporta a instância de conexão para ser utilizada em outras partes da aplicação
module.exports = db;
