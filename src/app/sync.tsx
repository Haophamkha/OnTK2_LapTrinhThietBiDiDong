import { View, Text } from "react-native";
import React, { useState } from "react";
import { Button, TextInput } from "react-native-paper";
import { Transaction } from "@/types/transaction";
import { getAllTransactions } from "@/db";
import { useSQLiteContext } from "expo-sqlite";

const SyncPage = () => {
  const [apiUrl, setApiUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const db = useSQLiteContext();

  const handleSync = async () => {
    if (apiUrl === "") return;

    setIsLoading(true);

    const apiData = (await fetch(apiUrl).then((res) =>
      res.json()
    )) as Transaction[];
    for (const item of apiData) {
      fetch(`${apiUrl}/${item.id}`, { method: "DELETE" });
    }

    const localData = await getAllTransactions(db, 0);
    for (const item of localData) {
      fetch(`${apiUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    }

    setIsLoading(false);
  };

  return (
    <View className="flex flex-1 justify-center items-center">
      <View className="w-full px-4 my-2 gap-4">
        <TextInput
          label={"Api URL here"}
          value={apiUrl}
          onChangeText={setApiUrl}
        />
        <Button mode="contained" disabled={isLoading} onPress={handleSync}>
          Sync
        </Button>
      </View>
    </View>
  );
};

export default SyncPage;
