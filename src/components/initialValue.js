const existingValue = JSON.parse(localStorage.getItem('content'));
existingValue.displayName = 'existingValue';

const initialValue = existingValue || [
  {
    type: "paragraph",
    children: [
      { text: "This is editable " },
      { text: "rich", bold: true },
      { text: " text, " },
      { text: "much", italic: true },
      { text: " better than a " },
      { text: "<textarea>", code: true },
      { text: "! " },
      { text: "isn't it?", strikethrough: true }
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
  },
  {
    type: "paragraph",
    children: [
      {
        "text": "日本語の"
      },
      {
        "type": "ruby",
        "rt": "かく",
        "children": [
          {
            "text": "確",
          }
        ]
      },
      {
        "text": ""
      },
      {
        "type": "ruby",
        "rt": "にん",
        "children": [
          {
            "text": "認",
          }
        ]
      },
      {
        "text": "です。結構、綺麗ですかね。綺麗ようですが。。。素晴らしいと言いましょう！"
      }
    ]
  }
];
initialValue.displayName = 'initialValue';

export default initialValue;