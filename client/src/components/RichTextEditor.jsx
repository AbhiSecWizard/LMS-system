import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const RichTextEditor = ({ input, setInput }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  // 1. Initialize Quill Editor
  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Write something amazing...",
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          ["clean"],
        ],
      },
    });

    quillRef.current = quill;

    // Listen to changes inside the editor
    quill.on("text-change", () => {
      const html = quill.root.innerHTML;
      // Sirf tabhi update karein jab text sach me change hua ho, infinite loop se bachne ke liye
      setInput((prev) => {
        if (prev.description === html) return prev;
        return { ...prev, description: html };
      });
    });
  }, [setInput]);

  // 2. FIXED: Database se aane wale description data ko Editor me load karne ke liye
  useEffect(() => {
    if (quillRef.current && input.description !== undefined) {
      // Agar editor empty hai ya database data editor content se different hai, tabhi load karein
      if (quillRef.current.root.innerHTML !== input.description) {
        quillRef.current.clipboard.dangerouslyPasteHTML(input.description || "");
      }
    }
  }, [input.description]);

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div ref={editorRef} />
      </div>
    </div>
  );
};

export default RichTextEditor;