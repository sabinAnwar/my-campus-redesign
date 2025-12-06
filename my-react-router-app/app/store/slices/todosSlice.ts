import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

interface TodosState {
  items: Todo[];
  filter: "all" | "active" | "completed";
}

const initialState: TodosState = {
  items: [
    {
      id: "1",
      title: "Learn Redux Toolkit",
      completed: true,
      priority: "high",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Build a React App",
      completed: false,
      priority: "medium",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Master TypeScript",
      completed: false,
      priority: "high",
      createdAt: new Date().toISOString(),
    },
  ],
  filter: "all",
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (
      state,
      action: PayloadAction<{ title: string; priority: Todo["priority"] }>
    ) => {
      const newTodo: Todo = {
        id: Date.now().toString(),
        title: action.payload.title,
        completed: false,
        priority: action.payload.priority,
        createdAt: new Date().toISOString(),
      };
      state.items.push(newTodo);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    setFilter: (
      state,
      action: PayloadAction<"all" | "active" | "completed">
    ) => {
      state.filter = action.payload;
    },
    updateTodoPriority: (
      state,
      action: PayloadAction<{ id: string; priority: Todo["priority"] }>
    ) => {
      const todo = state.items.find((t) => t.id === action.payload.id);
      if (todo) {
        todo.priority = action.payload.priority;
      }
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  removeTodo,
  setFilter,
  updateTodoPriority,
} = todosSlice.actions;

export default todosSlice.reducer;
