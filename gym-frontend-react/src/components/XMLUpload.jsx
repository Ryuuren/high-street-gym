import { useRef, useState } from "react";
import { API_URL } from "../api/api";

export function XMLUpload({ onUploadSuccess }) {
  const [statusMessage, setStatusMessage] = useState("");

  // useRef is the react way of getting an element reference like below:
  // const uploadInput = document.getElementById("file-input")
  const uploadInputRef = useRef(null);

  function uploadFile(e) {
    e.preventDefault();
    setStatusMessage("Not yet implemented");

    // Files is an array because the user could select multiple files
    // we choose to upload only the first selected file in this case.
    const file = uploadInputRef.current.files[0];
    // Fetch expects multi-part form data to be provided
    // inside a FormData object.
    const formData = new FormData();
    formData.append("xml-file", file);

    if (file.name === "activity-upload.xml") {
      fetch(API_URL + "/upload-xml-activities", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((APIResponse) => {
          setStatusMessage(APIResponse.message);
          // clear the selected file
          uploadInputRef.current.value = null;
          // Notify of successful upload
          if (typeof onUploadSuccess === "function") {
            onUploadSuccess();
          }
        })
        .catch((error) => {
          setStatusMessage("Upload failed - " + error);
        });
    } else if (file.name === "room-upload.xml") {
      fetch(API_URL + "/upload-xml-rooms", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((APIResponse) => {
          setStatusMessage(APIResponse.message);
          // clear the selected file
          uploadInputRef.current.value = null;
          // Notify of successful upload
          if (typeof onUploadSuccess === "function") {
            onUploadSuccess();
          }
        })
        .catch((error) => {
          setStatusMessage("Upload failed - " + error);
        });
    }
  }

  return (
    <div>
      <form className="flex-grow mt-4 max-w-2xl" onSubmit={uploadFile}>
        <div className="form-control">
          <label className="label " htmlFor="xml_import">
            XML File Import
          </label>
          <div className="flex gap-2">
            <input
              ref={uploadInputRef}
              type="file"
              className="file-input file-input-bordered file-input-info w-80"
              id="xml_import"
            />
            <button className="btn btn-outline btn-info mr-2">Upload</button>
          </div>
          <label className="label">
            <span className="label-text-alt">{statusMessage}</span>
          </label>
        </div>
      </form>
    </div>
  );
}
