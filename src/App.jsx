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
import ImageResize from 'tiptap-extension-resize-image';


import { Slash, SlashCmdProvider, enableKeyboardNavigation, SlashCmd } from '@harshtalks/slash-tiptap';


import createSuggestions from './suggestion/items'
import { useCallback, useEffect, useState } from "react";

// link 输入框

import LinkInput from './linkinput/LinkInput';

// image upload
import UploadImage from './uploadImage/uploadImage';




const mockContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: {
        level: 1,
      },
      content: [
        {
          type: 'text',
          text: 'Welcome to the kazawan editor',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'yeahyeahyeah',
        },
      ],
    },
  ],
};


export default function App() {
  const [isLinkInputOpen, setIsLinkInputOpen] = useState(false);
  const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);
  const suggestions = createSuggestions(setIsLinkInputOpen, setIsUploadImageOpen);
  const [contentJson, setContentJson] = useState({
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: {
          level: 1,
        },
        content: [
          {
            type: 'text',
            text: 'Welcome to the editor',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'This is a basic example of the editor',
          },
        ],
      },
    ],
  })

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
    content: `...`,
    editable: true,
    onUpdate: ({ editor }) => {
      setContentJson({...editor.getJSON()});
    }
  });

  function updateContent() {
      const content = mockContent;
      editor.commands.setContent(content);
      setContentJson({...content});  
  }

  function saveContent() {
    console.log(contentJson);
  } 

  useEffect(() => { 
    if(editor) {
      editor.commands.setContent(contentJson);
    }
  }, [editor, contentJson]);



  return (
    
    <div className="App">
    <div>
      <button onClick={()=>updateContent()} >update</button>
    </div>
    <div>
      <button onClick={()=>saveContent()}>save</button>
    </div>
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
