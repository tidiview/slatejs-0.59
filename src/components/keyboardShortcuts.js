/**
 * Keyboard shortcut related logic for the SlateEditor component
 */
import { isHotkey } from "is-hotkey";
import { toggleMark } from "./helpers";

export const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  'mod+s': 'strikethrough',
  "mod+shift+enter": "code"
};

export const toggleKeyboardShortcut = (event, editor) => {
  for (const hotkey in HOTKEYS) {
    if (isHotkey(hotkey, event)) {
      event.preventDefault();
      const mark = HOTKEYS[hotkey];
      toggleMark(editor, mark);
    }
  }
};
