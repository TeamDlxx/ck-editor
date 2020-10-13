import React, { useEffect } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
export default function App() {
  function MyCustomUploadAdapterPlugin(editor) {
    console.log("adapter");
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      console.log(loader, "loader");
      return new MyUploadAdapter(loader);
    };
  }

  class MyUploadAdapter {
    constructor(props) {
      // CKEditor 5's FileLoader instance.
      this.loader = props;
      console.log(props, "props");
      // URL where to send files.
      this.url = `http://35.172.208.95:4310/blog/upload_s3_file`;
    }

    // Starts the upload process.
    upload() {
      return new Promise((resolve, reject) => {
        this._initRequest();
        this._initListeners(resolve, reject);
        this._sendRequest();
      });
    }

    // Aborts the upload process.
    abort() {
      if (this.xhr) {
        this.xhr.abort();
      }
    }

    // Example implementation using XMLHttpRequest.
    _initRequest() {
      const xhr = (this.xhr = new XMLHttpRequest());

      xhr.open("POST", this.url, true);
      xhr.responseType = "json";
      // xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      // xhr.setRequestHeader("Authorization", "getToken()");
    }

    // Initializes XMLHttpRequest listeners.
    _initListeners(resolve, reject) {
      const xhr = this.xhr;
      const loader = this.loader;
      console.log(loader, "LOADER");
      const genericErrorText =
        "Couldn't upload file:" + ` ${loader.file.name}.`;

      xhr.addEventListener("error", () => reject(genericErrorText));
      xhr.addEventListener("abort", () => reject());
      xhr.addEventListener("load", () => {
        console.log(xhr, genericErrorText, "T");
        const response = xhr.response;
        if (!response || response.error) {
          return reject(
            response && response.error
              ? response.error.message
              : genericErrorText
          );
        }

        // If the upload is successful, resolve the upload promise with an object containing
        // at least the "default" URL, pointing to the image on the server.
        resolve({
          default: "http://35.172.208.95:4310/media/" + response.file_url,
        });
      });

      if (xhr.upload) {
        xhr.upload.addEventListener("progress", (evt) => {
          if (evt.lengthComputable) {
            loader.uploadTotal = evt.total;
            loader.uploaded = evt.loaded;
          }
        });
      }
    }

    // Prepares the data and sends the request.
    _sendRequest() {
      const data = new FormData();
      this.loader.file.then((result) => {
        console.log(result, "Result");
        data.append("upload_file", result);
        console.log(...data, "data");
        this.xhr.send(data);
      });
    }
  }

  // useEffect(() => {
  //   DecoupledEditor.create(document.querySelector("#editor"))
  //     .then((editor) => {
  //       // The toolbar needs to be explicitly appended.
  //       editor.config = {
  //         extraPlugins: [MyCustomUploadAdapterPlugin],
  //       };
  //       document
  //         .querySelector("#toolbar-container")
  //         .appendChild(editor.ui.view.toolbar.element);

  //       window.editor = editor;
  //     })
  //     .catch((error) => {
  //       console.error("There was a problem initializing the editor.", error);
  //     });
  // }, []);

  useEffect(() => {}, []);
  return (
    // <div className="App">
    //   <h1
    //     onClick={() => console.log(document.querySelector("#editor").innerHTML)}
    //   >
    //     Hello CodeSandbox
    //   </h1>
    //   <div id="toolbar-container"></div>
    //   <div id="editor">
    //     <p>This is the editor content.</p>
    //   </div>

    // </div>
    <div className="App">
      <h2>Using CKEditor 5 build in React</h2>
      <CKEditor
        editor={ClassicEditor}
        data="<p>Hello from CKEditor 5!</p>"
        onInit={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log("Editor is ready to use!", editor);
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
      />
    </div>
  );
}
