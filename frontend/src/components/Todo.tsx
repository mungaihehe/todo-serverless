import { FC, useEffect, useState } from "react";
import { TodoItem } from "../utils/TodoItem";
import { produce } from "immer";
import { Storage } from "aws-amplify";
interface TodoProps {
  item: TodoItem;
  onChange: (item: TodoItem) => any;
  onDelete: () => any;
}

export const Todo: FC<TodoProps> = ({ item, onChange, onDelete }) => {
  const [loadingImage, setLoadingImage] = useState(true);
  const [attachment, setAttachment] = useState("");
  useEffect(() => {
    loadImage();
  }, []);
  async function loadImage() {
    try {
      setAttachment(await Storage.vault.get(item.attachment));
    } catch (error: any) {
      console.error(error);
    }
    setLoadingImage(false);
  }
  return (
    <div className="bg-slate-700 p-2 border-2 border-slate-500 rounded-lg my-2">
      <h3 className="text-slate-100 font-bold">{item.title}</h3>
      <p className="text-slate-300">{item.content}</p>
      <div className={"py-2"}>
        {loadingImage ? (
          <p className={"w-full h-10 flex items-center justify-center"}>
            Loading image...
          </p>
        ) : (
          <img
            src={attachment}
            alt={item.title + " image"}
            style={{ objectFit: "contain" }}
            className="rounded-md"
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          className="p-2 flex items-center justify-center bg-lime-500 rounded-md"
          onClick={() => {
            onChange(
              produce(item, (draft) => {
                draft.completed = !draft.completed;
              })
            );
          }}
        >
          {item.completed ? "Mark Un-complete" : "Mark Complete"}
        </button>
        <button
          className="p-2 flex items-center justify-center border-red-500 text-red-500 border-2 rounded-md"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
