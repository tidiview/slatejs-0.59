/**
 * Helper functions for the SlateEditor component.
 */
import { Editor, Transforms, Range } from 'slate';

export const LIST_TYPES = ['numbered-list', 'bulleted-list'];

/**
 * Checks whether a format block is active or not in the editor.
 * @param editor The current Slate editor
 * @param format The format block that is being checked
 */
export const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format
  });

  return !!match;
};
isBlockActive.displayName = 'isBlockActive';

/**
 * Toggles a format block to be on / off.
 * @param editor The current Slate editor
 * @param format The format block that is being checked
 */
export const toggleBlock = (editor, format) => {
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

/**
 * Checks whether a format mark is active or not in the editor.
 * @param editor The current Slate editor
 * @param format The format mark that is being checked
 */
export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};
isMarkActive.displayName = 'isMarkActive';

/**
 * Toggles a format mark to be on / off.
 * @param editor The current Slate editor
 * @param format The format mark that is being checked
 */
export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
toggleMark.displayName = 'toggleMark';

/**
 * Check whether the link button is active or not in the editor.
 * @param editor The current Slate editor
 */
export const isLinkActive = editor => {
  const [link] = Editor.nodes(editor, { match: n => n.type === 'link' });
  return !!link;
};
isLinkActive.displayName = 'isLinkActive';

/**
 * Unwraps a link node from the editor.
 * @param editor The current Slate editor
 */
export const unwrapLink = editor => {
  Transforms.unwrapNodes(editor, { match: n => n.type === 'link' });
};
unwrapLink.displayName = 'unwrapLink';

/**
 * Wraps a link node to the editor.
 * @param editor The current Slate editor
 * @param url The url to wrap into a node
 */
export const wrapLink = (editor, url) => {
  if (isLinkActive(editor)) {
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

/**
 * This will insert a link into the Slate editor.
 * @param editor The current Slate editor
 * @param url The url to insert
 */
export const insertLink = (editor, url) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};
insertLink.displayName = 'insertLink';

export const isFormatActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n[format] === true,
    mode: 'all',
  })
  return !!match
};
isFormatActive.displayName = 'isFormatActive';

//Ruby is inspired from Link above
/**
 * Check whether the ruby button is active or not in the editor.
 * @param editor The current Slate editor
 */
export const isRubyActive = editor => {
  const [rtstring] = Editor.nodes(editor, { match: n => n.type === 'ruby' });
  return !!rtstring;
};
isRubyActive.displayName = 'isRubyActive';

/**
 * Unwraps a ruby node from the editor.
 * @param editor The current Slate editor
 */
export const unwrapRuby = editor => {
  Transforms.unwrapNodes(editor, { match: n => n.type === 'ruby' });
};
unwrapRuby.displayName = 'unwrapRuby';

/**
 * Wraps a ruby node to the editor.
 * @param editor The current Slate editor
 * @param rt The rt to wrap into a node
 */
export const wrapRuby = (editor, rt) => {
  if (isRubyActive(editor)) {
    unwrapRuby(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const rtstring = {
    type: 'ruby',
    rt,
    children: isCollapsed ? [{ text: rt }] : []
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, rtstring);
  } else {
    Transforms.wrapNodes(editor, rtstring, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};
wrapRuby.displayName = 'wrapRuby';

/**
 * This will insert a ruby into the Slate editor.
 * @param editor The current Slate editor
 * @param rt The rt to insert
 */
export const insertRuby = (editor, rt) => {
  if (editor.selection) {
    wrapRuby(editor, rt);
  }
};
insertRuby.displayName = 'insertRuby';

/**
 * This will insert an image into the Slate editor.
 * @param editor The current Slate editor
 * @param url The url to insert
 */
export const insertImage = (editor, url) => {
  const text = { text: '' }
  const image = { type: 'image', url, children: [text] }
  Transforms.insertNodes(editor, image)
}
insertImage.displayName = 'insertImage';