// Carrega variáveis de ambiente do arquivo .env
require("dotenv").config();

// Importa a classe Pool do módulo 'pg' para gerenciar a conexão com o banco de dados PostgreSQL
const { Pool } = require("pg");
const { connectionString } = require("pg/lib/defaults");

// Obtém as configurações do banco de dados a partir das variáveis de ambiente
const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT, DB_URL } = process.env;

// Configuração da conexão com o banco de dados PostgreSQL
const db = new Pool(
  DB_URL
    ? {
        connectionStrin: DB_URL,
      }
    : {
        user: DB_USER, // Usuário do banco de dados
        password: DB_PASSWORD, // Senha do banco de dados
        database: DB_NAME, // Nome do banco de dados
        host: DB_HOST, // Endereço do servidor do banco de dados
        port: Number(DB_PORT), // Porta do PostgreSQL (convertida para número)
      }
);

// Exporta a instância de conexão para ser utilizada em outras partes da aplicação
module.exports = db;
