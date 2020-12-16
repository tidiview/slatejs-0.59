/* eslint-disable no-param-reassign */
import isUrl from 'is-url';
import imageExtensions from 'image-extensions'
import { wrapLink, wrapRuby, insertImage } from './helpers';
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

export function withImages(editor) {
  const { insertData, isVoid } = editor

  editor.isVoid = element => {
    return element.type === 'image' ? true : isVoid(element)
  }

  editor.insertData = data => {
    const text = data.getData('text/plain')
    const { files } = data

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader()
        const [mime] = file.type.split('/')

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result
            insertImage(editor, url)
          })

          reader.readAsDataURL(file)
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}
withImages.displayName= 'withImages'

const isImageUrl = url => {
  if (!url) return false
  if (!isUrl(url)) return false
  const ext = new URL(url).pathname.split('.').pop()
  return imageExtensions.includes(ext)
}
isImageUrl.displayName= 'isImageUrl'