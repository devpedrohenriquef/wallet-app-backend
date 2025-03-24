require("dotenv").config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require("express"); // Importa o framework Express
const cors = require("cors"); // Importa o pacote CORS para permitir requisições de diferentes origens
const db = require("./db"); // Importa a configuração do banco de dados
const routesCategories = require("./routes/categories"); // Importa as rotas de categorias
const routesUser = require("./routes/users"); // Importa as rotas de usuários
const routesFinances = require("./routes/finances"); // Importa as rotas de finanças

const app = express(); // Inicializa a aplicação Express

app.use(
  cors({
    origin: "*", // Permite requisições de qualquer origem (pode ser ajustado para maior segurança)
  })
);

app.use(express.json()); // Habilita o uso de JSON no corpo das requisições

const port = process.env.PORT; // Define a porta do servidor a partir das variáveis de ambiente

// Rota principal da aplicação
app.get("/", (req, res) => {
  res.send("Olá, essa é a aplicação Wallet App!"); // Responde com uma mensagem simples
});

// Define as rotas da aplicação
app.use("/categories", routesCategories); // Rota para categorias
app.use("/users", routesUser); // Rota para usuários
app.use("/finances", routesFinances); // Rota para finanças

// Inicia o servidor e conecta ao banco de dados
app.listen(port, () => {
  db.connect()
    .then(() => {
      console.log("DB connected"); // Mensagem de sucesso na conexão com o banco
    })
    .catch((error) => {
      throw new Error(error); // Lança um erro caso a conexão falhe
    });
  console.log(`Example app listening on port ${port}`); // Mensagem informando a porta do servidor
});
