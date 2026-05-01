// context/TaskContext.js
import { createContext, useCallback, useContext, useState } from "react";

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  const addTask = useCallback((taskData) => {
    const newTask = {
      id: Date.now().toString(),
      name: taskData.name,
      deadline: taskData.deadline || null,
      tags: taskData.tags || [],
      subtasks: (taskData.subtasks || []).map((text, i) => ({
        id: i.toString(),
        text,
        done: false,
      })),
      priority: taskData.priority || "Sedang",
      done: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }, []);

  const toggleSubtask = useCallback((taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const subtasks = t.subtasks.map((s) =>
          s.id === subtaskId ? { ...s, done: !s.done } : s,
        );
        const allDone = subtasks.length > 0 && subtasks.every((s) => s.done);
        return { ...t, subtasks, done: allDone };
      }),
    );
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );
  }, []);

  const getStats = useCallback(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.done).length;
    const aktif = total - done;
    const now = new Date().toDateString();
    const lewat = tasks.filter((t) => {
      if (t.done || !t.deadline) return false;
      return new Date(t.deadline) < new Date(now);
    }).length;
    const progres = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, aktif, lewat, progres };
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        toggleTask,
        toggleSubtask,
        updateTask,
        getStats,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
