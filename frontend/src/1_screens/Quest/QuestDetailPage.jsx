import React, { useEffect, useState } from "react"

import { View, Text, Pressable, ActivityIndicator, TextInput } from "react-native"

import { MaterialCommunityIcons } from "@expo/vector-icons"

import CountdownTimer from "../../3_components/Quests/CountdownTimer.jsx"
import BackArrow from "../../3_components/Utils/BackArrow.jsx"
import QuestReward from "../../3_components/Quests/QuestReward.jsx"

import { styles } from "../../2_services/styles"
import { questDetailsStyles } from "../../Styles/questDetailsStyles"

import { useQuests, useError } from "../../2_services/context"
import { fetchQuestById, fetchUpdateDescription } from "../../4_api/quests.api"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { STORAGE_KEYS } from "../../2_services/storage"


export default function QuestDetailPage({ route, navigation }) {
  const { questId } = route.params

  const [quest, setQuest] = useState(null)
  const [newDescription, setNewDescription] = useState(null)
  const [showNewDescription, setShowNewDescription] = useState(false)
  const [loading, setLoading] = useState(true)

  const { reward, getUserQuests, updateQuest, showReward, setShowReward } = useQuests()
  const { setError } = useError()

  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {

    async function loadQuest() {

      try {

        const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)

        const data = await fetchQuestById(token, questId)

        console.log("fetched quest by id: ", data)
        setQuest(data)

      } catch (err) {

        setError(err)

      } finally {

        setLoading(false)

      }

    }

    loadQuest()

  }, [])

  async function completeQuest() {
    await updateQuest(questId)

    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)

    const data = await fetchQuestById(token, questId)

    console.log("fetched quest by id: ", data)
    setQuest(data)

  }

  async function updateDescription() {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)
      if (newDescription != null) {

        const data = await fetchUpdateDescription(token, questId, newDescription)

        setQuest(data)
        setShowNewDescription(false)
      }
    } catch (err) {
      setError(err)
    }
  }

  if (loading) {
    return <ActivityIndicator style={styles.progress} size="large" />
  }

  const startTime = quest?.start ? new Date(quest.start).getTime() : NaN;

  const waitingForStart = Number.isFinite(startTime) && currentTime < startTime;

  const canComplete =
    quest?.status === "pending" &&
    quest?.is_completed === false &&
    !waitingForStart;

  return (

    <View style={[styles.container, { padding: 16, paddingTop: 24 }]}>

      {reward?.reward?.reward && reward?.questId === questId && showReward && (
        <QuestReward
          onClose={() => setShowReward(false)}
        />
      )}

      {/* Header */}
      <View style={[questDetailsStyles.header, { flexDirection: 'row', alignItems: 'center', gap: 16, alignSelf: 'center', width: '100%', height: 60, position: 'relative' }]}>

        <BackArrow navigation={navigation} passedFunction={getUserQuests} />

        <Text style={questDetailsStyles.headerTitle}>
          QUEST DETAILS
        </Text>

        <View style={{ width: 40 }} />

      </View>


      {/* Quest */}
      <View style={questDetailsStyles.questCard}>

        <View style={questDetailsStyles.questTitleRow}>

          <View style={questDetailsStyles.questIcon}>
            <MaterialCommunityIcons
              name="shield-sword"
              size={35}
              color="#6C63FF"
            />
          </View>

          <View style={questDetailsStyles.questTitleContainer}>

            <Text style={questDetailsStyles.questTitle}>
              {quest.title}
            </Text>

            <Text style={questDetailsStyles.questType}>
              {quest.type}
            </Text>

          </View>

          <Text style={questDetailsStyles.questXP}>
            + {quest.reward.exp} XP
          </Text>

        </View>

        <View style={questDetailsStyles.divider} />

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          {showNewDescription ? (
            <View style={{ flex: 1, gap: 10 }}>
              <TextInput
                value={newDescription ?? ""}
                onChangeText={setNewDescription}
                placeholder="Enter quest description..."
                placeholderTextColor="#8A94A6"
                maxLength={300}
                multiline
                style={[
                  questDetailsStyles.description,
                  {
                    borderWidth: 1,
                    borderColor: "#19C7FF",
                    borderRadius: 8,
                    padding: 12,
                    minHeight: 80,
                    textAlignVertical: "top",
                  },
                ]}
              />

              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable
                  onPress={updateDescription}
                  style={{
                    backgroundColor: "#145AE8",
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    minHeight: 44,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                    Save
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setNewDescription(quest.description ?? "")
                    setShowNewDescription(false)
                  }}
                  style={{
                    backgroundColor: "#434966",
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    minHeight: 44,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              <Text style={[questDetailsStyles.description, { flex: 1 }]}>
                {quest.description || "No description provided"}
              </Text>

              <Pressable
                onPress={() => {
                  setNewDescription(quest.description ?? "")
                  setShowNewDescription(true)
                }}
                style={{ alignSelf: "flex-end", marginBottom: 5 }}
              >
                <MaterialCommunityIcons
                  name="text-box-edit"
                  size={22}
                  color="#19c5ffd1"
                />
              </Pressable>
            </>

          )}
        </View>
        <Text style={{ color: "#8A94A6", fontSize: 11, textAlign: "right" }}>
          {(newDescription ?? "").length} / 300
        </Text>
      </View>


      {/* Time Left */}
      <View
        style={[
          questDetailsStyles.progressCard,
          quest?.is_completed && questDetailsStyles.completedProgressCard,
        ]}
      >
        <View style={questDetailsStyles.timeIconContainer}>
          <MaterialCommunityIcons
            name="timer-outline"
            size={44}
            color={quest?.is_completed === true ? "#22C55E" : "#19C7FF"}
          />
        </View>

        <View style={questDetailsStyles.timeDivider} />

        <View style={questDetailsStyles.timeContent}>
          {new Date(quest?.deadline) < new Date() && quest?.is_completed != true ? <Text
            style={[
              questDetailsStyles.progressTitle,
              { color: "#EF4444" },
            ]}
          >
            Time Expired
          </Text> : <Text style={questDetailsStyles.progressTitle}>
            {!waitingForStart ? "TIME LEFT" : "Starts in"}
          </Text>}

          {quest?.is_completed ? (
            <Text
              style={[
                questDetailsStyles.timeValue,
                { color: "#22C55E" },
              ]}
            >
              Completed
            </Text>
          ) : (
            <CountdownTimer deadline={quest?.deadline} start={quest?.start} isCompleted={quest?.is_completed} />
          )}
        </View>

        <View style={questDetailsStyles.timeDivider} />

        <View style={questDetailsStyles.deadlineContent}>
          <Text style={questDetailsStyles.deadlineLabel}>
            Deadline
          </Text>

          <Text style={questDetailsStyles.deadlineValue}>
            {quest?.deadline
              ? new Date(quest.deadline).toLocaleDateString([], {
                month: "short",
                day: "numeric",
              })
              : "—"}
            {", "}
            {quest?.deadline
              ? new Date(quest.deadline).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })
              : "—"}
          </Text>
        </View>
      </View>


      {/* Details */}
      <View style={questDetailsStyles.detailsCard}>

        <View style={questDetailsStyles.infoRow}>

          <View style={questDetailsStyles.infoIcon}>
            <MaterialCommunityIcons
              name="timer-outline"
              size={23}
              color="#FFD15C"
            />
          </View>

          <View>
            <Text style={questDetailsStyles.infoLabel}>
              Started at
            </Text>

            <Text style={questDetailsStyles.infoValue}>
              {quest?.start
                ? new Date(quest.start).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })
                : "—"}
              {", "}
              {quest?.start
                ? new Date(quest.start).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })
                : "—"}
            </Text>
          </View>

        </View>

        <View style={questDetailsStyles.divider} />

        <View style={questDetailsStyles.infoRow}>

          <View style={questDetailsStyles.infoIcon}>
            <MaterialCommunityIcons
              name="star-circle-outline"
              size={23}
              color="#FF6B6B"
            />
          </View>

          <Text style={questDetailsStyles.rewardLabel}>
            Rewards
          </Text>

          <Text style={questDetailsStyles.rewardValue}>
            + {quest.reward.exp} XP
          </Text>

        </View>

      </View>


      {/* Complete */}
      <View style={questDetailsStyles.bottomContainer}>

        <Pressable
          disabled={!canComplete}
          style={[
            questDetailsStyles.completeButton,
            !canComplete || quest.is_completed === true
              ? questDetailsStyles.disabledButton
              : { backgroundColor: "#145AE8" },
          ]}
          onPress={() => completeQuest()}
        >
          <Text style={questDetailsStyles.completeButtonText}>
            {waitingForStart ? "Quest Not Started" : "Mark as Complete"}
          </Text>
        </Pressable>

      </View>

    </View >
  )
}