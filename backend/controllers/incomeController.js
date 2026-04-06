const xlsx = require('xlsx');
const Income = require("../models/Income");

exports.addIncome = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({message: "Unauthorized access"});
    }

    const userId = req.user.id;

    try {
        const {icon, source, amount, date} = req.body;

        if (!source || !amount || !date) {
            return res.status(400).json({message: "All fields are mandatory to fill."});
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });

        await newIncome.save();
        res.status(200).json(newIncome);
    } catch (error) {
        console.error("addIncome error:", error);
        res.status(500).json({message: "Server Error", details: error.message});
    }
}

exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({userId}).sort({date: -1});
        res.json(income);
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
};

exports.updateIncome = async(req, res) => {
    try {
        const {source, amount, date, icon} = req.body;

        if (!source || !amount || !date) {
            return res.status(400).json({message: "All fields are required."});
        }

        const updateIncome = await Income.findOneAndUpdate(
            {_id: req.params.id, userId: req.user.id},
            {
                source,
                amount,
                date: new Date(date),
                icon,
            },
            {new: true}
        );

        if (!updateIncome) {
            return res.status(404).json({message: "Income entry not found"});
        }

        res.status(200).json(updateIncome);
    } catch (error) {
        res.status(500).json({message: "Server Error", details: error.message});
    }
};

exports.deleteIncome = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({message: "Income entry deleted successfully."});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
};

exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({userId}).sort({date: -1});

        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, "income_details.xlsx");
        res.download("income_details.xlsx");
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
};
