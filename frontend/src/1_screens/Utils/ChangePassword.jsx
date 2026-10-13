import { useState } from "react"

import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    StyleSheet,
} from "react-native"

import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../../2_services/context"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import authStyles from '../../Styles/authStyles.js'

import BackArrow from "../../3_components/Utils/BackArrow.jsx"
import AccountInput from "../../3_components/Utils/AccountInput.jsx"
import CurrentPasswordInput from "../../3_components/Utils/CurrentPasswordInput.jsx"
import { updateUserPassword } from "../../4_api/user.api"

function ChangePassword() {
    const navigation = useNavigation()
    const { token } = useAuth()

    const [newPassword, setNewPassword] = useState("")
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [invalidCurrentPassword, setInvalidCurrentPassword] = useState(false)

    async function handleCurrentPassword(password) {

        try {
            const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/check/password`

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ password }),
            })

            if (!response.ok) {
                throw new Error("Unable to verify current password: " + response.status)
            }

            const data = await response.json()

            if (data === true) {
                setShowNewPassword(true)
                setInvalidCurrentPassword(false)
            } else {
                setInvalidCurrentPassword(true)
            }

            return data
        } catch (err) {
            console.error("[user.api] Failed to update password", err)
            throw err
        }
    }

    async function handleSubmit(password) {
        await updateUserPassword(token, password)
        navigation.navigate("Profile")
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={{ marginTop: 20 }}>
                    <BackArrow navigation={navigation} />
                </View>

                <View>
                    <Text style={styles.title}>Change Password</Text>
                    <Text style={styles.subtitle}>
                        {showNewPassword
                            ? "Choose a strong password for your account."
                            : "Enter your current password to continue."}
                    </Text>

                    <View style={styles.form}>
                        {showNewPassword ? (
                            <>
                                <AccountInput
                                    label="New Password"
                                    name="password"
                                    buttonText="Change Password"
                                    onSubmit={handleSubmit}
                                    setNewPassword={setNewPassword}
                                    newPassword={newPassword}
                                />
                                <View style={{ marginBottom: 10 }}>
                                    <View style={authStyles.passwordRule}>
                                        <MaterialCommunityIcons
                                            name={newPassword.length >= 8 ? "check-circle" : "circle-outline"}
                                            size={18}
                                            color={newPassword.length >= 8 ? "#5EA7FF" : "#434966"}
                                        />
                                        <Text style={authStyles.passwordRuleText}>
                                            At least 8 characters
                                        </Text>
                                    </View>

                                    <View style={authStyles.passwordRule}>
                                        <MaterialCommunityIcons
                                            name={/[A-Z]/.test(newPassword) ? "check-circle" : "circle-outline"}
                                            size={18}
                                            color={/[A-Z]/.test(newPassword) ? "#5EA7FF" : "#434966"}
                                        />
                                        <Text style={authStyles.passwordRuleText}>
                                            One uppercase letter
                                        </Text>
                                    </View>

                                    <View style={authStyles.passwordRule}>
                                        <MaterialCommunityIcons
                                            name={/[a-z]/.test(newPassword) ? "check-circle" : "circle-outline"}
                                            size={18}
                                            color={/[a-z]/.test(newPassword) ? "#5EA7FF" : "#434966"}
                                        />
                                        <Text style={authStyles.passwordRuleText}>
                                            One lowercase letter
                                        </Text>
                                    </View>

                                    <View style={authStyles.passwordRule}>
                                        <MaterialCommunityIcons
                                            name={/\d/.test(newPassword) ? "check-circle" : "circle-outline"}
                                            size={18}
                                            color={/\d/.test(newPassword) ? "#5EA7FF" : "#434966"}
                                        />
                                        <Text style={authStyles.passwordRuleText}>
                                            One number
                                        </Text>
                                    </View>

                                    <View style={authStyles.passwordRule}>
                                        <MaterialCommunityIcons
                                            name={/[^A-Za-z0-9]/.test(newPassword) ? "check-circle" : "circle-outline"}
                                            size={18}
                                            color={/[^A-Za-z0-9]/.test(newPassword) ? "#5EA7FF" : "#434966"}
                                        />
                                        <Text style={authStyles.passwordRuleText}>
                                            One special character
                                        </Text>
                                    </View>
                                </View>
                            </>
                        ) : (
                            <CurrentPasswordInput
                                onSubmit={handleCurrentPassword}
                                invalid={invalidCurrentPassword}
                                onChange={() => setInvalidCurrentPassword(false)}
                                onForgotPassword={() => navigation.navigate("ForgotPassword")}
                            />
                        )}
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
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 36,
        gap: 40,
    },

    title: {
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "800",
        textAlign: "center",
        marginTop: 25,
        marginBottom: 12,
        letterSpacing: 0.3,
    },

    subtitle: {
        color: "#8B96B5",
        fontSize: 15,
        lineHeight: 23,
        textAlign: "center",
        marginBottom: 32,
        paddingHorizontal: 8,
    },

    form: {
        width: "100%",
        backgroundColor: "#071839",
        borderWidth: 1,
        borderColor: "#173568",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#1468D7",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 4,
    },
})

export default ChangePassword;