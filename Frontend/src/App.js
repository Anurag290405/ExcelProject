import React from 'react';
import UploadExcel from './components/UploadExcel'; 

const App = () => {
  console.log("App component is rendering");

  return (
    <div>
      <h1>React App is Running!</h1>
      <UploadExcel />
    </div>
  );
};

export default App;
