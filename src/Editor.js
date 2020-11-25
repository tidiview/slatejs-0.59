// Import React dependencies.
import React, { useCallback, useMemo, useState } from "react";
// Import the Slate editor factory.
import { createEditor, Editor, Text, Transforms } from "slate";
// Import the Slate editor history.
import { withHistory } from "slate-history";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";

// Define our own custom set of helpers.
const CustomEditor = {
  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.bold === true,
      universal: true,
    })

    return !!match
  },

  isItalicMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.italic === true,
    })

    return !!match
  },

  isUnderlineMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.underline === true,
    })

    return !!match
  },

  isStrikethroughMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.strikethrough === true,
    })

    return !!match
  },

  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === 'code',
    })

    return !!match
  },

  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor)
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    )
  },

  toggleItalicMark(editor) {
    const isActive = CustomEditor.isItalicMarkActive(editor)
    Transforms.setNodes(
      editor,
      { italic: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    )
  },

  toggleUnderlineMark(editor) {
    const isActive = CustomEditor.isUnderlineMarkActive(editor)
    Transforms.setNodes(
      editor,
      { underline: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    )
  },

  toggleStrikethroughMark(editor) {
    const isActive = CustomEditor.isStrikethroughMarkActive(editor)
    Transforms.setNodes(
      editor,
      { strikethrough: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    )
  },

  toggleCodeBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor)
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'code' },
      { match: n => Editor.isBlock(editor, n) }
    )
  },
}

const App = () => {

  const editor = useMemo(() => withReact(createEditor()), []);

  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem('content')) || [
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]);

  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])

  return (
    // Add a toolbar with buttons that call the same methods.
    <Slate 
      editor={editor} 
      value={value} 
      onChange={value => {
        setValue(value)
        const content = JSON.stringify(value)
        localStorage.setItem('content', content)
        }}>
      <div>
        <button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleBoldMark(editor)
          }}
        >
          Bold
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleItalicMark(editor)
          }}
        >
          <em>Italic</em>
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleUnderlineMark(editor)
          }}
        >
          <u>Underline</u>
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleStrikethroughMark(editor)
          }}
        >
          <del>Strikethrough</del>
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleCodeBlock(editor)
          }}
        >
          <code>Code Block</code>
        </button>
        <hr></hr>
      </div>
      <Editable
        editor={editor}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        autoFocus
        onKeyDown={event => {
          if (!event.ctrlKey) {
            return
          }

          switch (event.key) {
            case 'b': {
              event.preventDefault()
              CustomEditor.toggleBoldMark(editor)
              break
            }

            case 'i': {
              event.preventDefault()
              CustomEditor.toggleItalicMark(editor)
              break
            }

            case 'u': {
              event.preventDefault()
              CustomEditor.toggleUnderlineMark(editor)
              break
            }

            case 's': {
              event.preventDefault()
              CustomEditor.toggleStrikethrough(editor)
              break
            }

            case '`': {
              event.preventDefault()
              CustomEditor.toggleCodeBlock(editor)
              break
            }
          }
        }}
      />
      <hr></hr>
      <div>
        <p>CONTEXT:</p>
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </div>
      <hr></hr>
    </Slate>

  )
}

const Leaf = props => {
  return (
    <span
      {...props.attributes}
      style={{ 
        fontWeight: props.leaf.bold ? 'bold' : 'normal',
        fontStyle: props.leaf.italic ? 'italic' : 'normal',
        textDecorationLine: props.leaf.underline ? (props.leaf.strikethrough ? 'underline line-through' : 'underline') : (props.leaf.strikethrough ? 'line-through' : 'normal') }
      }
    >
      {props.children}
    </span>
  )
}

// Define a React component renderer for our code blocks.
const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const DefaultElement = props => {
  return <p {...props.attributes}>{props.children}</p>
}

export default App;