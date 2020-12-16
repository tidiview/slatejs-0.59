/* eslint-disable no-param-reassign */
import isUrl from 'is-url';
import { wrapLink, wrapRuby } from './helpers';
/* import { Editor, Element } from 'slate'; */

export function withLinks(editor) {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) => {
    return element.type === 'link' ? true : isInline(element);
  };

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
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


// withRuby is inspired from withLinks

export function withRuby(editor) {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) => {
    return element.type === 'ruby' ? true : isInline(element);
  };

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapRuby(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');

    if (text && isUrl(text)) {
      wrapRuby(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};
withRuby.displayName = 'withRuby';