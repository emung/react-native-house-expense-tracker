import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import ExpenseService from "../server/expense/ExpenseService";

const expenseService = new ExpenseService();

export default function Index() {
  const [expenseId, setExpenseId] = useState("");

  const fetchExpenseById = async (id: number) =>
    await expenseService.getExpenseById(id);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Type expense ID"
        onChangeText={setExpenseId}
        style={{
          height: 40,
          padding: 5,
          marginHorizontal: 8,
          borderWidth: 1,
        }}
      />
      <Pressable
        style={styles.button}
        onPress={() => fetchExpenseById(Number(expenseId))}
      >
        <Text>Get Expense</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 10,
    backgroundColor: "lightblue",
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
  },
});
