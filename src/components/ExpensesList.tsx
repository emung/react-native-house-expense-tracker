import ExpenseCard from "@/src/components/ExpenseCard";
import Expense from "@/src/server/expense/Expense";
import { FlatList, StyleSheet, View } from "react-native";

type ExpensesListProps = {
  expenses: Expense[];
};
export default function ExpensesList({ expenses }: ExpensesListProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        renderItem={({ item }) => <ExpenseCard expense={item} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#121212",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
