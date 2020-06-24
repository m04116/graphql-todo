import React from 'react';

import { Navbar } from "./Components/Navbar";
import Todo from "./Components/Todo";

const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar  />
      <Todo />
    </div>
  );
}

export default App;
