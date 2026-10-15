import { useState } from "react"
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native"

export default function CurrentPasswordInput({
    onSubmit,
    onForgotPassword,
    invalid = false,
    onChange,
}) {
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit() {
        if (!password.trim()) return

        setError("")
        setIsSubmitting(true)
        try {
            await onSubmit(password)
        } catch (err) {
            setError(err.message || "Unable to verify current password")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Current Password</Text>

            <TextInput
                style={[
                    styles.input,
                    invalid && { borderColor: "red" },
                ]}
                value={password}
                onChangeText={(value) => {
                    setPassword(value)
                    setError("")
                    onChange?.()
                }}
                placeholder="Enter your current password"
                placeholderTextColor="#8B96B5"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
            />

            {invalid ? <Text style={styles.error}>Current password is incorrect</Text> : null}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
                style={styles.forgotButton}
                onPress={onForgotPassword}
            >
                <Text style={styles.forgotText}>Forgot Password?</Text>
            </Pressable>

            <Pressable
                style={[styles.button, isSubmitting && { opacity: 0.5 }]}
                onPress={handleSubmit}
                disabled={isSubmitting || !password.trim()}
            >
                <Text style={styles.buttonText}>Continue</Text>
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
    forgotButton: {
        alignSelf: "flex-end",
    },
    forgotText: {
        color: "#5EA7FF",
        fontSize: 13,
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