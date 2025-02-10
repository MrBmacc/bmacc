import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const extensions = [
  StarterKit,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-blue-500 hover:underline cursor-pointer",
    },
  }),
];

interface TipTapProps {
  content: string;
  onChange?: (content: string) => void;
  id?: string;
  placeholder?: string;
  required?: boolean;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b p-1">
      <Button
        variant="ghost"
        size="sm"
        type="button"
        className="h-8 w-8 p-0"
        onClick={() => {
          const url = window.prompt("Enter URL");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        data-active={editor.isActive("link")}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        type="button"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().toggleBold().run()}
        data-active={editor.isActive("bold")}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        type="button"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        data-active={editor.isActive("italic")}
      >
        <Italic className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const TipTap = ({
  content,
  onChange,
  id,
  placeholder,
  required,
}: TipTapProps) => {
  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        ...(required ? { required: "required" } : {}),
        style: "outline: none;",
        class: cn("rounded-[inherit] flex-1 w-full h-full "),
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const isEmpty = editor?.isEmpty ?? true;

  return (
    <div className="relative min-h-[100px] w-full rounded-md border border-input bg-transparent text-sm shadow-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring">
      <MenuBar editor={editor} />
      <div className="px-3 py-2">
        {editor && (
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 100, placement: "bottom" }}
          >
            <div className="flex items-center gap-1 rounded-md border bg-white p-1 shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="h-8 w-8 p-0"
                onClick={() => editor.chain().focus().toggleBold().run()}
                data-active={editor.isActive("bold")}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="h-8 w-8 p-0"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                data-active={editor.isActive("italic")}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="h-8 w-8 p-0"
                onClick={() => {
                  const url = window.prompt("Enter URL");
                  if (url) {
                    editor.chain().focus().setLink({ href: url }).run();
                  }
                }}
                data-active={editor.isActive("link")}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="h-8 w-8 p-0"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                data-active={editor.isActive("bulletList")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="h-8 w-8 p-0"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                data-active={editor.isActive("orderedList")}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>
          </BubbleMenu>
        )}
        <EditorContent
          editor={editor}
          aria-description="Editor content"
          className="focus:outline-none [&_p]:m-0 [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:focus:border-none"
        />
        {isEmpty && placeholder && (
          <div className="absolute top-[42px] left-3 text-muted-foreground pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};
