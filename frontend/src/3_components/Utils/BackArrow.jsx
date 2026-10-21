import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function BackArrow({ passedFunction }) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            hitSlop={10}
            pressRetentionOffset={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
                backgroundColor: '#50525892',
                borderRadius: 50,
                height: 40,
                width: 40,
                alignItems: 'center',
                justifyContent: 'center',
            }}
            onPress={async () => {
                try {
                    if (passedFunction) {
                        await passedFunction();
                    }
                } catch (error) {
                    console.error('BackArrow function failed:', error);
                } finally {
                    if (navigation.canGoBack()) {
                        navigation.goBack();
                    }
                }
            }}
        >
            <Ionicons name="arrow-back" size={24} color="#ffffffe8" />
        </TouchableOpacity>
    );
}

export default BackArrow;