import React, { useEffect } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

//when i try to import plugin it give me error of "ckeditor-duplicated-modules"

// import Font from "@ckeditor/ckeditor5-font/src/font";
// import SelectAll from "@ckeditor/ckeditor5-select-all/src/selectall";

export default function App() {
  useEffect(() => {}, []);
  return (
    <div className="App">
      <h2>Using CKEditor 5 build in React</h2>
      <CKEditor
        editor={ClassicEditor}
        data="<p>Hello from CKEditor 5!</p>"
        onInit={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log("Editor is ready to use!", editor);
          editor.execute("fontFamily");
          editor.execute("fontSize", { value: 10 });
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log({ event, editor, data });
        }}
        onBlur={(event, editor) => {
          console.log("Blur.", editor);
        }}
        onFocus={(event, editor) => {
          console.log("Focus.", editor);
        }}
        config={{
          // plugins: [Font],
          fontFamily: {
            options: [
              "default",
              "Ubuntu, Arial, sans-serif",
              "Ubuntu Mono, Courier New, Courier, monospace",
            ],
          },
          heading: {
            options: [
              {
                model: "paragraph",
                title: "Paragraph",
                class: "ck-heading_paragraph",
              },
              {
                model: "heading1",
                view: "h1",
                title: "Heading 1",
                class: "ck-heading_heading1",
              },
              {
                model: "heading2",
                view: "h2",
                title: "My heading",
                class: "ck-heading_heading2",
              },
              //   {
              //     model: "heading2",
              //     view: "h2",
              //     title: "Custom heading",
              //     class: "ck-heading_heading2",
              //   },
            ],
          },
          toolbar: [
            "heading",
            "|",
            "fontSize",
            "fontFamily",
            "bold",
            "italic",
            "blockQuote",
            "link",
            "numberedList",
            "bulletedList",
            "imageUpload",
            "insertTable",
            "tableColumn",
            "tableRow",
            "mergeTableCells",
            "mediaEmbed",
            "|",
            "undo",
            "redo",
          ],
        }}
      />
    </div>
  );
}
