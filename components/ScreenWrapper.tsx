import React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";

import sharedStyles from "@/styles/sharedStyles";

interface ScreenWrapperProps {
  children: React.ReactNode;
  title?: string;
  withScroll?: boolean;
}

function ScreenWrapper({ children, title, withScroll = false }: ScreenWrapperProps) {
  const { colors } = useTheme();
  const Container = withScroll ? ScrollView : View;

  return (
    <SafeAreaView
      style={[sharedStyles.screen, { backgroundColor: colors.background }]}
      edges={["bottom", "left", "right"]}
    >
      <Container style={sharedStyles.content}>
        {title && <Text style={sharedStyles.title}>{title}</Text>}
        {children}
      </Container>
    </SafeAreaView>
  );
}

export default ScreenWrapper;