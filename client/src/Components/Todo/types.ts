export type TodoType = {
  id: string;
  title: string;
  completed: boolean;
};

export type CashDataType = {
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