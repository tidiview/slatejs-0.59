/**
 * Toolbar elements that modify the look and formatting
 * of the text in the SlateEditor component.
 */
import React from 'react';
import { ImageElement } from './components';

export const Element = props => { 
  const { attributes, children, element } = props 
  
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>;
    case 'heading-four':
      return <h4 {...attributes}>{children}</h4>;
    case 'heading-five':
      return <h5 {...attributes}>{children}</h5>;
    case 'heading-six':
      return <h6 {...attributes}>{children}</h6>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'sup':
      return <sup {...attributes}>{children}</sup>;
    case 'link':
      return (
        <a {...attributes} href={element.url}>
          {children}
        </a>
      );
    case 'ruby':
      return (
        <ruby {...attributes}>
          {children}<rp>（</rp><rt>{element.rt}</rt><rp>）</rp>
        </ruby>
      );
    case 'image':
      return <ImageElement {...props} />
    case 'code':
      return (
        <pre>
          <code {...attributes}>{children}</code>
        </pre>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};
Element.displayName = 'Element';

export function Leaf({ attributes, children, leaf }) {
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

  if (leaf.sup) {
    children = <sup>{children}</sup>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  return <span {...attributes}>{children}</span>;
};
Leaf.displayName = 'Leaf';
