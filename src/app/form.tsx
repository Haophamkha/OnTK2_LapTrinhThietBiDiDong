import { View, Text } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { Transaction } from "@/types/transaction";
import { Button, RadioButton, TextInput } from "react-native-paper";
import { createTransaction, getTransactionById, updateTransaction } from "@/db";
import { useSQLiteContext } from "expo-sqlite";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";

const TransactionFormScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const db = useSQLiteContext();
  const navigation = useNavigation();
  const router = useRouter();

  const [formData, setFormData] = useState<Transaction>({} as Transaction);

  const titleRef = useRef(null);
  const amountRef = useRef(null);

  const handleSave = async () => {
    if (!formData.title || !formData.amount || !formData.type) return;

    if (id) await updateTransaction(db, formData);
    else await createTransaction(db, formData);

    setFormData({} as Transaction);
    titleRef.current?.clear();
    amountRef.current?.clear();
    router.replace("/home");
  };

  useFocusEffect(
    useCallback(() => {
      if (id) {
        getTransactionById(db, Number(id)).then((res) => setFormData(res));
      }

      return () => {
        setFormData({} as Transaction);
        titleRef.current?.clear();
        amountRef.current?.clear();
        (navigation as any).setParams({ id: undefined });
      };
    }, [id, db])
  );

  return (
    <View className="flex flex-1 justify-center items-center">
      <View className="w-full px-4 gap-4">
        <Text className="text-lg">New Transaction</Text>
        <TextInput
          label={"Title"}
          value={formData.title ?? ""}
          onChangeText={(value) => setFormData({ ...formData, title: value })}
          ref={titleRef}
        />
        <TextInput
          label={"Amount"}
          value={formData.amount ? formData.amount.toString() : ""}
          keyboardType="number-pad"
          onChangeText={(value) =>
            setFormData({ ...formData, amount: Number(value) })
          }
          ref={amountRef}
        />
        <RadioButton.Group
          value={formData.type}
          onValueChange={(value) =>
            setFormData({ ...formData, type: value as "Income" | "Expense" })
          }
        >
          <RadioButton.Item label="Income" value="Income" />
          <RadioButton.Item label="Expense" value="Expense" />
        </RadioButton.Group>
        <Button mode="contained" onPress={handleSave}>
          Save
        </Button>
      </View>
    </View>
  );
};

export default TransactionFormScreen;
