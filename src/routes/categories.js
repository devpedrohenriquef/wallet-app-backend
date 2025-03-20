const express = require("express");
const router = express.Router();
const db = require("../db");
const categoriesQueries = require("../queries/categories");

// Endpoint para listar todas as categorias
router.get("/", async (req, res) => {
  try {
    const response = await db.query(
      "SELECT * FROM categories ORDER BY name ASC"
    );
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint para criar uma nova categoria
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.length < 3) {
      return res
        .status(400)
        .json({ error: "Name should have more than 3 characters" });
    }

    const text = "INSERT INTO categories(name) VALUES($1) RETURNING *";
    const values = [name];

    const response = await db.query(text, values);
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint para deletar uma categoria
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Param id is mandatory." });
    }

    // Verifica se a categoria existe
    const query = categoriesQueries.findById(id);
    const category = await db.query(query);
    if (!category.rows[0]) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Exclui a categoria
    const text = "DELETE FROM categories WHERE id = $1 RETURNING *";
    const values = [Number(id)];
    const deleteResponse = await db.query(text, values);

    return res.status(200).json({
      message: "Category deleted successfully",
      category: deleteResponse.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint para atualizar uma categoria
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Param id is mandatory." });
    }

    if (!name || name.length < 3) {
      return res
        .status(400)
        .json({ error: "Name should have more than 3 characters" });
    }

    // Verifica se a categoria existe
    const query = categoriesQueries.findById(id);
    const category = await db.query(query);
    if (!category.rows[0]) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Atualiza a categoria
    const text = "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *";
    const values = [name, id];
    const updateResponse = await db.query(text, values);

    return res.status(200).json(updateResponse.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
