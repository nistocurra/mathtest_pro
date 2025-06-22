import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";
import { setupGlobalErrorHandlers } from "./utils/errorHandler";
import { resolveEthereumConflict as resolveWeb3Conflict } from "./utils/web3Utils";

// Set up global error handlers before app initialization
setupGlobalErrorHandlers();

// Try to resolve ethereum conflicts early
try {
  resolveWeb3Conflict();
} catch (error) {
  console.warn('Could not resolve Web3 conflicts during initialization:', error);
}

const container = document.getElementById("root");
const root = createRoot(container);

// Wrap app rendering in try-catch for ethereum-related errors
try {
  root.render(<App />);
} catch (error) {
  console.error('Error rendering app:', error);
  
  // If it's an ethereum error, try to resolve and retry
  if (error?.message?.includes('ethereum')) {
    try {
      resolveWeb3Conflict();
      // Retry rendering after a short delay
      setTimeout(() => {
        root.render(<App />);
      }, 100);
    } catch (retryError) {
      console.error('Failed to resolve and retry:', retryError);
      // Fallback: render a basic error message
      root.render(
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-medium text-neutral-800 mb-4">Loading Error</h1>
            <p className="text-neutral-600 mb-4">There was an issue loading the application.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
  }
}