import { useState } from "react";
import {
    View,
    Text,
    Pressable,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const FilterPill = ({
    title,
    value,
    options = [],
    onSelect,

    icon = "filter-variant",
    showIcon = false,
    minWidth = 0
}) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (option) => {
        onSelect(option);
        setOpen(false);
    };

    return (
        <View style={{ position: "relative", zIndex: open ? 100 : 1, justifyContent: 'center', flex: 1, minWidth: minWidth }}>
            <Pressable onPress={() => setOpen(!open)}
                style={{
                    height: 44,
                    paddingHorizontal: 4,

                    backgroundColor: "#071A35",
                    borderColor: "#29456D",

                    borderWidth: 1,
                    borderRadius: 7,

                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        flex: 1,
                        minWidth: 0,
                        gap: 6,
                    }}
                >
                    {showIcon && (
                        <MaterialCommunityIcons
                            name={icon}
                            size={18}
                            color="#00A8FF"
                        />
                    )}

                    <Text
                        style={{
                            color: "#D7DCE5",
                            fontSize: 11,
                            flexShrink: 1,
                        }}
                    >
                        {title}: {value}
                    </Text>
                </View>

                <MaterialCommunityIcons
                    name={open ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#9BA8BC"
                />
            </Pressable>

            {/* Dropdown */}
            {open && (
                <View
                    style={{
                        position: "absolute",
                        top: 44,
                        left: 0,

                        minWidth: 75,

                        backgroundColor: "#071A35",

                        borderWidth: 1,
                        borderColor: "#29456D",
                        borderRadius: 8,

                        overflow: "hidden",

                        zIndex: 999,
                        elevation: 10,
                    }}
                >
                    {options.map((option) => {
                        const selected = option === value;

                        return (
                            <Pressable
                                key={option}
                                onPress={() => handleSelect(option)}
                                style={{
                                    paddingVertical: 11,
                                    paddingHorizontal: 12,

                                    backgroundColor: selected
                                        ? "#0D2C54"
                                        : "transparent",
                                }}
                            >
                                <Text
                                    style={{
                                        color: selected
                                            ? "#4DB8FF"
                                            : "#D7DCE5",

                                        fontSize: 13,
                                    }}
                                >
                                    {option}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            )}
        </View>
    );
};

export default FilterPill;