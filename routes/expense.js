const express = require("express");
const router = express.Router();
const Expense = require("../models/expense");
const auth = require("../middleware/auth");

// GET expenses for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const exp = await Expense.find({ user: req.user.id });
    res.json(exp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new Expense for logged-in user
router.post("/add", auth, async (req, res) => {
  const { amount, category, date, note, description } = req.body;

  try {
    const newExp = new Expense({
      amount,
      category,
      date,
      note,
      description,
      user: req.user.id, // attach logged in user
    });
    const savedExp = await newExp.save();
    res.status(201).json(savedExp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an expense only if it belongs to logged-in user
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExp = await Expense.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!deletedExp) {
      return res
        .status(404)
        .json({ message: "Expense not found or not yours" });
    }

    res.json({ message: "Expense deleted", deletedExp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
