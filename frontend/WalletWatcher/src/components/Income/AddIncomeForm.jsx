import React, {useState, useEffect} from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddIncomeForm = ({onAddIncome, initialData = null, isEdit = false}) => {
    const [income, setIncome] = useState({
        source: "",
        amount: "",
        date: "",
        icon: "",
    });

    useEffect(() => {
        if (initialData) {
            setIncome({

                source: initialData.source || "",
                amount: initialData.amount || "",
                date: initialData.date
                    ? new Date(initialData.date)
                    : new Date(),
                icon:initialData.icon || "",
            });
        }
    }, [initialData]);

    const handleChange = (key, value) => 
        setIncome((prev) => ({...prev, [key]: value}));

    return (
        <div>
            <EmojiPickerPopup
                icon = {income.icon}
                onSelect = {(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value = {income.source}
                onChange = {({target}) => handleChange("source", target.value)}
                label = "Income Source"
                placeholder = "Freelance, Salary, etc"
                type = "text"
            />

            <Input
                value = {income.amount}
                onChange = {({target}) => handleChange("amount", target.value)}
                label = "Amount"
                placeholder = ""
                type = "number"
            />

            <Input 
                value = {income.date}
                onChange = {({target}) => handleChange("date", target.value)}
                label = "Date"
                placeholder = ""
                type = "Date"
            />

            <div className = "flex justify-end mt-6">
                <button
                    type = "button"
                    className = "add-btn add-btn-fill"
                    onClick = {() => onAddIncome(income)}
                >
                    {isEdit ? "Update Income" : "Add Income"}
                </button>
            </div>
        </div>
    );
};

export default AddIncomeForm