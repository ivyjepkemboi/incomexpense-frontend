// Home.jsx
import { useState, useEffect } from "react";
import Income from "../../components/ecommerce/Income";
import ExpenseIncomeBarchart from "../../components/ecommerce/ExpenseIncomeBarchart";
import IncomeExpenseChart from "../../components/ecommerce/IncomeExpenseChart";
import PageMeta from "../../components/common/PageMeta";
import RecentExpenses from "../../components/ecommerce/RecentExpenses";
import RecentIncome from "../../components/ecommerce/RecentIncome";
import Button from "../../components/ui/button/Button";
import { BoxIcon } from "../../icons";
import AppHeader from "../../layout/AppHeader";
import Transactions from "../../components/transactions/Transactions";

export default function Home() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/signin";
          return;
        }

        const response = await fetch("http://127.0.0.1:5000/api/transactions", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const transactions = await response.json();
        let incomeTotal = 0;
        let expenseTotal = 0;
        transactions.forEach((transaction) => {
          if (transaction.type === "income") {
            incomeTotal += transaction.amount;
          } else if (transaction.type === "expense") {
            expenseTotal += transaction.amount;
          }
        });

        setTotalIncome(incomeTotal);
        setTotalExpenses(expenseTotal);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <PageMeta title="Income - Expense Tracker" description="This is an income-expense tracker" />
      <AppHeader />
      <Transactions />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <Income totalIncome={totalIncome} totalExpenses={totalExpenses} />
          <ExpenseIncomeBarchart totalExpenses={totalExpenses} />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <IncomeExpenseChart totalIncome={totalIncome} totalExpenses={totalExpenses} />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <RecentIncome />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <RecentExpenses />
        </div>
      </div>
    </>
  );
}