const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');

// GET all todos
router.get('/', async (req, res) => {
  try {
    const items = await Todo.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new todo
router.post('/add', async (req, res) => {
  const { name, description } = req.body;

  try {
    const newItem = new Todo({ name, description });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a todo by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Todo.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Todo item not found' });
    }

    res.json({ message: 'Todo item deleted', deletedItem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
