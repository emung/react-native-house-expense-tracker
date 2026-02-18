import Expense from "@/src/server/expense/Expense";
import { StyleSheet, Text, View } from "react-native";

type ExpenseCardProps = {
  expense: Expense;
};

export default function ExpenseCard({ expense }: ExpenseCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Text style={styles.description}>{expense.description}</Text>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{expense.category}</Text>
        </View>
        <Text style={styles.recipient}>{expense.recipient}</Text>
        <Text style={styles.date}>
          {new Date(expense.date).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.amount}>
          {expense.amount} {expense.currency}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E1E1E", // Dark card background
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    width: "100%",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 4,
    borderWidth: 1,
    borderColor: "#333",
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
  },
  rightContent: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  description: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E0E0E0", // Light text color
    marginBottom: 4,
  },
  categoryContainer: {
    backgroundColor: "#3700B3", // Darker purple for category chip
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  recipient: {
    fontSize: 14,
    color: "#B0B0B0", // Slightly dimmer text
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: "#808080", // Dimmer text for date
  },
  amount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#BB86FC", // Accent color for amount
  },
});
