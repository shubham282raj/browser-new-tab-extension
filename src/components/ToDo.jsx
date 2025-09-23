import React, { useState, useRef } from "react";
import {
  addTodo,
  getTodos,
  removeCompletedTodo,
  toggleTodo,
} from "../utils/todo";
import { toggleLSKey } from "../utils/utils";

let refreshToDoList = () => {};

export default function ToDo() {
  const coor = {
    x: Number(localStorage.getItem("todo_offset_top")) || 100,
    y: Number(localStorage.getItem("todo_offset_left")) || 100,
  };

  const dragRef = useRef(null);

  const handleDrag = (dx, dy) => {
    if (dragRef.current) {
      // move the div directly for smoothness
      dragRef.current.style.top = dragRef.current.offsetTop + dy + "px";
      dragRef.current.style.left = dragRef.current.offsetLeft + dx + "px";
    }
  };

  const handleDragEnd = () => {
    if (dragRef.current) {
      const newX = dragRef.current.offsetTop;
      const newY = dragRef.current.offsetLeft;
      localStorage.setItem("todo_offset_top", newX);
      localStorage.setItem("todo_offset_left", newY);
    }
  };

  return (
    <div
      ref={dragRef}
      className="absolute bg-white/10 w-80 flex flex-col gap-2 p-2 rounded-lg group"
      style={{
        top: coor.x,
        left: coor.y,
      }}
      onClick={() => {
        document.getElementById("todo_input")?.focus();
      }}
    >
      <ToDoHeader onDrag={handleDrag} onDragEnd={handleDragEnd} />
      <ToDoList />
    </div>
  );
}

function ToDoHeader({ onDrag, onDragEnd }) {
  const dragStart = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    dragStart.current = { x: e.clientX, y: e.clientY };

    const handleMouseMove = (eMove) => {
      if (!dragStart.current) return;
      const dx = eMove.clientX - dragStart.current.x;
      const dy = eMove.clientY - dragStart.current.y;
      onDrag(dx, dy);
      dragStart.current = { x: eMove.clientX, y: eMove.clientY };
    };

    const handleMouseUp = () => {
      dragStart.current = null;
      onDragEnd();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="bg-white/10 rounded-lg select-none flex group">
      <div className="p-2 flex-1">ToDo</div>

      {/* show/hide completed todos */}
      <div
        className="bg-white/10 m-1 h-full rounded-lg cursor-pointer opacity-0 group-hover:opacity-50 transition-opacity duration-300 relative"
        title="Show/Hide Completed Tasks"
        onClick={() => {
          toggleLSKey("todo_show_history");
          refreshToDoList();
        }}
      >
        <img src="history.svg" alt="" className="invert p-1 select-none" />
        <div className="absolute w-full h-full top-0 left-0"></div>
      </div>

      {/* remove completed todos */}
      <div
        className="bg-white/10 m-1 h-full rounded-lg cursor-pointer opacity-0 group-hover:opacity-50 transition-opacity duration-300 relative"
        title="Remove Completed Todos"
        onClick={() => {
          if (
            confirm(
              "This action will permanently delete the completed To Do's! \nDo you want to continue?"
            )
          ) {
            removeCompletedTodo();
            refreshToDoList();
          }
        }}
      >
        <img src="trash.svg" alt="" className="invert p-1 select-none" />
        <div className="absolute w-full h-full top-0 left-0"></div>
      </div>

      <div
        className="bg-white/10 m-1 h-full rounded-lg cursor-move opacity-0 group-hover:opacity-50 transition-opacity duration-300 relative"
        onMouseDown={handleMouseDown}
      >
        <img src="move.svg" alt="" className="invert p-1 select-none" />
        <div className="absolute w-full h-full top-0 left-0"></div>
      </div>
    </div>
  );
}

function ToDoList() {
  const [ipt, setIpt] = useState("");
  const [todolist, settodolist] = useState(getTodos());
  refreshToDoList = () => settodolist(getTodos());

  return (
    <div>
      {todolist
        .sort((a, b) => a.done - b.done)
        .map((todo) => (
          <div key={todo.time} className="flex justify-between py-1 px-2">
            <div>
              <div>{todo.name}</div>
            </div>
            <button
              className="w-5 h-5 p-1 rounded-full bg-white/10 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toggleTodo(todo);
                refreshToDoList();
              }}
            >
              {todo.done && (
                <div className="h-full w-full bg-white/50 rounded-full"></div>
              )}
            </button>
          </div>
        ))}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!ipt.trim()) return;

          addTodo(ipt);
          setIpt("");
          refreshToDoList();
        }}
        className="flex hover:bg-white/10 rounded-lg p-2"
      >
        <input
          id="todo_input"
          type="text"
          placeholder="Add..."
          value={ipt}
          onChange={(e) => setIpt(e.target.value)}
          className=" w-full outline-0"
        />
        <button type="submit">
          <img src="send-horizontal.svg" alt="" className="invert opacity-70" />
        </button>
      </form>
    </div>
  );
}
