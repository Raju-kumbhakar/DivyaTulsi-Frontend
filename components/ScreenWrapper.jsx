import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ScreenWrapper = ({ children, bg = "#000" }) => {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: top,
        backgroundColor: bg,
      }}
    >
      {children}
    </View>
  );
};

export default ScreenWrapper;