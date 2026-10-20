import React from "react";

import { View, Text, Pressable, ScrollView } from "react-native";

import { questStyles } from "../../Styles/questStyles.js";

import {
  Ionicons,
  MaterialCommunityIcons
} from "@expo/vector-icons";

function Daily({
  questTime,
  setQuestTime,
  open,
  setOpen,
  active,
  setActive,
  times,
  currentIndex,
  updateTime,
  iconColor,
  iconName,
  dateTitle,
  dropDownDescription,
  duration,
  setDuration,
  durationOpen,
  setDurationOpen,
  setDeadline
}) {
  return (
    <View style={questStyles.questDateContainer}>

      {/* HEADER */}
      <View style={questStyles.dateHeaderWrapper}>

        <View style={questStyles.dateHeader}>

          <MaterialCommunityIcons
            name={iconName}
            color={iconColor}
            size={25}
          />

          <Text
            style={{
              textAlign: "left",
              color: "#e9e6e6a8"
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#e9e6e6",
                fontWeight: 500,
                fontFamily: "Orbitron_400Regular"
              }}
            >
              {dateTitle}
            </Text>

            {" "}(Required)
          </Text>

        </View>

        <Text style={{ color: "#7d7f87" }}>
          {dropDownDescription}
        </Text>

      </View>


      {/* TIME SECTION */}
      <View style={questStyles.timeRow}>

        {/* START TIME */}
        <View style={questStyles.timeColumn}>

          <Text style={questStyles.timeLabel}>
            Start Time
          </Text>

          <Pressable
            style={questStyles.timeInput}
            onPress={() => setOpen(!open)}
          >

            <Text style={questStyles.inputText}>
              {questTime.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit"
              })}
            </Text>

            <Ionicons
              name={open ? "chevron-up" : "chevron-down"}
              size={16}
              color="#8fa0bb"
            />

          </Pressable>

          {open && (
            <View style={questStyles.dropdown}>
              <ScrollView
                nestedScrollEnabled
                style={{ maxHeight: 200 }}
              >
                {times.map((item) => (
                  <Pressable
                    key={`${item.hour}:${item.minute}`}
                    style={questStyles.timeOption}
                    onPress={() => {
                      updateTime(
                        item.hour,
                        item.minute,
                        active
                      );

                      setOpen(false);
                    }}
                  >
                    <Text style={questStyles.inputText}>
                      {item.hour}:
                      {String(item.minute).padStart(2, "0")}{" "}
                      {active}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}


        </View>


        {/* DURATION */}
        <View style={questStyles.timeColumn}>

          <Text style={questStyles.timeLabel}>
            Duration
          </Text>

          <Pressable
            style={questStyles.timeInput}
            onPress={() =>
              setDurationOpen(!durationOpen)
            }
          >

            <View
              style={{
                flexDirection: "row",
                alignItems: "center"
              }}
            >

              <Ionicons
                name="timer-outline"
                size={18}
                color={iconColor}
                style={{ marginRight: 8 }}
              />

              <Text style={questStyles.inputText}>
                {duration} min
              </Text>

            </View>

            <Ionicons
              name={
                durationOpen
                  ? "chevron-up"
                  : "chevron-down"
              }
              size={16}
              color="#8fa0bb"
            />

          </Pressable>


          {durationOpen && (
            <View style={questStyles.dropdown}>

              {[15, 30, 45, 60, 90, 120].map(
                (minutes) => (

                  <Pressable
                    key={minutes}
                    style={questStyles.timeOption}
                    onPress={() => {
                      setDuration(minutes);

                      const updatedDeadline = new Date(questTime);

                      updatedDeadline.setMinutes(
                        updatedDeadline.getMinutes() + minutes
                      );

                      setDeadline(updatedDeadline);

                      setDurationOpen(false);

                    }}
                  >

                    <Text style={questStyles.inputText}>
                      {minutes} min
                    </Text>

                  </Pressable>

                )
              )}

            </View>
          )}

        </View>

      </View>

    </View>
  );
}

export default Daily;