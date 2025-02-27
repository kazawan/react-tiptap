import { createSuggestionsItems } from "@harshtalks/slash-tiptap";

const createSuggestions = (setIsLinkInputOpen,setIsTestOpen,) => createSuggestionsItems([
    {
        title: "# Heading 1",
        searchTerms: ["Heading"],
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setHeading({ level: 1 })
                .run();
        },
        
        
    },
    {
        title: "# Heading 2",
        searchTerms: ["Heading"],
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setHeading({ level: 2 })
                .run();
        }
    },
    {
        title: "# Heading 3",
        searchTerms: ["Heading"],
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setHeading({ level: 3 })
                .run();
        }
    },
    {
        title:"</> Code Block",
        searchTerms: ["CodeBlock"],
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setCodeBlock()
                .run();
        }
    },
    {
        title:"> Blockquote",
        searchTerms: ["Blockquote"],
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setBlockquote()
                .run();
        }
    },
    {
        title:"Bullet List",
        searchTerms: ["BulletList"],
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleBulletList()
                .run();
        }
    },
    {
        title:"Ordered List",
        searchTerms: ["OrderedList"],
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleOrderedList()
                .run();
        }
    },
    {
        title:"--- Horizontal Rule",
        searchTerms: ["HorizontalRule"],
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setHorizontalRule()
                .run();
        }
    },
    {
        title: "** Bold",
        searchTerms: ["bold"],
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleBold()
                .run();
        },
    },
    {
        title: "* Italic",
        searchTerms: ["italic"],
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleItalic()
                .run();
        },
    },
    {
        title:"Link",
        searchTerms: ["Link"],
        command: ({ editor, range }) => {
            // 只删除slash命令，不插入任何文本
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .run();
            
            // 打开输入框
            setIsLinkInputOpen(true);
        }
    },
    {
        title:"test",
        searchTerms: ["test"],
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .run();
            setIsTestOpen(true);
        },
    }

]);

export default createSuggestions;