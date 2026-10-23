import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"

import Register from "./src/1_screens/Auth/Register"
import Login from "./src/1_screens/Auth/Login"
import ForgotPassword from "./src/1_screens/Auth/ForgotPassword"

import Home from "./src/1_screens/Home"

import { useAuth, useError, useUser } from "./src/2_services/context"

import CreateQuest from "./src/1_screens/Quest/QuestCreate"
import QuestsList from "./src/1_screens/Quest/AllQuest"
import QuestDetailPage from "./src/1_screens/Quest/QuestDetailPage"

import Profile from "./src/1_screens/User/Profile"
import Stats from "./src/1_screens/User/Stats"
import Shop from "./src/1_screens/User/Shop"

import Settings from "./src/1_screens/Utils/Settings"
import BlockedApps from "./src/1_screens/Utils/BlockedApps"
import Intro from "./src/1_screens/Utils/Intro"
import ChangeUsername from "./src/1_screens/Utils/ChangeUsername"
import ChangeEmail from "./src/1_screens/Utils/ChangeEmail"
import ChangePassword from "./src/1_screens/Utils/ChangePassword"

import ErrorOverlay from "./src/3_components/ErrorOverlay"
import ViewItem from "./src/3_components/ViewItem"

import { useFonts } from "@expo-google-fonts/orbitron"
import {
  Orbitron_400Regular,
  Orbitron_500Medium,
  Orbitron_700Bold,
} from "@expo-google-fonts/orbitron"


const Stack = createNativeStackNavigator()


function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  )
}


function AppStack() {
  const { setup } = useUser()
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={setup === false ? "Intro" : "Home"}
    >
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="BlockedApps" component={BlockedApps} />

      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Stats" component={Stats} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Shop" component={Shop} />

      <Stack.Screen name="QuestCreate" component={CreateQuest} />
      <Stack.Screen name="QuestDetails" component={QuestDetailPage} />
      <Stack.Screen name="QuestsList" component={QuestsList} />
      <Stack.Screen name="ViewItem" component={ViewItem} />


      <Stack.Screen name="Settings" component={Settings} />

      <Stack.Screen name="ChangeUsername" component={ChangeUsername} />
      <Stack.Screen name="ChangeEmail" component={ChangeEmail} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  )
}


function RootNavigator() {
  const { user, isLoading } = useAuth()
  const { setup, profileLoaded } = useUser()
  const { error } = useError()

  const [fontsLoaded] = useFonts({
    Orbitron_400Regular,
    Orbitron_500Medium,
    Orbitron_700Bold,
  })


  /*
   * Wait until:
   * - Auth has finished loading
   * - User profile has finished loading
   * - Fonts have loaded
   */
  if (isLoading || (user && !profileLoaded) || !fontsLoaded) {
    return null
  }


  return (
    <>
      <ErrorOverlay error={error} />

      {!user ? (
        <AuthStack key="auth" />
      ) : (
        <AppStack key="app" />
      )}
    </>
  )
}


export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )
}