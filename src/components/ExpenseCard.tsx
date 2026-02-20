import Expense from "@/src/server/expense/Expense";
import { StyleSheet, Text, View } from "react-native";

type ExpenseCardProps = {
  expense: Expense;
};

export default function ExpenseCard({ expense }: ExpenseCardProps) {
  return (
    <View style={styles.container}>
      {/* Accent bar */}
      <View style={styles.accentBar} />

      <View style={styles.content}>
        {/* Top row: description + amount */}
        <View style={styles.topRow}>
          <Text style={styles.description} numberOfLines={1}>
            {expense.description}
          </Text>
          <Text style={styles.amount}>
            {expense.amount.toFixed(2)}{" "}
            <Text style={styles.currency}>{expense.currency}</Text>
          </Text>
        </View>

        {/* Recipient */}
        <Text style={styles.recipient}>{expense.recipient}</Text>

        {/* Bottom row: category chip + date */}
        <View style={styles.bottomRow}>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryText}>{expense.category}</Text>
          </View>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    borderRadius: 14,
    marginVertical: 6,
    width: "100%",
    overflow: "hidden",
    // Shadow – iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    // Shadow – Android
    elevation: 5,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  accentBar: {
    width: 4,
    backgroundColor: "#BB86FC",
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  content: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  description: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#F0F0F0",
    marginRight: 12,
  },
  amount: {
    fontSize: 18,
    fontWeight: "800",
    color: "#BB86FC",
  },
  currency: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9E9E9E",
  },
  recipient: {
    fontSize: 13,
    color: "#9E9E9E",
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryChip: {
    backgroundColor: "#6647AE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 12,
    color: "#707070",
  },
});
