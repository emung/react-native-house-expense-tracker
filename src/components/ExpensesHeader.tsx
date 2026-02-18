import AllExpenses from "@/src/server/expense/AllExpenses";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import ExpenseHeaderCard from "./ExpenseHeaderCard";

type ExpensesHeaderProps = {
  allExpenses: AllExpenses | null;
};

export default function ExpensesHeader({ allExpenses }: ExpensesHeaderProps) {
  const [totalEurCount, setTotalEurCount] = useState(0);
  const [totalEurSum, setTotalEurSum] = useState(0);
  const [totalRonCount, setTotalRonCount] = useState(0);
  const [totalRonSum, setTotalRonSum] = useState(0);

  useEffect(() => {
    if (allExpenses) {
      setTotalEurCount(
        allExpenses.expenses.filter((expense) => expense.currency === "EUR")
          .length
      );
      setTotalRonCount(
        allExpenses.expenses.filter((expense) => expense.currency === "RON")
          .length
      );
      setTotalEurSum(
        allExpenses.expenses
          .filter((expense) => expense.currency === "EUR")
          .reduce((acc, expense) => acc + expense.amount, 0)
      );
      setTotalRonSum(
        allExpenses.expenses
          .filter((expense) => expense.currency === "RON")
          .reduce((acc, expense) => acc + expense.amount, 0)
      );
    }
  }, [allExpenses]);

  return (
    <View style={styles.container}>
      <ExpenseHeaderCard text="EUR count" value={totalEurCount} />
      <ExpenseHeaderCard text="EUR sum" value={totalEurSum} />
      <ExpenseHeaderCard text="RON count" value={totalRonCount} />
      <ExpenseHeaderCard text="RON sum" value={totalRonSum} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#121212",
    width: "100%",
  },
});
