import { useState } from "react";
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";
import "./App.css";

function App() {
  const [files, setFiles] = useState([]);
  const [imageSrc, setImageSrc] = useState(undefined);

  const updateFiles = (incomingFiles) => {
    setFiles(incomingFiles);
  };
  const onDelete = (id) => {
    setFiles(files.filter((x) => x.id !== id));
  };
  const handleSee = (imageSource) => {
    setImageSrc(imageSource);
  };
  const handleClean = (files) => {
    setFiles([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <a className="App-link" href="/api/login">
          Login to Imgur
        </a>

        <Dropzone
          style={{ minWidth: "550px" }}
          onChange={updateFiles}
          minHeight="195px"
          onClean={handleClean}
          value={files}
          maxFiles={1}
          maxFileSize={2998000}
          accept="image/*"
          url="/api/upload"
          disableScroll
        >
          {files.length > 0 &&
            files.map((file) => (
              <FileItem
                {...file}
                key={file.id}
                onDelete={onDelete}
                onSee={handleSee}
                resultOnTooltip
                preview
                info
                hd
              />
            ))}
        </Dropzone>
        <FullScreenPreview
          imgSource={imageSrc}
          openImage={imageSrc}
          onClose={(e) => handleSee(undefined)}
        />
      </header>
    </div>
  );
}

export default App;
