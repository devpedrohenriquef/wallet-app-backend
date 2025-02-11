// Define um conjunto de queries para a criação das tabelas do banco de dados
const createTablesQueries = {
  // Criação do banco de dados "finances"
  createDatabase: () => {
    return {
      name: "create-database",
      text: "CREATE DATABASE finances",
    };
  },
  // Criação da tabela "users" para armazenar informações dos usuários
  createUsers: () => {
    return {
      name: "create-users",
      text: "CREATE TABLE users(id SERIAL PRIMARY KEY NOT NULL,name TEXT NOT NULL,email TEXT UNIQUE NOT NULL)",
    };
  },
  // Criação da tabela "categories" para armazenar categorias financeiras
  createCategories: () => {
    return {
      name: "create-categories",
      text: "CREATE TABLE categories(id SERIAL PRIMARY KEY NOT NULL, name TEXT NOT NULL)",
    };
  },
  // Criação da tabela "finances" para armazenar transações financeiras
  createFinances: () => {
    return {
      name: "create-finances",
      text: "CREATE TABLE finances(id SERIAL PRIMARY KEY NOT NULL, user_id INT, category_id INT, date DATE, title TEXT, value NUMERIC, CONSTRAINT fk_users FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, CONSTRAINT fk_categories FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL)",
    };
  },
};

// Exporta as queries para serem utilizadas em outros módulos do sistema
module.exports = createTablesQueries;
