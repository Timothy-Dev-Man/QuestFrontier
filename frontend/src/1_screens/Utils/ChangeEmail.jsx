import {
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Alert,
} from "react-native"

import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../../2_services/context"

import AccountInput from "../../3_components/Utils/AccountInput.jsx"
import { updateUserEmail } from "../../4_api/user.api"

import BackArrow from "../../3_components/Utils/BackArrow.jsx"

function ChangeEmail() {
  const navigation = useNavigation()
  const { token } = useAuth()

  async function handleSubmit(username) {
    await updateUserEmail(token, username)
    navigation.navigate("Profile")
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={{ marginTop: 20 }}>
          <BackArrow navigation={navigation} />
        </View>

        <View>
          <Text style={styles.title}>Change Email</Text>
          <Text style={styles.subtitle}>
            Update the email address associated with your account.
          </Text>

          <View style={styles.form}>
            <AccountInput
              label="New Email"
              name="email"
              buttonText="Save Email"
              onSubmit={handleSubmit}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040E29",
  },
  content: {
    flexGrow: 1,
    padding: 24,
    alignText: 'center',
    gap: '10%'
  },
  backButton: {
    color: "#5EA7FF",
    fontSize: 16,
    marginBottom: 30,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#8B96B5",
    fontSize: 14,
    marginBottom: 30,
  },
  form: {
    width: "100%",
  },
})

export default ChangeEmail;