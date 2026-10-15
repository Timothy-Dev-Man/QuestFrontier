import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { styles } from "../../2_services/styles.js";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const QuestCard = ({
  id,
  title,
  deadLine,
  start,
  status,
  type,
  difficulty,
}) => {
  const navigation = useNavigation();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const isCompleted = status === "completed";

  function handleViewingQuest() {
    navigation.navigate("QuestDetails", {
      questId: id,
    });
  }

  let statusIcon;
  let statusIconColor;
  let statusColor;

  if (status === "completed") {
    statusIcon = "check";
    statusColor = "#032a22";
    statusIconColor = "#46E3C1";
  } else if (status === "pending") {
    statusIcon = "clock-outline";
    statusColor = "rgb(49, 44, 30)";
    statusIconColor = "#FFD55B";
  } else if (status === "failed") {
    statusIcon = "close";
    statusColor = "#241113";
    statusIconColor = "#E67481";
  } else {
    statusIcon = "close";
    statusColor = "#241113";
    statusIconColor = "#fff";
  }


  const deadlineMs = new Date(deadLine).getTime();
  const startMs = start ? new Date(start).getTime() : NaN;

  const isWaitingForStart =
    status === "pending" &&
    Number.isFinite(startMs) &&
    now < startMs;

  // Count toward the start time if waiting;
  // otherwise, count toward the deadline.
  const targetTime = isWaitingForStart ? startMs : deadlineMs;
  const msRemaining = Number.isFinite(targetTime)
    ? Math.max(0, targetTime - now)
    : 0;


  const totalMinutes = Math.ceil(msRemaining / 60000);

  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  const formattedTime = totalHours >= 24 ? `${days}d ${hours}h` : `${totalHours}h ${minutes}m`;



  return (
    <View
      style={[
        styles.card,
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,

          borderRightWidth: 1,
        },
      ]}
    >
      {/* Quest Icon */}
      <View
        style={{
          borderRadius: 9,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A143A",
          borderColor: "#4C73FF",
          borderWidth: 1,
          height: 48,
          width: 48,
        }}
      >
        <MaterialCommunityIcons
          name="trophy"
          size={30}
          color={"#D4AF37"}
        />
      </View>

      {/* Quest Information */}
      <Pressable
        onPress={handleViewingQuest}
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <Text
          style={[
            styles.questTitle,
            {
              color: isCompleted ? "#D6F7EE" : "#F1F0F0",
            },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 2,
            marginBottom: 4,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={12}
              color="#4C73FF"
            />

            <Text
              style={{
                color: "#A8B2C1",
                fontSize: 11,
              }}
            >
              {type}
            </Text>
          </View>

          <View
            style={{
              width: 1,
              height: 12,
              backgroundColor: "#334155",
            }}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <MaterialCommunityIcons
              name="chart-bar"
              size={12}
              color="#4C73FF"
            />

            <Text
              style={{
                color: "#A8B2C1",
                fontSize: 11,
              }}
            >
              {difficulty}
            </Text>
          </View>
        </View>
      </Pressable>

      {/* Status + XP */}
      <View
        style={{
          alignSelf: "center",
          alignItems: "center",
          gap: 6,
          width: 80
        }}
      >
        {/* Status */}
        <View
          style={{
            borderRadius: 50,
            minWidth: 70,
            height: 24,
            paddingHorizontal: 8,
            backgroundColor: statusColor,
            borderColor: statusIconColor,
            borderWidth: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <MaterialCommunityIcons
            name={statusIcon}
            size={15}
            color={statusIconColor}
          />

          <Text
            style={{
              color: statusIconColor,
              fontSize: 11,
              fontWeight: "600",
              textTransform: "capitalize",
            }}
          >
            {isWaitingForStart ? "Starts in" : status}
          </Text>
        </View>

        {status === "pending" ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <MaterialCommunityIcons
              name="clock-outline"
              size={14}
              color="#40D8F7"
            />

            <Text style={{ color: "#40D8F7", fontSize: 13 }}>
              {formattedTime}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default QuestCard;