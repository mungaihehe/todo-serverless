import { FC, useRef, useState } from "react";
import { produce } from "immer";
import { Input } from "./Input";
import { TodoItem } from "../utils/TodoItem";
import { v4 } from "uuid";
import { UploadIcon } from "../icons/Upload";
import { Storage } from "aws-amplify";
interface AddTodoProps {
  onAdd: (todo: TodoItem) => any;
}

export const AddTodo: FC<AddTodoProps> = ({ onAdd }) => {
  const [file, setFile] = useState(undefined as undefined | File);
  const [item, setItem] = useState({
    title: "",
    content: "",
  });
  const hiddenFileInput = useRef<any>(null);
  const [uploading, setUploading] = useState(false);
  return (
    <div className="bg-slate-800 p-2 flex flex-col gap-2 items-center rounded-lg">
      <h2 className="font-bold font-lg text-slate-100 py-2">Add Todo</h2>
      <div className="w-full">
        <button
          onClick={() => {
            if (!hiddenFileInput.current) {
              alert("An unexpected error occurred");
              return;
            }
            hiddenFileInput.current.click();
          }}
          className={
            "text-slate-100 border-2 border-dashed border-slate-400 h-36 w-full bg-slate-600 flex flex-col gap-2 items-center justify-center rounded-lg"
          }
        >
          <UploadIcon className="h-10 w-10" />
          <p>{file ? file.name : "Choose an image"}</p>
        </button>
        <input
          type="file"
          style={{ display: "none" }}
          ref={hiddenFileInput}
          onChange={({ target: { files } }: any) => {
            setFile(files[0]);
          }}
        />
      </div>
      <Input
        type="text"
        value={item.title}
        placeholder="Enter title"
        onChange={({ target: { value } }: any) =>
          setItem(
            produce((draft) => {
              draft.title = value;
            })
          )
        }
      />
      <Input
        value={item.content}
        placeholder="Enter content"
        onChange={({ target: { value } }: any) =>
          setItem(
            produce((draft) => {
              draft.content = value;
            })
          )
        }
      />
      <button
        className="p-2 flex items-center justify-center bg-lime-500 rounded-md text-slate-100 w-full"
        disabled={uploading}
        onClick={async () => {
          //upload attachment
          if (!file) {
            alert("Upload an image to add a todo");
            return;
          }
          setUploading(true);
          const stored = await Storage.vault.put(`${v4()}-${file.name}`, file, {
            contentType: file.type,
          });
          setUploading(false);
          onAdd({
            todoId: v4(),
            attachment: stored.key,
            ...item,
            completed: false,
          });
        }}
      >
        {uploading ? "Uploading..." : "Add Todo"}
      </button>
    </div>
  );
};
