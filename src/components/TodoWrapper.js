import React, { useState, useEffect } from "react";
import axios from "axios";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { v4 as uuidv4 } from "uuid";
import { EditTodoForm } from "./EditTodoForm";
import { api } from "../service/api";

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);

  const addTodo = async (task) => {
    try {
      // Adicionar a tarefa localmente
      const newTodo = {
        id: uuidv4(),
        task,
        completed: false,
        isEditing: false,
      };
      setTodos((prevTodos) => [...prevTodos, newTodo]);

      // Fazer a chamada para o backend
      const response = await api.post("/tasks", newTodo);

      // Atualizar o estado com a resposta do backend (opcional, dependendo da resposta)
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === newTodo.id ? response.data : todo))
      );
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      // Remover a tarefa localmente
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

      // Fazer a chamada para o backend
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error.message);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const response = await api.put(`/tasks/${id}`, {
        completed: !todos.find((todo) => todo.id === id).completed,
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? response.data : todo))
      );
    } catch (error) {
      console.error("Erro ao atualizar a conclusão da tarefa:", error.message);
    }
  };

  const editTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  const editTask = async (task, id) => {
    try {
      const response = await api.put(`/tasks/${id}`, { task });
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...response.data, isEditing: false } : todo
        )
      );
    } catch (error) {
      console.error("Erro ao editar a tarefa:", error.message);
    }
  };

  return (
    <div className="TodoWrapper">
      <h1>Day Tasks!</h1>
      <TodoForm addTodo={addTodo} />
      {/* display todos */}
      {todos.map((todo) =>
        todo.isEditing ? (
          <EditTodoForm editTodo={editTask} task={todo} key={todo.id} />
        ) : (
          <Todo
            key={todo.id}
            task={todo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            toggleComplete={toggleComplete}
          />
        )
      )}
    </div>
  );
};
