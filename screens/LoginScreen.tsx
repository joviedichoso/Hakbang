"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
} from "react-native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RouteProp } from "@react-navigation/native"
import twrnc from "twrnc"
import CustomText from "../components/CustomText"
import CustomModal from "../components/CustomModal"
import { FontAwesome } from "@expo/vector-icons"
import type { RootStackParamList } from "../types/navigation"

const { width, height } = Dimensions.get("window")
const isSmallDevice = width < 375

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">
type LoginScreenRouteProp = RouteProp<RootStackParamList, "Login">

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp
  route: LoginScreenRouteProp
  // Add the new navigation props
  navigateToLanding: () => void
  navigateToSignUp: () => void
  navigateToDashboard: () => void
}

interface FormErrors {
  email: string
  password: string
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, route, navigateToLanding, navigateToSignUp, navigateToDashboard }) => {
  const [email, setEmail] = useState(route.params?.email || "")
  const [password, setPassword] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({ email: "", password: "" })
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalMessage, setModalMessage] = useState("")
  // Changed 'warning' to 'info' to match CustomModal's expected types, or ensure CustomModal supports 'warning'
  const [modalType, setModalType] = useState<"success" | "error" | "info">("error")
  const [registeredEmails, setRegisteredEmails] = useState<string[]>([])

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const headerSlideAnim = useRef(new Animated.Value(-50)).current
  const buttonScaleAnim = useRef(new Animated.Value(1)).current
  const inputShakeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const mockEmails = ["user@example.com", "test@hakbangquest.com", "demo@fitness.app"]
    setRegisteredEmails(mockEmails)

    // Start entrance animations
    animateScreenElements()
  }, [])

  useEffect(() => {
    setEmail(route.params?.email || "")
  }, [route.params?.email])

  const animateScreenElements = () => {
    // Reset animation values
    fadeAnim.setValue(0)
    slideAnim.setValue(50)
    headerSlideAnim.setValue(-50)

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(headerSlideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start()
  }

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const animateInputError = () => {
    Animated.sequence([
      Animated.timing(inputShakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(inputShakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(inputShakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(inputShakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const handleEmailSignIn = async () => {
    let hasError = false
    const newErrors: FormErrors = { email: "", password: "" }

    if (!email) {
      newErrors.email = "Email is required"
      hasError = true
    }
    if (!password) {
      newErrors.password = "Password is required"
      hasError = true
    }

    setErrors(newErrors)

    if (hasError) {
      animateInputError()
      return
    }

    animateButtonPress()
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      setModalTitle("Login Successful!")
      setModalMessage("Welcome back to HakbangQuest! Ready to continue your fitness journey?")
      setModalType("success")
      setModalVisible(true)
      setIsLoading(false)
    }, 2000)
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setModalTitle("Email Required")
      setModalMessage("Please enter your email address to reset your password.")
      // Changed 'warning' to 'info'
      setModalType("info")
      setModalVisible(true)
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setModalTitle("Password Reset Email Sent")
      setModalMessage(
        "A password reset email has been sent to your email address. Check your inbox and follow the instructions.",
      )
      setModalType("success")
      setModalVisible(true)
      setIsLoading(false)
    }, 1500)
  }

  const handleSelectEmail = (selectedEmail: string) => {
    setEmail(selectedEmail)
    setPassword("")
    setErrors({ email: "", password: "" })
  }

  const handleModalClose = async () => {
    setModalVisible(false)
    if (modalType === "success" && modalTitle === "Login Successful!") {
      // Use the passed navigateToDashboard prop
      navigateToDashboard()
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={twrnc`flex-1 bg-[#121826] p-5`}
    >
      <ScrollView contentContainerStyle={twrnc`flex-grow`} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <Animated.View
          style={[twrnc` items-center mb-6`, { transform: [{ translateY: headerSlideAnim }], opacity: fadeAnim }]}
        >
          <View style={twrnc`flex-1 items-center`}>
            <CustomText weight="medium" style={twrnc`text-white ${isSmallDevice ? "text-lg" : "text-xl"}`}>
              Sign In
            </CustomText>
          </View>
          <View style={twrnc`w-10`} />
        </Animated.View>

        <Animated.View style={[twrnc`flex-1`, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Welcome Section */}
          <View style={twrnc`mb-8`}>
            <CustomText weight="bold" style={twrnc`text-white ${isSmallDevice ? "text-3xl" : "text-4xl"} mb-2`}>
              Welcome Back
            </CustomText>
            <CustomText style={twrnc`text-[#8E8E93] ${isSmallDevice ? "text-sm" : "text-base"}`}>
              Sign in to your HakbangQuest account
            </CustomText>
          </View>

          {/* Registered Emails Section */}
          {registeredEmails.length > 0 && (
            <View style={twrnc`mb-6`}>
              <CustomText weight="medium" style={twrnc`text-white mb-3 ${isSmallDevice ? "text-sm" : "text-base"}`}>
                Quick Sign In
              </CustomText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {registeredEmails.map((emailItem, index) => (
                  <TouchableOpacity
                    key={index}
                    style={twrnc`bg-[#1E2538] p-3 rounded-xl mr-3 border border-gray-700`}
                    onPress={() => handleSelectEmail(emailItem)}
                    activeOpacity={0.7}
                  >
                    <View style={twrnc`flex-row items-center`}>
                      <View style={twrnc`bg-[#4361EE] p-2 rounded-full mr-3`}>
                        <FontAwesome name="user" size={14} color="white" />
                      </View>
                      <CustomText style={twrnc`text-white ${isSmallDevice ? "text-xs" : "text-sm"}`}>
                        {emailItem}
                      </CustomText>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Login Form */}
          <Animated.View style={[twrnc`mb-6`, { transform: [{ translateX: inputShakeAnim }] }]}>
            {/* Email Input */}
            <View style={twrnc`mb-4`}>
              <CustomText weight="medium" style={twrnc`text-white mb-2 ${isSmallDevice ? "text-sm" : "text-base"}`}>
                Email Address
              </CustomText>
              <View style={twrnc`relative`}>
                <TextInput
                  style={[
                    twrnc`bg-[#1E2538] rounded-xl p-4 text-white ${
                      isEmailFocused ? "border-2 border-[#4361EE]" : "border border-gray-600"
                    } ${errors.email ? "border-red-500" : ""}`,
                    { fontFamily: "Poppins-Regular", fontSize: isSmallDevice ? 14 : 16 },
                  ]}
                  placeholder="Enter your email"
                  placeholderTextColor="#8E8E93"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text)
                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
                  }}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              {errors.email ? (
                <View style={twrnc`flex-row items-center mt-2`}>
                  <FontAwesome name="exclamation-circle" size={14} color="#EF4444" />
                  <CustomText style={twrnc`text-red-500 ml-2 ${isSmallDevice ? "text-xs" : "text-sm"}`}>
                    {errors.email}
                  </CustomText>
                </View>
              ) : null}
            </View>

            {/* Password Input */}
            <View style={twrnc`mb-6`}>
              <CustomText weight="medium" style={twrnc`text-white mb-2 ${isSmallDevice ? "text-sm" : "text-base"}`}>
                Password
              </CustomText>
              <View style={twrnc`relative`}>
                <TextInput
                  style={[
                    twrnc`bg-[#1E2538] rounded-xl p-4 pr-12 text-white ${
                      isPasswordFocused ? "border-2 border-[#4361EE]" : "border border-gray-600"
                    } ${errors.password ? "border-red-500" : ""}`,
                    { fontFamily: "Poppins-Regular", fontSize: isSmallDevice ? 14 : 16 },
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor="#8E8E93"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text)
                    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }))
                  }}
                  secureTextEntry={!isPasswordVisible}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <TouchableOpacity
                  style={twrnc`absolute right-4 top-4`}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <FontAwesome name={isPasswordVisible ? "eye" : "eye-slash"} size={16} color="#8E8E93" />
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <View style={twrnc`flex-row items-center mt-2`}>
                  <FontAwesome name="exclamation-circle" size={14} color="#EF4444" />
                  <CustomText style={twrnc`text-red-500 ml-2 ${isSmallDevice ? "text-xs" : "text-sm"}`}>
                    {errors.password}
                  </CustomText>
                </View>
              ) : null}
            </View>

            {/* Sign In Button */}
            <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
              <TouchableOpacity
                style={twrnc`bg-[#4361EE] py-4 rounded-xl items-center flex-row justify-center ${
                  isLoading ? "opacity-70" : ""
                }`}
                onPress={handleEmailSignIn}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" style={twrnc`mr-2`} />
                ) : (
                  <FontAwesome name="sign-in" size={18} color="white" style={twrnc`mr-2`} />
                )}
                <CustomText weight="bold" style={twrnc`text-white ${isSmallDevice ? "text-base" : "text-lg"}`}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </CustomText>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          {/* Forgot Password */}
          <View style={twrnc`flex-row justify-center mb-6`}>
            <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading} activeOpacity={0.7}>
              <CustomText style={twrnc`text-[#FFC107] ${isSmallDevice ? "text-sm" : "text-base"}`}>
                Forgot Password?
              </CustomText>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={twrnc`bg-[#1E2538] p-4 rounded-xl border border-gray-700`}>
            <View style={twrnc`flex-row justify-center items-center`}>
              <CustomText style={twrnc`text-[#8E8E93] ${isSmallDevice ? "text-sm" : "text-base"}`}>
                Don't have an account?
              </CustomText>
              <TouchableOpacity onPress={navigateToSignUp} style={twrnc`ml-1`} activeOpacity={0.7}>
                <CustomText weight="bold" style={twrnc`text-[#FFC107] ${isSmallDevice ? "text-sm" : "text-base"}`}>
                  Sign Up
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Enhanced Modal */}
        <CustomModal
          visible={modalVisible}
          onClose={handleModalClose}
          title={modalTitle}
          message={modalMessage}
          type={modalType}
        />



      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen
