import { View, Text } from "react-native";
import React from "react";
import { Transaction } from "@/types/transaction";
import { Button, Card } from "react-native-paper";
import { useRouter } from "expo-router";

type Props = {
  data: Transaction;
  onRestore: (id: number) => void;
};

const TransactionDeletedItem = ({ data, onRestore }: Props) => {
  const router = useRouter();

  const onPressEdit = () => {
    router.push({ pathname: "/form", params: { id: data.id.toString() } });
  };

  return (
    <View className="px-4 my-2">
      <Card>
        <Card.Title title={data.title}></Card.Title>
        <Card.Content>
          <Text>Amount: {data.amount}</Text>
          <Text>Type: {data.type}</Text>
          <Text>Created At: {new Date(data.createdAt).toDateString()}</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => onRestore(data.id)}>
            Restore
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default TransactionDeletedItem;
