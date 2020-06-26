import { ApolloError } from 'apollo-client';

export type TodoType = {
  id: string;
  title: string;
  completed: boolean;
};

export type AllTodosType = {
  getAllTodos: Array<TodoType>;
}

export type HandleAddTodo = (title: string) => void;
export type HandleHelper = (id: string) => () => void;

export type UseTodosType = {
  addTodo(): void;
  handleAddTodo: HandleAddTodo;
  handleComplete: HandleHelper;
  handleRemove: HandleHelper;
}

export type GetAllTodos = {
  data: AllTodosType;
  loading: boolean;
  error: ApolloError;
}