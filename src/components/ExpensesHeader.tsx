import { CurrencySum } from "@/src/server/expense/AllExpenses";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import ExpenseHeaderCard from "./ExpenseHeaderCard";

type ExpensesHeaderProps = {
  expensesMeta: CurrencySum[] | null;
};

export default function ExpensesHeader({ expensesMeta }: ExpensesHeaderProps) {
  const [totalEurCount, setTotalEurCount] = useState(0);
  const [totalEurSum, setTotalEurSum] = useState(0);
  const [totalRonCount, setTotalRonCount] = useState(0);
  const [totalRonSum, setTotalRonSum] = useState(0);

  useEffect(() => {
    if (expensesMeta) {
      const eurExpensesMeta = expensesMeta.find((meta) => meta.currency === "EUR");
      const ronExpensesMeta = expensesMeta.find((meta) => meta.currency === "RON");
      setTotalEurCount(
        eurExpensesMeta?.count || 0
      );
      setTotalRonCount(
        ronExpensesMeta?.count || 0
      );
      setTotalEurSum(
        eurExpensesMeta?.sum || 0
      );
      setTotalRonSum(
        ronExpensesMeta?.sum || 0
      );
    }
  }, [expensesMeta]);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.cardsContainer}>
        <ExpenseHeaderCard text="EUR count" value={totalEurCount} />
        <ExpenseHeaderCard text="EUR sum" value={totalEurSum} suffix="€" />
        <ExpenseHeaderCard text="RON count" value={totalRonCount} />
        <ExpenseHeaderCard text="RON sum" value={totalRonSum} suffix="RON" />
      </View>
      <Pressable style={styles.addButton}>
        <Ionicons name="add" size={28} color="#BB86FC" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#121212",
    width: "100%",
  },
  cardsContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  addButton: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 4,
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
