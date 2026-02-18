import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ExpensesHeader from "../components/ExpensesHeader";
import AllExpenses from "../server/expense/AllExpenses";
import ExpenseService from "../server/expense/ExpenseService";

const expenseService = new ExpenseService();

export default function Index() {
  const [allExpensesWithMeta, setAllExpensesWithMeta] =
    useState<AllExpenses | null>(null);

  useEffect(() => {
    (async () => {
      const allExpensesResponse: AllExpenses = await fetchAllExpenses();
      setAllExpensesWithMeta(allExpensesResponse);
    })();
  }, []);

  const fetchAllExpenses = async () => {
    return await expenseService.getAllExpenses();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>House expenses</Text>
      <ExpensesHeader allExpenses={allExpensesWithMeta} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 60,
    paddingLeft: 20,
    backgroundColor: "#121212", // Dark background
  },
  button: {
    padding: 10,
    backgroundColor: "#BB86FC", // Light purple accent for dark mode
    borderRadius: 5,
    borderColor: "#3700B3",
    borderWidth: 1,
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E0E0E0", // Light text color
    marginBottom: 20,
  },
});
