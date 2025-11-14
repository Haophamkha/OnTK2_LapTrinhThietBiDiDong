import { View, Text, FlatList, RefreshControl } from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import { Redirect, useFocusEffect } from "expo-router";
import { Transaction } from "@/types/transaction";
import { useSQLiteContext } from "expo-sqlite";
import { getAllTransactions, softDeleteTransaction } from "@/db";
import TransactionItem from "@/components/TransactionItem";
import { SegmentedButtons, TextInput } from "react-native-paper";

const HomePage = () => {
  const db = useSQLiteContext();

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [titleSearch, setTitleSearch] = useState("");
  const [typeSearch, setTypeSearch] = useState("All");

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleFetchDb = async () => {
    getAllTransactions(db, 0).then((res) => setTransactions(res));
  };

  const handleSoftDelete = async (id: number) => {
    softDeleteTransaction(db, id).then(() => handleFetchDb());
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    getAllTransactions(db, 0).then((res) => setTransactions(res));
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

  return (
    <View className="flex flex-1">
      <View className="px-4 gap-4 my-2">
        <Text className="text-lg">Searching</Text>
        <TextInput
          label={"Title"}
          value={titleSearch}
          onChangeText={(value) => setTitleSearch(value)}
        />
        <SegmentedButtons
          value={typeSearch}
          onValueChange={setTypeSearch}
          buttons={[
            { label: "All", value: "All" },
            { label: "Income", value: "Income" },
            { label: "Expense", value: "Expense" },
          ]}
        />
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TransactionItem onDelete={handleSoftDelete} data={item} />
        )}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

export default HomePage;
