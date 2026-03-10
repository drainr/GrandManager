import React from 'react';
import TodoList from '../components/list/ListInput.jsx';
import DisplayTodo from '../components/list/DisplayTodo.jsx';
import MultiSelectButton from '../components/list/multiSelectButton.jsx';

const Calender = () => {
  return (
    <div className="min-h-screen bg-white p-4">
      <DisplayTodo />

      <div className="mr-auto mt-4 flex w-full max-w-4xl flex-col gap-4 lg:flex-row lg:items-start">
        <TodoList />
        <MultiSelectButton />
      </div>
    </div>
  );
};

export default Calender;