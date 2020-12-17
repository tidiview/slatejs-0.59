export const initialValue = JSON.parse(localStorage.getItem('slate-content')) ||  [
  {
    "type": "paragraph",
    "children": [
      {
        "text": "A "
      },
      {
        "text": "line of text",
        "bold": true
      },
      {
        "text": " in a "
      },
      {
        "type": "link",
        "url": "prout",
        "children": [
          {
            "text": "paragraph"
          }
        ]
      },
      {
        "text": "."
      }
    ]
  },
  {
    "children": [
      {
        "text": "Would this be working in japanese also?"
      }
    ]
  },
  {
    "children": [
      {
        "text": "日本語の"
      },
      {
        "type": "ruby",
        "rt": "かく",
        "children": [
          {
            "text": "確",
            "bold": true
          }
        ]
      },
      {
        "text": "",
        "bold": true
      },
      {
        "type": "ruby",
        "rt": "にん",
        "children": [
          {
            "text": "認",
            "bold": true
          }
        ]
      },
      {
        "text": "です。"
      },
      {
        "type": "ruby",
        "rt": "けっこう",
        "children": [
          {
            "text": "結構"
          }
        ]
      },
      {
        "text": "、綺麗ですかね。素晴らしいと言いましょう！"
      }
    ],
    "type": "paragraph"
  },
  {
    "type": "image",
    "url": "https://source.unsplash.com/kFrdX5IeQzI",
    "children": [
      {
        "text": ""
      }
    ]
  }
];
initialValue.displayName = 'initialValue';
/* 
export default initialValue; */