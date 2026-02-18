import axios from "axios";
import { EXPENSES_URL } from "../constants";
import AllExpenses from "./AllExpenses";
import Expense from "./Expense";

export default class ExpenseService {
  /**
   * Fetches a single expense by its ID from the server.
   * @param id - The unique identifier of the expense to retrieve
   * @returns A promise that resolves to the Expense object
   * @throws Error if the network request fails or the response is invalid
   */
  async getExpenseById(id: number): Promise<Expense> {
    try {
      const response = await axios.get<Expense>(`${EXPENSES_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching expense:", error);
      throw error;
    }
  }

  /**
   * Fetches all expenses from the server.
   * @returns A promise that resolves to an AllExpenses object containing the list of expenses
   * @throws Error if the network request fails
   */
  async getAllExpenses(): Promise<AllExpenses> {
    try {
      const response = await axios.get<AllExpenses>(EXPENSES_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching expenses:", error);
      throw error;
    }
  }
}
