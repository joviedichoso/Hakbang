import type React from "react"
import { Text, type TextProps } from "react-native"

interface CustomTextProps extends TextProps {
  weight?: "regular" | "medium" | "semibold" | "bold"
  children: React.ReactNode
}

const CustomText: React.FC<CustomTextProps> = ({ weight = "regular", style, children, ...props }) => {
  const getFontFamily = () => {
    switch (weight) {
      case "medium":
        return "Poppins-Medium"
      case "semibold":
        return "Poppins-SemiBold"
      case "bold":
        return "Poppins-Bold"
      default:
        return "Poppins-Regular"
    }
  }

  return (
    <Text style={[{ fontFamily: getFontFamily() }, style]} {...props}>
      {children}
    </Text>
  )
}

export default CustomText
