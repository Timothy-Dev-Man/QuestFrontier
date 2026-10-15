import { Pressable, Text, View, ImageBackground } from "react-native"

import { useAuth } from "../../2_services/context.js"
import { globalStyles } from "../../2_services/styles.js"
import { styles } from "../../Styles/profileStyles.js"

import SectionHeader from "../../3_components/Quests/SectionHeader.jsx";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import BackArrow from "../../3_components/Utils/BackArrow.jsx"

import backgroundImage from "../../../assets/settings.png";

import { useNavigation } from "@react-navigation/native"

const Settings = () => {

  const { logout, user } = useAuth()
  const navigation = useNavigation()

  async function handleLogout() {
    await logout()
  }

  function handleNav(path) {
    navigation.navigate(path)
  }

  function maskEmail(email) {
    if (!email?.includes("@")) return email

    const [name, domain] = email.split("@")
    return `${name[0]}****@${domain}`
  }

  return (
    <View
      style={[
        globalStyles.container,
      ]}
    >
      <ImageBackground
        source={backgroundImage}
        style={[globalStyles.innerContainer, {
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          padding: 16,
          paddingTop: 56,
          overflow: 'hidden'
        },]}
        resizeMode="cover"
      >



        <View
          style={{
            position: "absolute",
            top: 12,
            left: 16,
            right: 16,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <BackArrow navigation={navigation} />

          <Text
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              textAlign: "center",
              color: "#FFFFFF",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            SETTINGS
          </Text>
        </View>

        <View style={{ flex: 0.1 }} />

        <SectionHeader
          title="Account"
          color="#20478a"
        />

        <View style={styles.menuContainer}>

          <Pressable style={styles.menuRow} onPress={() => handleNav("ChangeUsername")}>
            <MaterialCommunityIcons
              name="account-edit-outline"
              size={27}
              color="#80AFFF"
            />

            <Text style={styles.menuText}>
              Change Username
            </Text>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#80AFFF"
            />
          </Pressable>


          <View style={styles.divider} />


          <Pressable style={styles.menuRow} onPress={() => handleNav("ChangeEmail")}>
            <MaterialCommunityIcons
              name="email-edit-outline"
              size={27}
              color="#80AFFF"
            />

            <Text style={styles.menuText}>
              {maskEmail(user.email)}
            </Text>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#80AFFF"
            />
          </Pressable>


          <View style={styles.divider} />


          <View style={styles.divider} />


          <Pressable style={styles.menuRow} onPress={() => handleNav("ChangePassword")}>
            <MaterialCommunityIcons
              name="lock-reset"
              size={27}
              color="#80AFFF"
            />

            <Text style={styles.menuText}>
              Change Password
            </Text>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#80AFFF"
            />
          </Pressable>

        </View>

        <Pressable
          onPress={handleLogout}
          style={{
            backgroundColor: "#430813",
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 'auto',
            flexDirection: 'row',
            gap: 5,
            borderColor: '#FF8F93',
            borderStyle: 'solid',
            borderWidth: 1
          }}
        >
          <MaterialCommunityIcons
            name="logout"
            size={27}
            color="#fff"
          />

          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: "700",
            }}
          >
            Logout
          </Text>
        </Pressable>

      </ImageBackground>
    </View>

  )
}

export default Settings