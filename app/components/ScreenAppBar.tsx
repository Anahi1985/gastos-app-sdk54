import React from "react";
import { StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";


function ScreenAppBar({ title, navigation }: any) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.fondo, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
    >
      <Appbar.Header style={{ backgroundColor: colors.card }} elevated={false}>
        {navigation?.canGoBack?.() && (
          <Appbar.BackAction onPress={() => navigation.goBack()} color={colors.text} />
        )}
        <Appbar.Content title={title} titleStyle={[styles.titulo, { color: colors.text }]} />
      </Appbar.Header>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  fondo: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  titulo: {
    fontWeight: "bold",
  },
});

export default ScreenAppBar;