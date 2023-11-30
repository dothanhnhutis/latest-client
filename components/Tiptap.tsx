import { EditorContent, Editor } from "@tiptap/react";
import ToolBar from "./ToolBar";
import { Skeleton } from "./ui/skeleton";

const Tiptap = ({ editor }: { editor: Editor | null }) => {
  return (
    <div className="p-4 border rounded-lg">
      <ToolBar editor={editor} />
      {editor ? (
        <EditorContent
          spellCheck={false}
          editor={editor}
          className="p-4 border rounded-lg w-full min-h-[300px] max-h-[650px] overflow-y-scroll focus-visible:outline-0 focus-visible:ring-transparent"
        />
      ) : (
        <Skeleton className="rounded-lg w-full h-[300px]" />
      )}
    </div>
  );
};
export default Tiptap;
