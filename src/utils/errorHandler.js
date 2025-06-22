// src/utils/errorHandler.js

/**
 * Error handling utilities for browser extension conflicts
 */

/**
 * Check if error is related to ethereum provider conflicts
 * @param {Error} error - The error object
 * @returns {boolean} True if it's an ethereum-related error
 */
export const isEthereumProviderError = (error) => {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorStack = error?.stack?.toLowerCase() || '';
  
  const ethereumErrorPatterns = [
    'cannot set property ethereum',
    'ethereum of #<window> which has only a getter',
    'pageprovider.js',
    'metamask',
    'web3 provider'
  ];
  
  return ethereumErrorPatterns.some(pattern => 
    errorMessage.includes(pattern) || errorStack.includes(pattern)
  );
};

/**
 * Handle ethereum provider errors gracefully
 * @param {Error} error - The error object
 * @returns {Object} Error handling result
 */
export const handleEthereumProviderError = (error) => {
  console.warn('Ethereum provider conflict detected:', error.message);
  
  try {
    // Try to resolve the conflict
    const { resolveEthereumConflict } = require('./web3Utils');
    const resolved = resolveEthereumConflict();
    
    return {
      handled: true,
      resolved: resolved,
      message: resolved 
        ? 'Ethereum provider conflict resolved successfully' :'Unable to resolve ethereum provider conflict',
      shouldReload: !resolved
    };
  } catch (resolveError) {
    console.error('Error while resolving ethereum conflict:', resolveError);
    return {
      handled: true,
      resolved: false,
      message: 'Failed to resolve ethereum provider conflict',
      shouldReload: true
    };
  }
};

/**
 * Global error handler for unhandled promise rejections
 */
export const setupGlobalErrorHandlers = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    
    if (isEthereumProviderError(error)) {
      event.preventDefault(); // Prevent default error handling
      const result = handleEthereumProviderError(error);
      
      if (result.shouldReload) {
        console.log('Reloading page to resolve ethereum provider conflict...');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  });
  
  // Handle general errors
  window.addEventListener('error', (event) => {
    const error = event.error;
    
    if (isEthereumProviderError(error)) {
      event.preventDefault(); // Prevent default error handling
      const result = handleEthereumProviderError(error);
      
      if (result.shouldReload) {
        console.log('Reloading page to resolve ethereum provider conflict...');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  });
};

/**
 * Create a user-friendly error message for ethereum conflicts
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const getEthereumErrorMessage = (error) => {
  if (isEthereumProviderError(error)) {
    return 'There appears to be a conflict with browser extensions (likely a crypto wallet). Please try refreshing the page or temporarily disabling wallet extensions.';
  }
  
  return error?.message || 'An unexpected error occurred';
};