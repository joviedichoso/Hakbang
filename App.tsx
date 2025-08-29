"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { View, ActivityIndicator } from "react-native"
import { Animated } from "react-native"
import { useFonts } from "expo-font"

// Screens
import LandingScreen from "./screens/LandingScreen"
import SignupScreen from "./screens/SignupScreen"
import LoginScreen from "./screens/LoginScreen"
import DashboardScreen from "./screens/DashboardScreen"

// Types
import type { RootStackParamList } from "./types/navigation"

interface AnimatedScreenWrapperProps {
  children: React.ReactNode
  isActive: boolean
  animationType?: "slide" | "fade" | "scale"
}

type ScreenType = "Landing" | "Signup" | "Login" | "Dashboard"

const AnimatedScreenWrapper: React.FC<AnimatedScreenWrapperProps> = ({
  children,
  isActive,
  animationType = "slide",
}) => {
  const fadeAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current
  const slideAnim = useRef(new Animated.Value(isActive ? 0 : 50)).current
  const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 0.95)).current

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isActive, fadeAnim, slideAnim, scaleAnim])

  if (!isActive) return null

  const getAnimationStyle = () => {
    switch (animationType) {
      case "fade":
        return {
          opacity: fadeAnim,
        }
      case "scale":
        return {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      case "slide":
      default:
        return {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
    }
  }

  return <Animated.View style={[{ flex: 1 }, getAnimationStyle()]}>{children}</Animated.View>
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>("Landing")
  const [loginEmail, setLoginEmail] = useState<string>("")
  const screenTransitionAnim = useRef(new Animated.Value(1)).current

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
  })

  const navigateWithAnimation = (newScreen: ScreenType) => {
    if (newScreen === activeScreen) return

    Animated.timing(screenTransitionAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setActiveScreen(newScreen)

      Animated.timing(screenTransitionAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    })
  }

  // Navigation functions
  const navigateToLanding = () => navigateWithAnimation("Landing")
  const navigateToSignUp = () => navigateWithAnimation("Signup")
  const navigateToSignIn = (email?: string) => {
    if (email) {
      setLoginEmail(email)
    }
    navigateWithAnimation("Login")
  }
  const navigateToDashboard = () => navigateWithAnimation("Dashboard")

  // Mock navigation objects for screens that need them
  const createMockNavigation = (currentScreen: keyof RootStackParamList) => ({
    navigate: (screen: keyof RootStackParamList, params?: any) => {
      switch (screen) {
        case "Landing":
          navigateToLanding()
          break
        case "Signup":
          navigateToSignUp()
          break
        case "Login":
          navigateToSignIn(params?.email)
          break
        case "Dashboard":
          navigateToDashboard()
          break
      }
    },
    goBack: () => {
      // Handle back navigation based on current screen
      switch (currentScreen) {
        case "Signup":
        case "Login":
          navigateToLanding()
          break
        case "Dashboard":
          navigateToSignIn()
          break
        default:
          navigateToLanding()
      }
    },
    // Add other navigation methods as needed
    push: () => {},
    pop: () => {},
    popToTop: () => {},
    replace: () => {},
    reset: () => {},
    setParams: () => {},
    dispatch: () => {},
    setOptions: () => {},
    isFocused: () => true,
    canGoBack: () => true,
    getId: () => undefined, // Fixed: Added return value
    getParent: () => undefined,
    getState: () => ({} as any),
  })

  const createMockRoute = (screenName: keyof RootStackParamList, params?: any) => ({
    key: `${screenName}-${Date.now()}`,
    name: screenName,
    params: params || {},
    path: undefined,
  })

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#121826" }}>
        <ActivityIndicator color="#4361EE" />
      </View>
    )
  }

  return (
    <Animated.View
      style={[
        { flex: 1, backgroundColor: "#121826" }, // Changed to match your app's background
        {
          transform: [{ scale: screenTransitionAnim }],
        },
      ]}
    >
      <AnimatedScreenWrapper isActive={activeScreen === "Landing"} animationType="fade">
        <LandingScreen 
          navigation={createMockNavigation("Landing") as any}
          route={createMockRoute("Landing") as any}
          navigateToSignUp={navigateToSignUp} 
          navigateToSignIn={navigateToSignIn} 
        />
      </AnimatedScreenWrapper>

      <AnimatedScreenWrapper isActive={activeScreen === "Signup"} animationType="scale">
        <SignupScreen 
          navigation={createMockNavigation("Signup") as any}
          navigateToLanding={navigateToLanding} 
          navigateToSignIn={navigateToSignIn} 
        />
      </AnimatedScreenWrapper>

      <AnimatedScreenWrapper isActive={activeScreen === "Login"} animationType="scale">
        <LoginScreen
          navigation={createMockNavigation("Login") as any}
          route={createMockRoute("Login", { email: loginEmail }) as any}
          navigateToLanding={navigateToLanding}
          navigateToSignUp={navigateToSignUp}
          navigateToDashboard={navigateToDashboard}
        />
      </AnimatedScreenWrapper>

      <AnimatedScreenWrapper isActive={activeScreen === "Dashboard"} animationType="slide">
        <DashboardScreen 
          navigation={createMockNavigation("Dashboard") as any}
          // Removed route prop since DashboardScreenProps doesn't expect it
        />
      </AnimatedScreenWrapper>
    </Animated.View>
  )
}
