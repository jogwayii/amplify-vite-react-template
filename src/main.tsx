import React from "react";
import ReactDOM from "react-dom/client";
import { generateClient } from "aws-amplify/api"
import type { Schema } from "../amplify/data/resource"

import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);
const client = generateClient<Schema>()

client.queries.chatroomAssign({
  name: "Amplify",
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
