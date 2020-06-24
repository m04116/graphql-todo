import { ApolloError } from 'apollo-client';

export type TodoType = {
  id: string;
  title: string;
  completed: boolean;
}

export type HandleAddTodo = (title: string) => void;
export type HandleHelper = (id: string) => () => void;

export type UseTodosType = {
  addTodo(): void;
  error: ApolloError;
  loading: boolean;
  handleAddTodo: HandleAddTodo;
  handleComplete: HandleHelper;
  handleRemove: HandleHelper;
}