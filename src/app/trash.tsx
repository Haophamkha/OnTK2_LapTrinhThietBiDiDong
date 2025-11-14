// src/app/trash.tsx
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Transaction } from "@/types/transaction";
import { useSQLiteContext } from "expo-sqlite";
import { getAllTransactions, restoreTransaction } from "@/db";
import TransactionDeletedItem from "@/components/TransactionDeletedItem";
import { MaterialIcons } from "@expo/vector-icons";

const TrashPage = () => {
  const db = useSQLiteContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [titleSearch, setTitleSearch] = useState("");
  const [typeSearch, setTypeSearch] = useState<"All" | "Income" | "Expense">(
    "All"
  );

  const handleFetchDb = async () => {
    setLoading(true);
    const res = await getAllTransactions(db, 1);
    setTransactions(res);
    setLoading(false);
  };

  const handleRestore = async (id: number) => {
    await restoreTransaction(db, id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  useFocusEffect(
    useCallback(() => {
      handleFetchDb();
    }, [db])
  );

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((item) =>
        item.title.toLowerCase().includes(titleSearch.toLowerCase())
      )
      .filter((item) => typeSearch === "All" || item.type === typeSearch);
  }, [transactions, titleSearch, typeSearch]);

  const isEmpty = filteredTransactions.length === 0 && !loading;

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      

      {/* Search & Filter Card */}
      <View className="px-6 my-4">
        <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 space-y-5 border border-gray-100 dark:border-gray-700">
          {/* Search Input */}
          <View>
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialIcons name="search" size={18} color="#6b7280" />
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Search by Title
              </Text>
            </View>
            <TextInput
              value={titleSearch}
              onChangeText={setTitleSearch}
              placeholder="e.g. Coffee, Salary..."
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base text-gray-900 dark:text-gray-100"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Filter Buttons */}
          <View>
            <View className="flex-row items-center gap-2 mb-3">
              <MaterialIcons name="filter-list" size={18} color="#6b7280" />
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by Type
              </Text>
            </View>
            <View className="flex-row gap-2">
              {(["All", "Income", "Expense"] as const).map((type) => {
                const isActive = typeSearch === type;
                const isIncome = type === "Income";
                const isExpense = type === "Expense";

                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setTypeSearch(type)}
                    className={`flex-1 flex-row items-center justify-center gap-2 py-2.5 rounded-xl border-2 ${
                      isActive
                        ? isIncome
                          ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500"
                          : isExpense
                          ? "bg-rose-50 dark:bg-rose-900/30 border-rose-500"
                          : "bg-gray-100 dark:bg-gray-700 border-gray-500"
                        : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    } active:opacity-70`}
                  >
                    {isIncome && (
                      <MaterialIcons
                        name="trending-up"
                        size={16}
                        color="#10b981"
                      />
                    )}
                    {isExpense && (
                      <MaterialIcons
                        name="trending-down"
                        size={16}
                        color="#ef4444"
                      />
                    )}
                    {type === "All" && (
                      <MaterialIcons
                        name="all-inbox"
                        size={16}
                        color="#6b7280"
                      />
                    )}
                    <Text
                      className={`text-sm font-semibold ${
                        isActive
                          ? isIncome
                            ? "text-emerald-700 dark:text-emerald-400"
                            : isExpense
                            ? "text-rose-700 dark:text-rose-400"
                            : "text-gray-700 dark:text-gray-300"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="px-6 pb-6"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View className="items-center py-16">
            {loading ? (
              <ActivityIndicator size="large" color="#10b981" />
            ) : (
              <>
                <MaterialIcons
                  name="delete-forever"
                  size={64}
                  color="#9ca3af"
                />
                <Text className="text-lg font-medium text-gray-600 dark:text-gray-400 mt-4">
                  Trash is empty
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-500 text-center mt-1 max-w-xs px-4">
                  Deleted transactions will appear here. You can restore them.
                </Text>
              </>
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <TransactionDeletedItem data={item} onRestore={handleRestore} />
        )}
      />

      {/* Back Button
      <View className="px-6 pb-6">
        <TouchableOpacity className="flex-row items-center justify-center gap-2 py-3">
          <MaterialIcons name="arrow-back" size={18} color="#6b7280" />
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            Back to Home
          </Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default TrashPage;
