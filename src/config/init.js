// Importa a configuração do banco de dados e os comandos de criação das tabelas
const db = require("../db");
const tableQueries = require("../queries/tables");

// Função assíncrona para inicializar o banco de dados
const init = async () => {
  try {
    await db.connect(); // Estabelece a conexão com o banco de dados
    await db.query(tableQueries.createDatabase()); // Cria o banco de dados (caso necessário)
    await db.query(tableQueries.createUsers()); // Cria a tabela de usuários
    await db.query(tableQueries.createCategories()); // Cria a tabela de categoria
    await db.query(tableQueries.createFinances()); // Cria a tabela de finanças com as chaves estrangeiras
    await db.end(); // Encerra a conexão com o banco de dados após a execução das queries
    return;
  } catch (error) {
    throw new Error("Error configuring database", error); // Lança um erro detalhado caso ocorra algum problema na configuração do banco de dados
  }
};

// Executa a função de inicialização
init();
