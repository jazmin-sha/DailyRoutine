const express = require("express");
const router = express.Router();
const Expense = require("../models/expense");

// GET all Expenses
router.get("/", async (req, res) => {
  try {
    const exp = await Expense.find();
    res.json(exp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new Expense
router.post("/add", async (req, res) => {
  const { amount, category, date, note, description } = req.body;

  try {
    const newExp = new Expense({ amount, category, date, note, description });
    const savedExp = await newExp.save();
    res.status(201).json(savedExp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a Expense by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExp = await Expense.findByIdAndDelete(id);

    if (!deletedExp) {
      return res.status(404).json({ message: "Expense Expense not found" });
    }

    res.json({ message: "Expense Expense deleted", deletedExp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
