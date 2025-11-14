import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import { Slot, Stack, Tabs } from "expo-router";
import { Text } from "react-native";
import { SQLiteProvider } from "expo-sqlite";
import { initTable } from "@/db";
import { Icon } from "react-native-paper";

export default function Layout() {
  return (
    <SQLiteProvider databaseName="app500.db" onInit={(db) => initTable(db)}>
      <SafeAreaProvider>
        <SafeAreaView className="flex flex-1">
          <Text className="text-3xl text-center font-bold">
            Expense Tracker
          </Text>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: "black",
            }}
          >
            <Tabs.Screen
              name="home"
              options={{
                tabBarIcon: ({ focused, color }) => (
                  <Icon
                    source={focused ? "home" : "home-outline"}
                    size={24}
                    color={color}
                  ></Icon>
                ),
              }}
            ></Tabs.Screen>
            <Tabs.Screen
              name="form"
              options={{
                tabBarIcon: ({ focused, color }) => (
                  <Icon source={"form-select"} size={24} color={color}></Icon>
                ),
              }}
            ></Tabs.Screen>
            <Tabs.Screen
              name="trash"
              options={{
                tabBarIcon: ({ focused, color }) => (
                  <Icon source={"trash-can"} size={24} color={color}></Icon>
                ),
              }}
            ></Tabs.Screen>
            <Tabs.Screen
              name="sync"
              options={{
                tabBarIcon: ({ focused, color }) => (
                  <Icon source={"sync-circle"} size={24} color={color}></Icon>
                ),
              }}
            ></Tabs.Screen>
            <Tabs.Screen
              name="index"
              options={{
                href: null,
              }}
            />
          </Tabs>
        </SafeAreaView>
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}
