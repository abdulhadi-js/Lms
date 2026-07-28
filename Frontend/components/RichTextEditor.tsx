import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[150px] p-4 bg-white border border-divider rounded-b-lg border-t-0',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-1 p-2 border border-divider rounded-t-lg bg-surface-container-low">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-surface transition-colors ${editor.isActive('bold') ? 'bg-surface text-primary font-bold shadow-sm' : 'text-body-secondary'}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-surface transition-colors ${editor.isActive('italic') ? 'bg-surface text-primary shadow-sm' : 'text-body-secondary'}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-divider mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-surface transition-colors ${editor.isActive('bulletList') ? 'bg-surface text-primary shadow-sm' : 'text-body-secondary'}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-surface transition-colors ${editor.isActive('orderedList') ? 'bg-surface text-primary shadow-sm' : 'text-body-secondary'}`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
