// src/app/form.tsx (hoặc screens/TransactionFormScreen.tsx)
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { Transaction } from "@/types/transaction";
import { createTransaction, getTransactionById, updateTransaction } from "@/db";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const TransactionFormScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const db = useSQLiteContext();
  const router = useRouter();

  const [formData, setFormData] = useState<Transaction>({} as Transaction);
  const [type, setType] = useState<"Income" | "Expense">("Expense");

  const titleRef = useRef<TextInput>(null);
  const amountRef = useRef<TextInput>(null);

  // Load data khi edit
  useFocusEffect(
    useCallback(() => {
      if (id) {
        getTransactionById(db, Number(id)).then((res) => {
          if (res) {
            setFormData(res);
            setType(res.type);
          }
        });
      }

      return () => {
        setFormData({} as Transaction);
        setType("Expense");
      };
    }, [id, db])
  );

  const handleSave = async () => {
    if (!formData.title || !formData.amount) return;

    const transaction = { ...formData, type };

    if (id) await updateTransaction(db, transaction);
    else await createTransaction(db, transaction);

    router.replace("/home");
  };

  const isIncome = type === "Income";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50 dark:bg-gray-900"
    >
      <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-8">
        <View className="max-w-md w-full mx-auto">
          {/* Tiêu đề */}
          <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">
            {id ? "Edit Transaction" : "New Transaction"}
          </Text>

          {/* Form Card */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6 border border-gray-100 dark:border-gray-700">
            {/* Title Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </Text>
              <TextInput
                ref={titleRef}
                value={formData.title ?? ""}
                onChangeText={(text) =>
                  setFormData({ ...formData, title: text })
                }
                placeholder="e.g. Salary, Coffee"
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base text-gray-900 dark:text-gray-100"
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Amount Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount
              </Text>
              <TextInput
                ref={amountRef}
                value={formData.amount ? formData.amount.toString() : ""}
                onChangeText={(text) =>
                  setFormData({ ...formData, amount: Number(text) || 0 })
                }
                placeholder="0.00"
                keyboardType="numeric"
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base text-gray-900 dark:text-gray-100"
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Type Selector */}
            <View>
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Type
              </Text>
              <View className="flex-row justify-between gap-3">
                {/* Income */}
                <TouchableOpacity
                  onPress={() => setType("Income")}
                  className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl border-2 ${
                    isIncome
                      ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500"
                      : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <MaterialIcons
                    name="trending-up"
                    size={20}
                    color={isIncome ? "#10b981" : "#6b7280"}
                  />
                  <Text
                    className={`font-semibold ${
                      isIncome
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Income
                  </Text>
                </TouchableOpacity>

                {/* Expense */}
                <TouchableOpacity
                  onPress={() => setType("Expense")}
                  className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl border-2 ${
                    !isIncome
                      ? "bg-rose-50 dark:bg-rose-900/30 border-rose-500"
                      : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <MaterialIcons
                    name="trending-down"
                    size={20}
                    color={!isIncome ? "#ef4444" : "#6b7280"}
                  />
                  <Text
                    className={`font-semibold ${
                      !isIncome
                        ? "text-rose-700 dark:text-rose-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Expense
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={!formData.title || !formData.amount}
              className={`mt-4 py-3 rounded-xl flex-row items-center justify-center gap-2 ${
                formData.title && formData.amount
                  ? "bg-emerald-500 active:opacity-80"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <MaterialIcons name="save" size={18} color="white" />
              <Text className="text-white font-bold text-base">
                Save Transaction
              </Text>
            </TouchableOpacity>
          </View>

          {/* Back Link */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 flex-row items-center justify-center gap-2"
          >
            <MaterialIcons name="arrow-back" size={18} color="#6b7280" />
            <Text className="text-gray-600 dark:text-gray-400 text-sm">
              Back to list
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TransactionFormScreen;
