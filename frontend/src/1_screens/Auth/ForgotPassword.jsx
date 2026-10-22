import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    SafeAreaView,
    StyleSheet,
    ActivityIndicator,
} from "react-native"
import { useState } from "react"
import { fetchCheckUserExists, fetchForgotPassword, fetchVerifyReset, fetchResetPassword } from "../../4_api/auth.api"
import { useNavigation } from '@react-navigation/native';

import AccountInput from "../../3_components/Utils/AccountInput.jsx"
import BackArrow from "../../3_components/Utils/BackArrow.jsx"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import authStyles from "../../Styles/authStyles.js"

function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [code, setCode] = useState("")
    const [codeRequested, setCodeRequested] = useState(false)
    const [codeResponse, setCodeResponse] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [newPassword, setNewPassword] = useState("")
    const [userId, setUserId] = useState(null)
    const [error, setError] = useState("")

    const navigation = useNavigation();

    async function requestCode() {
        if (!email.trim()) {
            setError("Email is required")
            return
        }

        setError("")
        setIsSubmitting(true)
        try {
            const user = await fetchCheckUserExists(email.trim())
            setUserId(user.id)
            await fetchForgotPassword(email.trim())
            setCodeRequested(true)
            setCode("")
        } catch (requestError) {
            setError(requestError.message || "Unable to send a verification code")
        } finally {
            setIsSubmitting(false)
        }
    }

    async function sendCode() {
        setIsSubmitting(true)
        try {
            const results = await fetchVerifyReset(email.trim(), code.trim())
            setCodeResponse(results.valid)
            setCodeRequested(false)
        } catch (err) {
            setError(err.message || "Unable to send code")
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleSubmit() {
        setIsSubmitting(true)
        try {
            await fetchResetPassword(newPassword, userId)
            navigation.navigate("Login")
        } catch (err) {
            setError(err.message || "Unable to reset password")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <View style={{ marginTop: 16 }}>
                    <BackArrow />
                </View>

                <View>
                    <Text style={styles.title}>Forgot Password</Text>
                    <Text style={styles.subtitle}>
                        {codeRequested
                            ? `Enter the 6-digit code sent to ${email.trim()}.`
                            : "Enter your email address and we'll send you a 6-digit verification code."}
                    </Text>

                    <View style={styles.form}>
                        {codeRequested ? (
                            <>
                                <Text style={styles.label}>6-DIGIT CODE</Text>
                                <TextInput
                                    style={styles.input}
                                    value={code}
                                    onChangeText={(value) => {
                                        setCode(value.replace(/\D/g, "").slice(0, 6))
                                        setError("")
                                    }}
                                    placeholder="Enter code"
                                    placeholderTextColor="#8B96B5"
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    autoComplete="one-time-code"
                                    textContentType="oneTimeCode"
                                    accessibilityLabel="6-digit verification code"
                                />

                                <Pressable style={authStyles.loginButton} onPress={sendCode}>
                                    <Text style={authStyles.loginButtonText}>
                                        Confirm Code
                                    </Text>
                                </Pressable>


                                <Pressable
                                    style={styles.resendButton}
                                    onPress={requestCode}
                                    disabled={isSubmitting}
                                >
                                    <Text style={styles.resendText}>
                                        Didn't get the email? Resend code
                                    </Text>
                                </Pressable>
                            </>
                        ) : codeResponse ? (
                            <SafeAreaView style={styles.container}>
                                <ScrollView contentContainerStyle={styles.content}>
                                    <View style={styles.form}>
                                        <>
                                            <AccountInput
                                                label="New Password"
                                                name="password"
                                                buttonText="Change Password"
                                                onSubmit={handleSubmit}
                                                setNewPassword={setNewPassword}
                                                newPassword={newPassword}
                                            />
                                            <View style={{ marginBottom: 12 }}>
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
                                    </View>
                                </ScrollView>
                            </SafeAreaView>
                        ) : (
                            <>
                                <Text style={styles.label}>EMAIL</Text>
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={(value) => {
                                        setEmail(value)
                                        setError("")
                                    }}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#8B96B5"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    textContentType="emailAddress"
                                    accessibilityLabel="Email address"
                                />
                            </>
                        )}

                        {error ? <Text style={styles.error}>{error}</Text> : null}
                        {!codeRequested && !codeResponse && (
                            <Pressable
                                style={[styles.button, (isSubmitting || !email.trim()) && styles.buttonDisabled]}
                                onPress={requestCode}
                                disabled={isSubmitting || !email.trim()}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.buttonText}>Send code</Text>
                                )}
                            </Pressable>
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
        padding: 16,
        gap: 28,
    },
    backButton: {
        color: "#5EA7FF",
        fontSize: 16,
        marginBottom: 24,
    },
    title: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    subtitle: {
        color: "#8B96B5",
        fontSize: 14,
        marginBottom: 24,
    },
    form: {
        width: "100%",
        gap: 10,
    },
    label: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
    },
    input: {
        backgroundColor: "#092356",
        color: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#1A539F",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: "#1468D7",
        minHeight: 48,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
    resendButton: {
        alignSelf: "center",
        paddingVertical: 8,
    },
    resendText: {
        color: "#5EA7FF",
        fontSize: 14,
        fontWeight: "600",
    },
    error: {
        color: "#FF7070",
        fontSize: 13,
    },
})

export default ForgotPassword;