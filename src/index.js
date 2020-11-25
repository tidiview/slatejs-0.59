import React, { useCallback, useMemo, useState } from 'react';
import { render } from 'react-dom';
import isUrl from 'is-url';

import isHotkey from 'is-hotkey';
import { Editable, withReact, useSlate, Slate } from 'slate-react';
import { Editor, Transforms, createEditor, Range } from 'slate';
import { withHistory } from 'slate-history';
import { Button, Icon, Toolbar } from './components';

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+s': 'strikethrough',
  'mod+`': 'code'
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const MyEditor = () => {
  const [value, setValue] = useState(initialValue);
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(
    () => withLinks(withHistory(withReact(createEditor()))),
    []
  );

  return (
    <>
      <Slate editor={editor} value={value} onChange={value => setValue(value)}>
        <Toolbar>
          <LinkButton />
          <MarkButton format='bold' icon='format_bold' />
          <MarkButton format='italic' icon='format_italic' />
          <MarkButton format='underline' icon='format_underlined' />
          <MarkButton format='strikethrough' icon='strikethrough_s' />
          <MarkButton format='code' icon='code' />
          <BlockButton format='heading-one' icon='looks_one' />
          <BlockButton format='heading-two' icon='looks_two' />
          <BlockButton format='block-quote' icon='format_quote' />
          <BlockButton format='numbered-list' icon='format_list_numbered' />
          <BlockButton format='bulleted-list' icon='format_list_bulleted' />
        </Toolbar>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder='Enter some rich text…'
          autoFocus
          onKeyDown={event => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
              }
            }
          }}
        />
      </Slate>
      <hr></hr>
      <div>
        <p>context:</p>
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </div>
    </>
  );
};
MyEditor.displayName = 'MyEditor';

const withLinks = editor => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element);
  };

  editor.insertText = text => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = data => {
    const text = data.getData('text/plain');

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};
withLinks.displayName = 'withLinks';

const insertLink = (editor, url) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};
insertLink.displayName = 'insertLink';

const LinkButton = () => {
  const editor = useSlate();
  return (
    <Button
      active={isLinkActive(editor)}
      onMouseDown={event => {
        event.preventDefault();
        const url = window.prompt('Enter the URL of the link:');
        if (!url) return;
        insertLink(editor, url);
      }}
    >
      <Icon>link</Icon>
    </Button>
  );
};
LinkButton.displayName = 'LinkButton';

const isLinkActive = editor => {
  const [link] = Editor.nodes(editor, { match: n => n.type === 'link' });
  return !!link;
};
isLinkActive.displayName = 'isLinkActive';

const unwrapLink = editor => {
  Transforms.unwrapNodes(editor, { match: n => n.type === 'link' });
};
unwrapLink.displayName = 'unwrapLink';

const wrapLink = (editor, url) => {
  if (unwrapLink(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : []
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};
wrapLink.displayName = 'wrapLink';

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(n.type),
    split: true
  });

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};
toggleBlock.displayName = 'toggleBlock';

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
toggleMark.displayName = 'toggleMark';

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format
  });

  return !!match;
};
isBlockActive.displayName = 'isBlockActive';

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};
isMarkActive.displayName = 'isMarkActive';

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'link':
      return (
        <a {...attributes} href={element.url}>
          {children}
        </a>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};
Element.displayName = 'Element';

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.strikethrough) {
    children = <del>{children}</del>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  return <span {...attributes}>{children}</span>;
};
Leaf.displayName = 'Leaf';

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};
BlockButton.displayName = 'BlockButton';

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};
MarkButton.displayName = 'MarkButton';

const initialValue = [
  {
    type: "paragraph",
    children: [
      { text: "This is editable " },
      { text: "rich", bold: true },
      { text: " text, " },
      { text: "much", italic: true },
      { text: " better than a " },
      { text: "<textarea>", code: true },
      { text: "! " },
      { text: "isn't it?", strikethrough: true }
    ]
  },
  {
    type: "paragraph",
    children: [
      {
        text:
          "Since it's rich text, you can do things like turn a selection of text "
      },
      { text: 'bold', bold: true },
      {
        text:
          ", or add a semantically rendered block quote in the middle of the page, like this:"
      }
    ]
  },
  {
    type: 'block-quote',
    children: [{ text: "A wise quote." }]
  },
  {
    type: 'paragraph',
    children: [{ text: "Try it out for yourself!" }]
  }
];
initialValue.displayName = 'initialValue';

render(<MyEditor />, document.getElementById('root'));