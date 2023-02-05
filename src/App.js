import { useState } from "react";
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [imageSrc, setImageSrc] = useState(undefined);

  const updateFiles = (incommingFiles) => {
    console.log("incomming files", incommingFiles);
    setFiles(incommingFiles);
  };
  const onDelete = (id) => {
    setFiles(files.filter((x) => x.id !== id));
  };
  const handleSee = (imageSource) => {
    setImageSrc(imageSource);
  };
  const handleClean = (files) => {
    console.log("list cleaned", files);
  };

  return (
    <div className="App">
      <header className="App-header">
        <a
          className="App-link"
          href="/api/login"
          target="_blank"
          rel="noopener noreferrer"
        >
          Login to Imgur
        </a>

        <Dropzone
          style={{ minWidth: "550px" }}
          //view={"list"}
          onChange={updateFiles}
          minHeight="195px"
          onClean={handleClean}
          value={files}
          maxFiles={1}
          //header={false}
          // footer={false}
          maxFileSize={2998000}
          //label="Drag'n drop files here or click to browse"
          //label="Suleta tus archivos aquí"
          accept="image/*"
          // uploadingMessage={"Uploading..."}
          url="/api/upload"
          //of course this url doens´t work, is only to make upload button visible
          //uploadOnDrop
          //clickable={false}
          disableScroll
        >
          {files.length > 0 &&
            files.map((file) => (
              <FileItem
                {...file}
                key={file.id}
                onDelete={onDelete}
                onSee={handleSee}
                //localization={"ES-es"}
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
