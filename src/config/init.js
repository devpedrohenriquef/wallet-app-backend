// Importa a configuração do banco de dados e os comandos de criação das tabelas
const db = require("../db");
const tableQueries = require("../queries/tables");

// Função assíncrona para inicializar o banco de dados
const init = async () => {
  try {
    // Estabelece a conexão com o banco de dados
    await db.connect();
    // Cria o banco de dados (caso necessário)
    await db.query(tableQueries.createDatabase());
    // Cria a tabela de usuários
    await db.query(tableQueries.createUsers());
    // Cria a tabela de categorias
    await db.query(tableQueries.createCategories());
    // Cria a tabela de finanças com as chaves estrangeiras
    await db.query(tableQueries.createFinances());
    console.log("Successfully created tables"); // Confirma a criação das tabelas
    // Encerra a conexão com o banco de dados após a execução das queries
    await db.end();
    return;
  } catch (error) {
    // Lança um erro detalhado caso ocorra algum problema na configuração do banco de dados
    throw new Error("Error configuring database", error);
  }
};

// Executa a função de inicialização
init();
