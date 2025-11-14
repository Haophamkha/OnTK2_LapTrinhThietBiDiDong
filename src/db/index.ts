import { Transaction } from "@/types/transaction";
import { SQLiteDatabase } from "expo-sqlite";

export const initTable = async (db: SQLiteDatabase) => {
  await db.execAsync(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            amount REAL NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            type TEXT NOT NULL,
            isDeleted INTEGER DEFAULT 0
        )
        `);
};

// CREATE
export const createTransaction = async (
  db: SQLiteDatabase,
  data: Transaction
) => {
  await db.runAsync(
    `INSERT INTO transactions (title, amount, type) VALUES (?, ?, ?)`,
    [data.title, data.amount, data.type]
  );
};

// READ
export const getAllTransactions = async (
  db: SQLiteDatabase,
  isDeleted: number
) => {
  return await db.getAllAsync<Transaction>(
    `SELECT * FROM transactions WHERE isDeleted = ?`,
    [isDeleted]
  );
};

export const getTransactionById = async (db: SQLiteDatabase, id: number) => {
  return await db.getFirstAsync<Transaction>(
    `SELECT * FROM transactions WHERE id = ?`,
    [id]
  );
};

// UPDATE
export const updateTransaction = async (
  db: SQLiteDatabase,
  data: Transaction
) => {
  await db.runAsync(
    `UPDATE transactions SET title = ?, amount = ?, type = ? WHERE id = ?`,
    [data.title, data.amount, data.type, data.id]
  );
};

//  DELETE
export const softDeleteTransaction = async (db: SQLiteDatabase, id: number) => {
  await db.runAsync(`UPDATE transactions SET isDeleted = 1 WHERE id = ?`, [id]);
};

export const restoreTransaction = async (db: SQLiteDatabase, id: number) => {
  await db.runAsync(`UPDATE transactions SET isDeleted = 0 WHERE id = ?`, [id]);
};
