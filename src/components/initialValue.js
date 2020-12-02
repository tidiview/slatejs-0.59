const initialValue = [
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
  }
];
initialValue.displayName = 'initialValue';

export default initialValue;








/* const existingValue = JSON.parse(localStorage.getItem('content'))
const initialValue = Value.fromJSON(
  existingValue || {
    document: {
      nodes: [
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
      ],
    },
  }
)

class App extends React.Component {
  state = {
    value: initialValue,
  }

  onChange = ({ value }) => {
    // Check to see if the document has changed before saving.
    if (value.document != this.state.value.document) {
      const content = JSON.stringify(value.toJSON())
      localStorage.setItem('content', content)
    }

    this.setState({ value })
  }

  render() {
    return <Editor value={this.state.value} onChange={this.onChange} />
  }
} */