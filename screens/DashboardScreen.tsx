import type React from "react"
import { View, TouchableOpacity } from "react-native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { FontAwesome } from "@expo/vector-icons"
import twrnc from "twrnc"
import CustomText from "../components/CustomText"
import type { RootStackParamList } from "../types/navigation"

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Dashboard">

interface DashboardScreenProps {
  navigation: DashboardScreenNavigationProp
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  return (
    <View style={twrnc`flex-1 bg-[#121826] p-5 justify-center items-center`}>
      <View style={twrnc`bg-[#4361EE] p-4 rounded-full mb-6`}>
        <FontAwesome name="trophy" size={48} color="#FFFFFF" />
      </View>

      <CustomText weight="bold" style={twrnc`text-white text-3xl mb-4 text-center`}>
        Welcome to Dashboard!
      </CustomText>

      <CustomText style={twrnc`text-[#8E8E93] text-base mb-8 text-center`}>Your fitness journey starts here</CustomText>

      <TouchableOpacity
        style={twrnc`bg-[#1E2538] py-3 px-6 rounded-xl border border-gray-600`}
        onPress={() => navigation.navigate("Landing")}
        activeOpacity={0.8}
      >
        <CustomText weight="medium" style={twrnc`text-[#FFC107]`}>
          Back to Landing
        </CustomText>
      </TouchableOpacity>
    </View>
  )
}

export default DashboardScreen
