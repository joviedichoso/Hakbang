// LandingScreen.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { View, ImageBackground, ActivityIndicator, Pressable, Animated, Easing } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import tw from "twrnc"
import CustomText from "../components/CustomText"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../types/navigation"
import { StatusBar } from "expo-status-bar"

// Extend the Props type to include the new navigation functions
type Props = NativeStackScreenProps<RootStackParamList, "Landing"> & {
  navigateToSignUp: () => void
  navigateToSignIn: () => void
}

type FeatureItem = {
  icon: keyof typeof FontAwesome.glyphMap
  color: string
  label: string
}

const LandingScreen: React.FC<Props> = ({ navigation, navigateToSignUp, navigateToSignIn }) => {
  const [booting, setBooting] = useState(true)
  const [signupLoading, setSignupLoading] = useState(false)
  const [signinLoading, setSigninLoading] = useState(false)

  // animations
  const fade = useRef(new Animated.Value(0)).current
  const slideUp = useRef(new Animated.Value(50)).current
  const titleSlide = useRef(new Animated.Value(-30)).current
  const buttonScale = useRef(new Animated.Value(0.9)).current
  const pulse = useRef(new Animated.Value(1)).current

  // boot splash (short + cancel-safe)
  useEffect(() => {
    let mounted = true
    const t = setTimeout(() => {
      if (!mounted) return
      setBooting(false)
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(slideUp, { toValue: 0, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(titleSlide, { toValue: 0, duration: 550, delay: 150, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(buttonScale, { toValue: 1, duration: 500, delay: 300, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }),
      ]).start()

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.05, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start()
    }, 700)

    return () => {
      mounted = false
      clearTimeout(t)
      fade.stopAnimation()
      slideUp.stopAnimation()
      titleSlide.stopAnimation()
      buttonScale.stopAnimation()
      pulse.stopAnimation()
    }
  }, [fade, slideUp, titleSlide, buttonScale, pulse])

  const features: FeatureItem[] = useMemo(
    () => [
      { icon: "trophy", color: "#FFD166", label: "Achievements" },
      { icon: "users", color: "#06D6A0", label: "Community" },
      { icon: "line-chart", color: "#4361EE", label: "Progress" },
    ],
    []
  )

  const bouncePress = useCallback((cb?: () => void) => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.96, duration: 90, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 90, useNativeDriver: true }),
    ]).start(() => cb?.())
  }, [buttonScale])

  const handleNavigate = useCallback(
    (type: "signup" | "signin") => {
      bouncePress(() => {
        if (type === "signup") {
          setSignupLoading(true)
          // Use the passed navigateToSignUp prop
          navigateToSignUp()
          setSignupLoading(false)
        } else {
          setSigninLoading(true)
          // Use the passed navigateToSignIn prop
          navigateToSignIn()
          setSigninLoading(false)
        }
      })
    },
    [bouncePress, navigateToSignUp, navigateToSignIn] // Add navigateToSignUp and navigateToSignIn to dependencies
  )

  if (booting) {
    return (
      <View style={tw`flex-1 bg-[#121826] justify-center items-center`}>
        <StatusBar style="light" />
        <View style={tw`items-center`}>
          <View style={tw`bg-[#4361EE] p-4 rounded-full mb-4`}>
            <FontAwesome name="heartbeat" size={32} color="#FFFFFF" />
          </View>
          <ActivityIndicator size="large" color="#4361EE" />
          <CustomText weight="medium" style={tw`text-white mt-4 text-base`}>
            Loading HakbangQuest…
          </CustomText>
        </View>
      </View>
    )
  }

  return (
    <View style={tw`flex-1`}>
      <StatusBar style="light" />
      <ImageBackground
        source={require("../assets/images/landing.png")}
        style={tw`flex-1`}
        imageStyle={tw`opacity-70`}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(18,24,38,0.30)", "rgba(18,24,38,0.80)", "rgba(18,24,38,0.95)"]}
          style={tw`flex-1 justify-end`}
        >
          {/* App badge */}
          <Animated.View
            style={[
              tw`absolute top-16 left-0 right-0 items-center z-10`,
              { opacity: fade, transform: [{ translateY: titleSlide }] },
            ]}
          >
            <View style={tw`bg-white/10 rounded-2xl px-6 py-3 border border-white/20`}>
              <View style={tw`flex-row items-center`}>
                <View style={tw`bg-[#4361EE] p-2 rounded-full mr-3`}>
                  <FontAwesome name="heartbeat" size={20} color="#FFFFFF" />
                </View>
                <CustomText weight="bold" style={tw`text-white text-xl`}>
                  HakbangQuest
                </CustomText>
              </View>
            </View>
          </Animated.View>

          {/* Content */}
          <Animated.View style={[tw`p-6 pb-12`, { opacity: fade, transform: [{ translateY: slideUp }] }]}>
            {/* Features */}
            <View style={tw`mb-8`}>
              <View style={tw`flex-row justify-center mb-6`}>
                {features.map((feature, index) => (
                  <Animated.View
                    key={feature.label}
                    style={[
                      tw`items-center mx-4`,
                      {
                        opacity: fade,
                        transform: [
                          {
                            translateY: slideUp.interpolate({
                              inputRange: [0, 50],
                              outputRange: [0, 50 + index * 10],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <View style={[tw`p-3 rounded-full mb-2 border-2 border-white/20`, { backgroundColor: `${feature.color}20` }]}>
                      <FontAwesome name={feature.icon} size={20} color={feature.color} />
                    </View>
                    <CustomText weight="medium" style={tw`text-white text-xs opacity-80`}>
                      {feature.label}
                    </CustomText>
                  </Animated.View>
                ))}
              </View>
            </View>

            {/* Title & blurb */}
            <View style={tw`mb-10`}>
              <CustomText weight="bold" style={tw`text-center text-4xl text-white mb-4 leading-tight`}>
                Transform Your{"\n"}
                <CustomText weight="bold" style={tw`text-[#4361EE] text-4xl`}>
                  Fitness Journey
                </CustomText>
              </CustomText>
              <CustomText style={tw`text-center text-base text-white opacity-90 leading-relaxed px-2`}>
                Every step brings progress. Earn rewards, chart goals, and unlock a better you with personalized quests
                and community challenges.
              </CustomText>
            </View>

            {/* CTAs */}
            <Animated.View style={[tw`items-center`, { transform: [{ scale: buttonScale }] }]}>
              <Animated.View style={{ transform: [{ scale: pulse }] }}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Get Started"
                  style={tw`w-full mb-6 shadow-lg`}
                  onPress={() => handleNavigate("signup")}
                  disabled={signupLoading || signinLoading}
                >
                  <LinearGradient
                    colors={["#4361EE", "#3651D4"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={tw`py-4 px-8 rounded-2xl items-center flex-row justify-center border border-white/10`}
                  >
                    {signupLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <FontAwesome name="rocket" size={18} color="#FFFFFF" style={tw`mr-3`} />
                        <CustomText weight="bold" style={tw`text-white text-lg`}>
                          Get Started
                        </CustomText>
                      </>
                    )}
                  </LinearGradient>
                </Pressable>
              </Animated.View>

              {/* Sign-in row */}
              <View style={tw`bg-white/5 rounded-2xl px-6 py-4 border border-white/10`}>
                <View style={tw`flex-row items-center justify-center`}>
                  <CustomText style={tw`text-white opacity-80 mr-2`}>Already have an account?</CustomText>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Sign In"
                    onPress={() => handleNavigate("signin")}
                    disabled={signinLoading || signupLoading}
                    style={tw`flex-row items-center`}
                  >
                    {signinLoading ? (
                      <ActivityIndicator color="#FFC107" size="small" />
                    ) : (
                      <>
                        <CustomText weight="bold" style={tw`text-[#FFC107] mr-1`}>
                          Sign In
                        </CustomText>
                        <Ionicons name="arrow-forward" size={16} color="#FFC107" />
                      </>
                    )}
                  </Pressable>
                </View>
              </View>
            </Animated.View>

            {/* Social proof */}
            <Animated.View
              style={[tw`flex-row justify-center items-center mt-8 pt-6 border-t border-white/10`, { opacity: fade }]}
            >
              <Stat label="Active Users" value="10K+" />
              <Divider />
              <Stat label="Steps Tracked" value="50M+" />
              <Divider />
              <Stat label="App Rating" value="4.9★" />
            </Animated.View>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </View>
  )
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <View style={tw`items-center mx-4`}>
    <CustomText weight="bold" style={tw`text-white text-lg`}>{value}</CustomText>
    <CustomText style={tw`text-white opacity-60 text-xs`}>{label}</CustomText>
  </View>
)

const Divider = () => <View style={tw`w-px h-8 bg-white opacity-20 mx-4`} />

export default LandingScreen
