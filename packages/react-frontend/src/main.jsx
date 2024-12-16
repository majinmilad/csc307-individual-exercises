// src/main.jsx

import React from "react";
import ReactDOMClient from "react-dom/client";
import MyApp from "./MyApp";  // imported with no suffix because Vite will accept .jsx, .js. .ts or .tsx files for transpiling
import "./main.css";

const container = document.getElementById("root");

// Create a root
const root = ReactDOMClient.createRoot(container);

// Initial render:
root.render(<MyApp />);