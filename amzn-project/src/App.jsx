import { useState } from "react";
import "./App.css";
import search from "./search";
// import { search } from "./search";

function App() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // search(query);
    console.log("dasda");
  };
  return (
    <div className="app">
      <div className="intro">
        <input
          onSubmit={handleSubmit}
          value={query}
          onCange={(e) => setQuery(e.target.value)}
          placeholder="What are you looking for?"
          type="search"
        />
      </div>
    </div>
  );
}

export default App;
