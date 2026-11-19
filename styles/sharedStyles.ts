import { StyleSheet } from "react-native";


export const SPACING = 16;
export const RADIUS = 12;

const sharedStyles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flex: 1, padding: SPACING },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: SPACING },
  card: {
    marginBottom: SPACING,
    borderRadius: RADIUS,
    elevation: 2,
  },
  fab: {
    position: "absolute",
    margin: SPACING,
    right: 0,
    bottom: 0,
  },
});

export default sharedStyles;