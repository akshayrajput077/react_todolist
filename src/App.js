import './App.css';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
  } = useForm()
  const [todo, setTodo] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const onSubmit = (data) => {
    const newTodo = data.todo.trim();
    if (newTodo.trim() === '') return;

    const isDuplicate = todo.some((item, index) =>
      item.toLowerCase() === newTodo.toLowerCase() && index !== editIndex
    );

    if (isDuplicate) {
      setError("todo", {
        type: "duplicate",
        message: "This todo already exists",
      });
      return;
    }

    if (editIndex !== null) {
      const updatedTodos = [...todo];
      updatedTodos[editIndex] = newTodo;
      setTodo(updatedTodos);
      setEditIndex(null);
    } else {
      setTodo([newTodo, ...todo]);
    }

    reset();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleDelete = (index) => {
    const newTodos = todo.filter((_, i) => i !== index);
    setTodo(newTodos);
    if (editIndex === index) {
      setEditIndex(null);
      reset();
    }
  };

  const handleEdit = (index) => {
    setValue("todo", todo[index]);
    setEditIndex(index);
  };

  return (
    <div className="App">
      <div className='container'>
        <h2><span class="todo">Todo</span> <span class="list">List</span></h2>
        <form className='todo-from' onSubmit={handleSubmit(onSubmit)}>
          <input
            type='text'
            name='todo'
            placeholder="Add a todo"
            onKeyDown={handleKeyDown}
            {...register("todo", { required: "Todo is required" })}
            aria-invalid={errors.todo ? "true" : "false"}

          />
          <button type='submit' className={`${editIndex !== null ? 'updatebutton ' : 'addbutton '}`}>
            {editIndex !== null ? 'Update' : 'Add'}
          </button>
        </form>
        {errors.todo && <span className="error" style={{ fontSize: '14px', color: 'red', display: 'flex', justifyContent: 'left', fontStyle: '14px', fontWeight: 400, marginLeft: '15px' }}>{errors.todo.message}</span>}

        <ul>
          {todo.map((item, index) => (
            <li key={index}>
              {item}
              <div>
                <button className='editbutton ' onClick={() => handleEdit(index)}>Edit</button>
                <button className='deletebutton ' onClick={() => handleDelete(index)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>

        {todo.length === 0 ? <span style={{ fontSize: '15px', color: 'gray' }}>No todos available</span> : null}
        {todo.length > 5 ? <p>You have a lot of todos!</p> : null}
        {todo.length > 0 ? <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 7px 0px' }}>
          <span style={{ fontSize: '12px', color: 'gray' }}>You have {todo.length} todo add</span>
          <button className='clearbutton' onClick={() => setTodo([])}>clear all</button></div> : null}
      </div>
    </div>
  );
}

export default App;
