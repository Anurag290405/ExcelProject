import React, { useState } from 'react';
import axios from 'axios';

const UploadExcel = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setMessage(response.data); // Success message from the backend
      } else {
        setMessage('Failed to upload the file.');
      }
    } catch (error) {
      console.error('Error during file upload:', error);
      setMessage('An error occurred while uploading the file.');
    }
  };

  return (
    <div>
      <h1>Upload Excel File</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadExcel;
