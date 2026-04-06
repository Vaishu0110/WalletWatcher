const xlsx = require('xlsx');
const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({message: "Unauthorized access"});
    }

    const userId = req.user.id;

    try {
        const {icon, category, amount, date} = req.body;

        if (!category || !amount || !date) {
            return res.status(400).json({message: "All fields are mandatory to fill."});
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (error) {
        console.error("addExpense error:", error);
        res.status(500).json({message: "Server Error", details: error.message});
    }
};

exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({userId}).sort({date: -1});
        res.json(expense);
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
};

exports.updateExpense = async(req, res) => {
    try {
        const {category, amount, date, icon} = req.body;

        if(!category || !amount| !date) {

            return res.status(400).json({message: "All fields are required"});
        }
        
        const updateExpense = await Expense.findOneAndUpdate(
            {_id: req.params.id, userId: req.user.id},
            {
                category, amount,
                date: new Date(date),
                icon,
            },
            {new: true}
        );

        if(!updateExpense) {
            return res.status(404).json({message: "Expense entry not found."});
        }

        res.status(200).json(updateExpense);
    } catch (error) {
        res.status(500).json({message: "Server Error", details: error.message});
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({message: "Expense entry deleted successfully."});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
};

exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({userId}).sort({date: -1});

        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "expense");
        xlsx.writeFile(wb, "expense_details.xlsx");
        res.download("expense_details.xlsx");
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
};
