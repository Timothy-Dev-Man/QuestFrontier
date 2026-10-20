import { View, Text } from "react-native";


function Pill({symbol, number, text, color, backgroundColor}) {
    return (
        <View style={{ backgroundColor: backgroundColor, borderRadius: 10, height: 20, width: 60, alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', padding: '0.1%'}}>
            <Text style={{ color: color, fontSize: 12}}>{symbol}{" "}{number}{" "}{text}</Text>
        </View>
    )
}

export default Pill;