import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from "react-native";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useQuests } from "../../2_services/context.js";

import HeaderTitle from "../../3_components/Utils/headerTitle.jsx"
import QuestList from "../../3_components/Quests/QuestList.jsx";
import SectionHeader from "../../3_components/Quests/SectionHeader.jsx";
import FilterPill from "../../3_components/Utils/FilterPill.jsx";
import NavBar from "../../3_components/Utils/NavBar.jsx";

const QuestsList = () => {
  const navigation = useNavigation();

  const { isLoading, getQuestByFilter } = useQuests();

  const [displayQuests, setDisplayQuests] = useState([]);
  const [upcomingQuests, setUpcomingQuests] = useState([]);

  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortFilter, setSortFilter] = useState("Newest");

  useFocusEffect(
    useCallback(() => {
      const quests = getQuestByFilter(
        statusFilter,
        typeFilter,
        sortFilter
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const allQuests = quests || [];

      const filteredQuests = allQuests.filter((quest) => {
        const startDate = new Date(quest.start);
        startDate.setHours(0, 0, 0, 0);

        return startDate <= today;
      });

      const filteredUpcomingQuests = allQuests.filter((quest) => {
        const startDate = new Date(quest.start);
        startDate.setHours(0, 0, 0, 0);

        return startDate > today;
      });

      setDisplayQuests(filteredQuests);
      setUpcomingQuests(filteredUpcomingQuests);
    }, [getQuestByFilter, statusFilter, typeFilter, sortFilter])
  );




  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.appContainer}>

        <View style={{ marginHorizontal: 16, marginTop: 40, marginBottom: 16 }}>
          <HeaderTitle title="QUESTS" />
        </View>

        {/* CONTENT */}
        <View style={styles.content}>

          {/* FILTERS */}
          <View style={styles.filterRow}>

            <FilterPill
              title="Type"
              value={typeFilter}
              options={["All", "Daily", "Weekly", "Once"]}
              onSelect={setTypeFilter}
            />

            <FilterPill
              title="Status"
              value={statusFilter}
              options={[
                "All",
                "Pending",
                "Completed",
                "Failed",
              ]}
              onSelect={setStatusFilter}
            />

            <FilterPill
              title="Sort"
              value={sortFilter}
              options={["Newest", "Oldest"]}
              onSelect={setSortFilter}
            />

          </View>

          {/* SECTION HEADER */}
          <View style={styles.sectionContainer}>
            <SectionHeader
              icon="calendar-outline"
              title="Today"
              number={displayQuests.length}
            />
          </View>

          {/* QUEST AREA */}
          <View style={styles.questPanel}>

            {displayQuests.length === 0 ? (
              <View style={styles.emptyState}>

                <Text style={styles.emptyTitle}>
                  No active quests.
                </Text>

                <Text style={styles.emptyDescription}>
                  Your quests will show up here{"\n"}
                  once you have some.
                </Text>

              </View>
            ) : (
              <QuestList quests={displayQuests} />
            )}
          </View>
        </View>
        {upcomingQuests.length > 0 ? (
          <View style={{ height: '25%' }}>
            <View style={styles.sectionContainer}>
              <SectionHeader
                icon="calendar-outline"
                title="Upcoming quests"
                number={upcomingQuests.length}
              />
            </View>

            {/* QUEST AREA */}
            <View style={styles.questPanel}>

              {displayQuests.length === 0 ? (
                <View style={styles.emptyState}>

                  <Text style={styles.emptyTitle}>
                    No active quests.
                  </Text>

                  <Text style={styles.emptyDescription}>
                    Your quests will show up here{"\n"}
                    once you have some.
                  </Text>

                </View>
              ) : (
                <QuestList quests={upcomingQuests} />
              )}
            </View>
          </View>) : null}


        {/* CREATE BUTTON */}
        <Pressable
          onPress={() => navigation.navigate("QuestCreate")}
          style={({ pressed }) => [
            styles.createButtonWrapper,
            pressed && styles.createButtonPressed,
            { marginTop: 16 }
          ]}
        >
          <LinearGradient
            colors={["#03152D", "#073363", "#03152D"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.createButton}
          >
            <MaterialCommunityIcons
              name="plus"
              size={30}
              color="#00D9FF"
            />

            <Text style={styles.createButtonText}>
              Create Quest
            </Text>

          </LinearGradient>
        </Pressable>

        <View style={{ marginHorizontal: 16, marginBottom: 8 }}>
          <NavBar />
        </View>

      </View>
    </SafeAreaView>
  );
};

export default QuestsList;

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: "#030F20",
  },

  appContainer: {
    flex: 1,
    backgroundColor: "#030F20",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#030F20",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#AEBEDC",
    fontSize: 18,
    fontWeight: "500",
  },

  /* ---------------- HEADER ---------------- */

  header: {
    height: 112,
    paddingHorizontal: 24,
    paddingTop: 24,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#12417E",
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#1551B2",

    borderWidth: 1,
    borderColor: "#318AFF",

    shadowColor: "#168DFF",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 0,
    },

    elevation: 6,
  },

  headerTitle: {
    fontSize: 24, color: '#fff', textAlign: "center", fontFamily: 'Orbitron_700Bold'
  },

  /* ---------------- CONTENT ---------------- */

  content: {
    flex: 1,
    backgroundColor: "#030F20",
    paddingTop: 16,
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 8,
    zIndex: 50,
  },

  sectionContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },

  /* ---------------- QUEST PANEL ---------------- */

  questPanel: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 8,

    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#174780",

    overflow: "hidden",

    backgroundColor: "#010C1F",
  },

  /* ---------------- EMPTY STATE ---------------- */

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyIconGlow: {
    marginBottom: 22,
  },

  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 59,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#174E9D",

    shadowColor: "#168DFF",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 0,
    },

    elevation: 7,
  },

  sparkle: {
    position: "absolute",
  },

  sparkleOne: {
    top: 58,
    marginLeft: 195,
  },

  sparkleTwo: {
    top: 120,
    marginLeft: -185,
  },

  emptyTitle: {
    color: "#F3F6FF",
    fontSize: 23,
    lineHeight: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },

  emptyDescription: {
    color: "#9AAED2",
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "500",
    textAlign: "center",
  },


  /* ---------------- CREATE BUTTON ---------------- */

  createButtonWrapper: {
    width: "90%",
    alignSelf: "center",
    marginHorizontal: 0,
    marginBottom: 12,

    borderRadius: 16,

    shadowColor: "#009DFF",
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  createButtonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.85,
  },

  createButton: {
    height: 52,
    borderRadius: 16,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1.5,
    borderColor: "#00C8FF",

    paddingHorizontal: 20,
  },

  createButtonText: {
    color: "#D8F4FF",
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 10,
    letterSpacing: 0.5,
    fontFamily: "Orbitron_400Regular",
  },

});