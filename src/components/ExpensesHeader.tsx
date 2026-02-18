import { StyleSheet, View } from "react-native";
import ExpenseHeaderCard from "./ExpenseHeaderCard";
import AllExpenses from "@/src/server/expense/AllExpenses";
import { useEffect, useState } from "react";

type ExpensesHeaderProps = {
  allExpenses: AllExpenses | null;
};

export default function ExpensesHeader({
  allExpenses,
}: ExpensesHeaderProps) {
  const [totalEurCount, setTotalEurCount] = useState(0);
  const [totalEurSum, setTotalEurSum] = useState(0);
  const [totalRonCount, setTotalRonCount] = useState(0);
  const [totalRonSum, setTotalRonSum] = useState(0);


  useEffect(() => {
    if (allExpenses) {
      setTotalEurCount(allExpenses.expenses.filter((expense) => expense.currency === "EUR").length)
      setTotalRonCount(allExpenses.expenses.filter((expense) => expense.currency === "RON").length)
      setTotalEurSum(allExpenses.expenses.filter((expense) => expense.currency === "EUR").reduce((acc, expense) => acc + expense.amount, 0))
      setTotalRonSum(allExpenses.expenses.filter((expense) => expense.currency === "RON").reduce((acc, expense) => acc + expense.amount, 0))
    }
  }, [allExpenses]);

  return (
    <View style={styles.container}>
      <ExpenseHeaderCard text="EUR expenses" value={totalEurCount} />
      <ExpenseHeaderCard text="EUR total sum" value={totalEurSum}/>
      <ExpenseHeaderCard text="RON expenses" value={totalRonCount} />
      <ExpenseHeaderCard text="RON total sum" value={totalRonSum} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
});
