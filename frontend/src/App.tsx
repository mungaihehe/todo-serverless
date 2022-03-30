import React, { useState, Fragment, useEffect } from "react";
import { Todo } from "./components/Todo";
import { AddIcon } from "./icons/Add";
import { LogOutIcon } from "./icons/LogOut";
import { TodoItem } from "./utils/TodoItem";
import { produce } from "immer";
import { Dialog, Transition } from "@headlessui/react";
import { AddTodo } from "./components/AddTodo";
import "@aws-amplify/ui-react/styles.css";
import { API } from "aws-amplify";

function App({ signOut, user }: any) {
  const [todos, setTodos] = useState([
    {
      title: "First todo",
      content: "hello",
      todoId: "v4",
      completed: false,
      attachment:
        "https://www.thedesignwork.com/wp-content/uploads/2011/10/Random-Pictures-of-Conceptual-and-Creative-Ideas-02.jpg",
    },
  ] as TodoItem[]);
  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  async function getTodos() {
    try {
      const response = await API.get("todos", "/todos", {});
      setTodos(response);
    } catch (e: any) {
      console.error(e);
    }
    setLoading(false);
  }
  useEffect(() => {
    getTodos();
  }, []);
  return (
    <>
      <div className="min-h-screen bg-slate-900 py-2 text-slate-200 flex flex-col items-center">
        <main className="inline-flex flex-col w-11/12 md:w-2/3">
          <nav className="flex items-center justify-between py-2 px-3 gap-5 w-full">
            <h2 className="font-bold text-lg">Todos</h2>
            <div className="flex items-center gap-2">
              <button
                className="p-2 flex items-center justify-center bg-lime-500 rounded-md"
                onClick={signOut}
              >
                <LogOutIcon className="h-6 w-6" />
              </button>
              <button
                className="p-2 flex gap-2 items-center justify-center bg-lime-500 rounded-md"
                onClick={() => setOpenAdd(true)}
              >
                <AddIcon className="h-6 w-6" />
                Add
              </button>
            </div>
          </nav>
          <section>
            {todos.length <= 0 && <p>No todos yet!</p>}
            {loading && <p>Loading...</p>}
            {!loading &&
              todos.map((todo, index) => (
                <Todo
                  key={todo.todoId}
                  item={todo}
                  onChange={async (newItem) => {
                    setTodos(
                      produce((draft) => {
                        draft[index] = newItem;
                      })
                    );
                    await API.put("todos", `/todo/${todo.todoId}`, newItem);
                  }}
                  onDelete={async () => {
                    setTodos(
                      produce((draft) => {
                        draft.splice(index, 1);
                      })
                    );
                    await API.del("todos", `/todo/${todo.todoId}`, {});
                  }}
                />
              ))}
          </section>
        </main>
      </div>

      <Transition appear show={openAdd} as={Fragment}>
        <Dialog
          as="div"
          onClose={() => setOpenAdd(false)}
          className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center"
        >
          <Dialog.Overlay className="fixed inset-0" />
          <div className="w-11/12 sm:w-1/3 drop-shadow-md">
            <AddTodo
              onAdd={async (item) => {
                setTodos((todos) => todos.concat(item));
                setOpenAdd(false);
                await API.post("todos", "/todo", { body: item });
              }}
            />
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default App;
