import { StyleSheet, Text, View } from "react-native";

type ExpenseHeaderCardProps = {
  text: string;
  value: number;
};

export default function ExpenseHeaderCard({
  text,
  value,
}: ExpenseHeaderCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E", // Dark card background
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3, // Slightly stronger shadow for dark mode
    shadowRadius: 4,
    // Elevation for Android
    elevation: 4,
    borderWidth: 1,
    borderColor: "#333", // Subtle border for definition
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E0E0E0", // Light text color
    textAlign: "center",
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#BB86FC", // Accent color for value
    textAlign: "center",
  },
});
