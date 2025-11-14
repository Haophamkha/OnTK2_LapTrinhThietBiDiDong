// src/app/sync.tsx
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Transaction } from "@/types/transaction";
import { getAllTransactions } from "@/db";
import { useSQLiteContext } from "expo-sqlite";
import { MaterialIcons } from "@expo/vector-icons";

const SyncPage = () => {
  const [apiUrl, setApiUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const db = useSQLiteContext();

  const handleSync = async () => {
    if (!apiUrl.trim()) {
      Alert.alert("Error", "Please enter a valid API URL");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Lấy dữ liệu từ API
      const apiData = (await fetch(apiUrl).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch from API");
        return res.json();
      })) as Transaction[];

      // 2. Xóa hết trên server
      await Promise.all(
        apiData.map((item) =>
          fetch(`${apiUrl}/${item.id}`, { method: "DELETE" }).catch(() => {})
        )
      );

      // 3. Lấy dữ liệu local
      const localData = await getAllTransactions(db, 0);

      // 4. Đẩy local lên server
      await Promise.all(
        localData.map((item) =>
          fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          }).catch((err) => console.warn("Upload failed for:", item.id, err))
        )
      );

      Alert.alert("Success", "Sync completed successfully!");
    } catch (error: any) {
      Alert.alert("Sync Failed", error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50 dark:bg-gray-900"
    >
      <View className="flex-1 justify-center px-6 py-8">
        <View className="max-w-md w-full mx-auto">
          {/* Tiêu đề */}
          <View className="items-center mb-8">
            <MaterialIcons name="sync" size={48} color="#10b981" />
            <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-3">
              Sync Data
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-center">
              Push local transactions to your server
            </Text>
          </View>

          {/* Card */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6 border border-gray-100 dark:border-gray-700">
            {/* API URL Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API Endpoint
              </Text>
              <TextInput
                value={apiUrl}
                onChangeText={setApiUrl}
                placeholder="https://your-api.com/transactions"
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base text-gray-900 dark:text-gray-100"
                placeholderTextColor="#9ca3af"
              />
              
            </View>

            {/* Sync Button */}
            <TouchableOpacity
              onPress={handleSync}
              disabled={isLoading || !apiUrl.trim()}
              className={`py-3 rounded-xl flex-row items-center justify-center gap-3 ${
                isLoading || !apiUrl.trim()
                  ? "bg-gray-300 dark:bg-gray-600"
                  : "bg-emerald-500 active:opacity-80"
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <MaterialIcons name="cloud-upload" size={20} color="white" />
              )}
              <Text className="text-white font-bold text-base">
                {isLoading ? "Syncing..." : "Start Sync"}
              </Text>
            </TouchableOpacity>
          </View>

          
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SyncPage;
