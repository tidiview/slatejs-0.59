import React, { useCallback, useMemo, useState } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { css, cx } from "emotion";
import { withLinks } from "./plugins";
import { BlockButton, LinkButton, MarkButton, Toolbar } from "./components";
import { toggleKeyboardShortcut } from "./keyboardShortcuts";
import { Element, Leaf } from "./toolbarElements";

function SlateEditor({ editorTitle, ...props }) {
  // Create a Slate editor object that won't change across renders.
  const editor = useMemo(
    () => withLinks(withHistory(withReact(createEditor()))),
    []
  );

  // Keep track of state for the value of the editor.
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [
        { text: "This is editable " },
        { text: "rich", bold: true },
        { text: " text, " },
        { text: "much", italic: true },
        { text: " better" },
        { text: "!" }
      ]
    },
    {
      type: "paragraph",
      children: [
        {
          text:
            "Since it's rich text, you can do things like turn a selection of text "
        },
        { text: "bold", bold: true },
        {
          text:
            ", or add a semantically rendered block quote in the middle of the page, like this:"
        }
      ]
    },
    {
      type: "block-quote",
      children: [{ text: "A wise quote." }]
    },
    {
      type: "paragraph",
      children: [{ text: "Try it out for yourself!" }]
    }
  ]); // Use type any for now. Initial state for an app would be the data passed to the component.

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  return (
    <div>
      <h4>{editorTitle}</h4>
      <Slate editor={editor} value={value} onChange={value => setValue(value)}>
        <div
          className={cx(css`
            border: 1px solid #ccc;
          `)}
        >
          <Toolbar>
            <MarkButton format="bold" icon="format_bold" />
            <MarkButton format="italic" icon="format_italic" />
            <MarkButton format="underline" icon="format_underlined" />
            <MarkButton format='strikethrough' icon='strikethrough_s' />
            <MarkButton format="code" icon="code" />
            <BlockButton format="heading-one" icon="looks_one" />
            <BlockButton format="heading-two" icon="looks_two" />
            <BlockButton format="block-quote" icon="format_quote" />
            <BlockButton format="numbered-list" icon="format_list_numbered" />
            <BlockButton format="bulleted-list" icon="format_list_bulleted" />
            <LinkButton />
          </Toolbar>
          <Editable
            className={cx(css`
              min-height: 400px;
              padding: 0 16px;
            `)}
            onKeyDown={event => {
              if (event.key === "&") {
                // Prevent the ampersand character from being inserted.
                event.preventDefault();
                // Execute a command to insert text when the event occurs.
                editor.exec({ type: "insert_text", text: "and" });
              }
              toggleKeyboardShortcut(event, editor);
            }}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
          />
        </div>
      </Slate>
      <hr></hr>
      <div>
        <p>context:</p>
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </div>
    </div>
  );
}
SlateEditor.displayName = 'SlateEditor';

export default SlateEditor;
