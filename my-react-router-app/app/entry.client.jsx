import React from "react";
import ReactDOM from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import "./app.css";

console.log("✅ entry.client.jsx loaded on browser!");

ReactDOM.hydrateRoot(document, <HydratedRouter />);
