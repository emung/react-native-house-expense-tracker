import { StyleSheet, Text, View } from "react-native";

type ExpenseHeaderCardProps = {
  text: string;
  value: number;
  suffix?: string;
};

export default function ExpenseHeaderCard({
  text,
  value,
  suffix,
}: ExpenseHeaderCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.value}>{value}{suffix ? ` ${suffix}` : ""}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 4,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#333",
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
    color: "#E0E0E0",
    textAlign: "center",
    marginBottom: 8,
  },
  value: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#BB86FC",
    textAlign: "center",
  },
});
