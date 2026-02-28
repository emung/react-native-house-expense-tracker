import axios from 'axios';
import { EXPENSES_URL } from '../constants';
import Expense from './Expense';
import ExpensesWithMeta from './ExpensesWithMeta';

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
      console.error('Error fetching expense:', error);
      throw error;
    }
  }

  /**
   * Fetches all expenses from the server.
   * @returns A promise that resolves to an AllExpenses object containing the list of expenses
   * @throws Error if the network request fails
   */
  async getAllExpenses(): Promise<ExpensesWithMeta> {
    try {
      const response = await axios.get<ExpensesWithMeta>(EXPENSES_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  }

  /**
   * Fetches all distinct expense categories from the server.
   * @returns A promise that resolves to an array of distinct expense categories
   * @throws Error if the network request fails
   */
  async getAllDistinctExpenseCategories(): Promise<string[]> {
    try {
      const response = await axios.get<string[]>(`${EXPENSES_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching distinct expense categories:', error);
      throw error;
    }
  }

  /**
   * Fetches all expenses by category from the server.
   * @param category - The category of expenses to retrieve
   * @returns A promise that resolves to an AllExpenses object containing the list of expenses
   * @throws Error if the network request fails
   */
  async getAllExpensesByCategory(category: string): Promise<ExpensesWithMeta> {
    try {
      const response = await axios.get<ExpensesWithMeta>(`${EXPENSES_URL}/by-category?category=${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses by category:', error);
      throw error;
    }
  }

  /**
   * Fetches all expenses by description from the server.
   * @param description - The description of expenses to retrieve
   * @returns A promise that resolves to an AllExpenses object containing the list of expenses
   * @throws Error if the network request fails
   */
  async getAllExpensesByDescription(description: string): Promise<ExpensesWithMeta> {
    try {
      const response = await axios.get<ExpensesWithMeta>(`${EXPENSES_URL}/by-description?description=${description}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses by description:', error);
      throw error;
    }
  }
}
