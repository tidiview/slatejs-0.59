/**
 * Keyboard shortcut related logic for the SlateEditor component
 */
import { isHotkey } from "is-hotkey";
import { toggleMark } from "./helpers";

export const HOTKEYS = {
  "ctrl+b": "bold",
  "mod+b": "bold",
  "ctrl+i": "italic",
  "mod+i": "italic",
  "ctrl+u": "underline",
  "mod+u": "underline",
  'ctrl+s': 'strikethrough',
  'mod+s': 'strikethrough',
  "ctrl+shift+enter": "code",
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
