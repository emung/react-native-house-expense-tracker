import { fetch } from "expo/fetch";
import { EXPENSES_URL } from "../constants";
import Expense from "./Expense";

export default class ExpenseService {
  constructor() {}

  /**
   * Fetches a single expense by its ID from the server.
   * @param id - The unique identifier of the expense to retrieve
   * @returns A promise that resolves to the Expense object
   * @throws Error if the network request fails or the response is invalid
   */
  async getExpenseById(id: number): Promise<Expense> {
    try {
      const response = await fetch(`${EXPENSES_URL}/${id}`);
      const expense = await response.json();
      return expense;
    } catch (error) {
      console.error("Error fetching expense:", error);
      throw error;
    }
  }
}
