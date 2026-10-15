import { useState } from "react"
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native"

export default function AccountInput({
    label,
    name,
    buttonText = "Save Changes",
    onSubmit,
    setNewPassword,
    newPassword
}) {
    const [value, setValue] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isPassword = name === "password"
    const isEmail = name === "email"
    const fieldValue = isPassword ? newPassword ?? "" : value

    async function handleSubmit() {
        if (!fieldValue.trim()) {
            setError(`${label} is required`)
            return
        }

        if (isPassword && newPassword !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (isPassword && !(
            newPassword.length >= 8 &&
            /[A-Z]/.test(newPassword) &&
            /[a-z]/.test(newPassword) &&
            /\d/.test(newPassword) &&
            /[^A-Za-z0-9]/.test(newPassword)
        )) {
            setError("Password does not meet the requirements")
            return
        }

        setError("")
        setIsSubmitting(true)
        try {
            await onSubmit(fieldValue)
        } catch (err) {
            setError(err.message || "Unable to save changes")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <TextInput
                style={styles.input}
                value={isPassword ? newPassword : value}
                onChangeText={(nextValue) => {
                    if (isPassword) {
                        setNewPassword(nextValue)
                    } else {
                        setValue(nextValue)
                    }
                    setError("")
                }}
                placeholder={`Enter ${label.toLowerCase()}`}
                placeholderTextColor="#8B96B5"
                secureTextEntry={isPassword}
                keyboardType={isEmail ? "email-address" : "default"}
                autoCapitalize={isEmail || isPassword ? "none" : "words"}
                autoCorrect={false}
            />

            {isPassword && (
                <>
                    <Text style={styles.label}>Confirm Password</Text>

                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={(nextValue) => {
                            setConfirmPassword(nextValue)
                            setError("")
                        }}
                        placeholder="Confirm new password"
                        placeholderTextColor="#8B96B5"
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </>
            )}

            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Pressable
                style={[
                    styles.button,
                    (isSubmitting || !fieldValue.trim()) ? { opacity: 0.5 } : null,
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting || !fieldValue.trim()}
            >
                <Text style={styles.buttonText}>{buttonText}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
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
        fontSize: 14,
    },
    button: {
        backgroundColor: "#1468D7",
        minHeight: 48,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 5,
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
    error: {
        color: "#FF7070",
        fontSize: 13,
    },
})