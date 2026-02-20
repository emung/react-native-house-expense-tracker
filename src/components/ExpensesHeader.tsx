import AllExpenses from "@/src/server/expense/AllExpenses";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
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
      <ExpenseHeaderCard text="EUR sum" value={totalEurSum} suffix="€" />
      <ExpenseHeaderCard text="RON count" value={totalRonCount} />
      <ExpenseHeaderCard text="RON sum" value={totalRonSum} suffix="RON" />
      <Pressable style={styles.addButton}>
        <Ionicons name="add" size={28} color="#BB86FC" />
      </Pressable>
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
  addButton: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    width: 44,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
