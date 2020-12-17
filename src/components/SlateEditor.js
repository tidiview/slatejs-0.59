import React, { useCallback, useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { cx, css } from '@emotion/css';
import { withLinks, withRuby, withImages, withHtml } from './plugins';
import { BlockButton, HoveringToolbar, MarkButton, LinkButton, RubyButton, ImageButton, Toolbar } from './components';
import { toggleKeyboardShortcut } from './keyboardShortcuts';
import { Element, Leaf } from './toolbarElements';
import { initialValue } from './initialValue';

function SlateEditor({ editorTitle, ...props }) {

  // Keep track of state for the value of the editor.
  const [value, setValue] = useState(initialValue);
  // Use type any for now. Initial state for an app would be the data passed to the component.

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  // Create a Slate editor object that won't change across renders.
  const editor = useMemo(
    () => withHtml(withImages(withRuby(withLinks(withReact(withHistory(createEditor())))))),
    []
  );

  return (
    <div>
      <h4>{editorTitle}</h4>
      <Slate editor={editor} value={value} onChange={newValue => {
        if(newValue !== value) {
          // document actually changed
          localStorage.setItem('slate-content', JSON.stringify(newValue))
        }
        setValue(newValue) /* onChange={value => setValue(value)} */
      }} {...props}>
      <HoveringToolbar />
        <div
          className={cx(css`
            border: 1px solid #ccc;
            background: white;
          `)}>
          <Toolbar>
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
            <LinkButton />
            <RubyButton />
            <ImageButton />
          </Toolbar>
          <Editable
            autoFocus
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder='Enter some rich text…'
            onKeyDown={event => {
              toggleKeyboardShortcut(event, editor);
            }}
            className={cx(css`
              padding: 0 16px;
            `)}
          />
        </div>
      </Slate>
      <div>
        <p>{/* <a id='publish-anchor' download='value.json' prout={handleSaveToPC(value)}>publish</a> |  */}context:</p>
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </div>
    </div>
  );
}
SlateEditor.displayName = 'SlateEditor';

export default SlateEditor;

/* 
const handleSaveToPC = jsonData => {
  const fileData = JSON.stringify(jsonData);
  const blob = new Blob([fileData], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'value.json';
  link.href = url;
  link.click();
} */