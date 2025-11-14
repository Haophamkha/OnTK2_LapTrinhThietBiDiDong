// src/app/home.tsx
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { Transaction } from "@/types/transaction";
import { useSQLiteContext } from "expo-sqlite";
import { getAllTransactions, softDeleteTransaction } from "@/db";
import TransactionItem from "@/components/TransactionItem";
import { MaterialIcons } from "@expo/vector-icons";

const HomePage = () => {
  const db = useSQLiteContext();
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [titleSearch, setTitleSearch] = useState("");
  const [typeSearch, setTypeSearch] = useState<"All" | "Income" | "Expense">(
    "All"
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // ────── LOGIC GIỮ NGUYÊN ──────
  const handleFetchDb = async () => {
    setLoading(true);
    const res = await getAllTransactions(db, 0);
    setTransactions(res);
    setLoading(false);
  };

  const handleSoftDelete = async (id: number) => {
    await softDeleteTransaction(db, id);
    await handleFetchDb(); // giữ nguyên
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const res = await getAllTransactions(db, 0);
    setTransactions(res);
    setIsRefreshing(false);
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
      .filter((item) =>
        typeSearch === "All" ? true : item.type === typeSearch
      );
  }, [db, typeSearch, titleSearch, transactions]);
  // ───────────────────────────────

  const isEmpty = filteredTransactions.length === 0 && !loading;

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* ==== SEARCH & FILTER CARD ==== */}
      <View className="px-6 my-4">
        <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 space-y-5 border border-gray-100 dark:border-gray-700">
          {/* Search */}
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

          {/* Filter */}
          <View>
            <View className="flex-row items-center gap-2 mb-3">
              <MaterialIcons name="filter-list" size={18} color="#6b7280" />
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by Type
              </Text>
            </View>
            <View className="flex-row gap-2">
              {(["All", "Income", "Expense"] as const).map((type) => {
                const active = typeSearch === type;
                const income = type === "Income";
                const expense = type === "Expense";

                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setTypeSearch(type)}
                    className={`flex-1 flex-row items-center justify-center gap-2 py-2.5 rounded-xl border-2 ${
                      active
                        ? income
                          ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500"
                          : expense
                          ? "bg-rose-50 dark:bg-rose-900/30 border-rose-500"
                          : "bg-gray-100 dark:bg-gray-700 border-gray-500"
                        : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    } active:opacity-70`}
                  >
                    {income && (
                      <MaterialIcons
                        name="trending-up"
                        size={16}
                        color="#10b981"
                      />
                    )}
                    {expense && (
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
                        active
                          ? income
                            ? "text-emerald-700 dark:text-emerald-400"
                            : expense
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

      {/* ==== LIST ==== */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="px-6 pb-24"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#10b981"
          />
        }
        ListEmptyComponent={() => (
          <View className="items-center py-16">
            {loading ? (
              <ActivityIndicator size="large" color="#10b981" />
            ) : (
              <>
                <MaterialIcons name="receipt-long" size={64} color="#9ca3af" />
                <Text className="text-lg font-medium text-gray-600 dark:text-gray-400 mt-4">
                  No transactions
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-500 text-center mt-1 max-w-xs px-4">
                  Tap the plus button to add one.
                </Text>
              </>
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <TransactionItem onDelete={handleSoftDelete} data={item} />
        )}
      />

      {/* ==== FAB ==== */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          onPress={() => router.push("/form")}
          className="bg-emerald-500 rounded-full p-4 shadow-lg active:opacity-80"
        >
          <MaterialIcons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomePage;
