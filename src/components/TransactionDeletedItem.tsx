// src/components/TransactionDeletedItem.tsx
import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Transaction } from "@/types/transaction";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
  data: Transaction;
  onRestore: (id: number) => void;
};

const TransactionDeletedItem = ({ data, onRestore }: Props) => {
  const router = useRouter();
  const isIncome = data.type === "Income"; // Đồng bộ

  const onPressEdit = () => {
    router.push({ pathname: "/form", params: { id: data.id.toString() } });
  };

  return (
    <View className="px-4 my-2">
      {/* Card: giống hệt nhưng mờ + gạch ngang */}
      <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden opacity-75">
        {/* Header: giống hệt + line-through */}
        <View
          className={`flex-row items-center justify-between px-5 py-3 ${
            isIncome
              ? "bg-emerald-50 dark:bg-emerald-900/30"
              : "bg-rose-50 dark:bg-rose-900/30"
          }`}
        >
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 flex-1 ">
            {data.title}
          </Text>
          <MaterialIcons
            name={isIncome ? "trending-up" : "trending-down"}
            size={22}
            color={isIncome ? "#10b981" : "#ef4444"}
            style={{ opacity: 0.6 }}
          />
        </View>

        {/* Nội dung: giống hệt */}
        <View className="px-5 py-4 space-y-3">
          {/* Amount */}
          <View className="flex-row justify-between items-baseline">
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Amount
            </Text>
            <Text
              className={`text-2xl font-bold ${
                isIncome
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
              style={{ opacity: 0.8 }}
            >
              {isIncome ? "+" : "-"}${Math.abs(data.amount).toFixed(2)}
            </Text>
          </View>

          {/* Type */}
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Type
            </Text>
            <View
              className={`px-3 py-1 rounded-full ${
                isIncome
                  ? "bg-emerald-100 dark:bg-emerald-800"
                  : "bg-rose-100 dark:bg-rose-800"
              }`}
              style={{ opacity: 0.7 }}
            >
              <Text
                className={`text-xs font-medium ${
                  isIncome
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-rose-700 dark:text-rose-300"
                }`}
              >
                {data.type}
              </Text>
            </View>
          </View>

          {/* Date */}
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Date
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {new Date(data.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>

        {/* Actions: nút giống hệt */}
        <View className="flex-row justify-end gap-3 px-5 pb-4 pt-2">
          {/* Edit Button – ĐÃ SỬA MÀU ICON: #6b7280 (xám) */}
          <TouchableOpacity
            onPress={onPressEdit}
            className="flex-row items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl active:opacity-70"
          >
            <MaterialIcons name="edit" size={16} color="#6b7280" />
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Edit
            </Text>
          </TouchableOpacity>

          {/* Restore Button – thay Delete, màu xanh */}
          <TouchableOpacity
            onPress={() => onRestore(data.id)}
            className="flex-row items-center gap-2 px-4 py-2 bg-emerald-500 rounded-xl active:opacity-70"
          >
            <MaterialIcons name="restore" size={16} color="white" />
            <Text className="text-sm font-semibold text-white">Restore</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TransactionDeletedItem;
