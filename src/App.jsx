import './App.css'

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from '@tiptap/extension-heading';
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Youtube from '@tiptap/extension-youtube'
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlock from '@tiptap/extension-code-block';

import { Slash, SlashCmdProvider, enableKeyboardNavigation, SlashCmd } from '@harshtalks/slash-tiptap';
import createSuggestions from './suggestion/items'
import { useCallback, useState } from "react";
import ImageResize from 'tiptap-extension-resize-image';

// link 输入框

import LinkInput from './linkinput/LinkInput';

// image upload
import UploadImage from './uploadImage/uploadImage';







export default function App() {
  const [isLinkInputOpen, setIsLinkInputOpen] = useState(false);
  const [isUploadImageOpen, setIsUploadImageOpen] = useState(true);
  const suggestions = createSuggestions(setIsLinkInputOpen, setIsUploadImageOpen);

  const editor = useEditor({
    extensions: [StarterKit,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            switch (node.attrs.level) {
              case 1:
                return 'Heading 1';
              case 2:
                return 'Heading 2';
              case 3:
                return 'Heading 3';
              default:
                return 'Heading';
            }
          }
          if (node.type.name === 'bulletList') {
            return 'Bullet List';
          }
          if (node.type.name === 'orderedList') {
            return 'Ordered List';
          }
          if (node.type.name === 'taskList') {
            return 'Task List';
          }
          return 'Type / for commands';
        },
        showOnlyWhenEditable: true,

      }),
      Heading.configure({
        levels: [1, 2, 3],

      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Youtube.configure({
        width: 700,
      }),
      Bold,
      Italic.configure({
        HTMLAttributes: {
          class: "italic",
        },
      }),
      HorizontalRule,
      Slash.configure({
        suggestion: {
          items: () => suggestions,
        }
      }),
      Link.configure({
        HTMLAttributes: {
          class: "tiptap-Link",
        },
        openOnClick: true,
        protocols: ['http', 'https'],
        onModKEnter: () => {
          setIsLinkInputOpen(true);
          return true;
        },
      }),
      ImageResize.configure({
        
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: "tiptap-CodeBlock",
        },
      }),



    ],
    editorProps: {
      attributes: {
        class: "Editor",
      },
      handleDOMEvents: {
        keydown: (_, v) => enableKeyboardNavigation(v),
      },
    },
    content: `
      
    
      

    `,
    editable: true,
  });

  return (
    <div className="App">
      <SlashCmdProvider>
        <EditorContent editor={editor} />
        <LinkInput
          editor={editor}
          isOpen={isLinkInputOpen}
          setIsOpen={setIsLinkInputOpen}
        />
        <UploadImage
          editor={editor}
          isOpen={isUploadImageOpen}
          setIsOpen={setIsUploadImageOpen}
        />
        <SlashCmd.Root editor={editor}>
          <SlashCmd.Cmd>
            <SlashCmd.Empty>No commands available</SlashCmd.Empty>
            <SlashCmd.List>
              {suggestions.map((item) => {
                return (
                  <SlashCmd.Item
                    value={item.title}
                    onCommand={(val) => {
                      item.command(val);
                    }}
                    key={item.title}
                  >
                    <p>{item.title}</p>
                  </SlashCmd.Item>
                );
              })}
            </SlashCmd.List>
          </SlashCmd.Cmd>
        </SlashCmd.Root>
      </SlashCmdProvider>
    </div>
  );
}
