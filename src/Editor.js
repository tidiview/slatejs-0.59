// Import React dependencies.
import React, { useMemo, useState } from "react";
// Import the Slate editor factory.
import { createEditor, Transforms } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";

const App = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }]
    }
  ]);

  return (
    // Add the editable component inside the context.
    <Slate
      editor={editor}
      value={value}
      onChange={(value) => {
        console.log(value);
        setValue(value);
      }}
    >
      <Editable
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            Transforms.insertText(editor, `\n`);
            // add a white sapce
            // Transforms.insertText(editor, `\n\u2060`);
          }
        }}
      />
    </Slate>
  );
};

export default App;
