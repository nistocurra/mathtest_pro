// src/utils/web3Utils.js

/**
 * Utility functions for handling Web3 provider conflicts
 * Resolves the "Cannot set property ethereum" error
 */

/**
 * Safely detect and handle ethereum provider conflicts
 * @returns {Object|null} The ethereum provider or null if not available
 */
export const detectEthereumProvider = () => {
  try {
    // Check if ethereum is already defined as a getter-only property
    const descriptor = Object.getOwnPropertyDescriptor(window, 'ethereum');
    
    if (descriptor && descriptor.get && !descriptor.set) {
      // Ethereum is defined as getter-only, try to access it safely
      return window.ethereum;
    }
    
    // Check for common provider names
    const providers = [
      'ethereum',
      'web3',
      'metaMask',
      '__METAMASK__'
    ];
    
    for (const provider of providers) {
      if (window[provider]) {
        return window[provider];
      }
    }
    
    return null;
  } catch (error) {
    console.warn('Error detecting ethereum provider:', error);
    return null;
  }
};

/**
 * Initialize Web3 provider with conflict resolution
 * @returns {Promise<Object|null>} The initialized provider or null
 */
export const initializeWeb3Provider = async () => {
  try {
    // Wait for potential provider injection
    await new Promise(resolve => {
      if (typeof window.ethereum !== 'undefined') {
        resolve();
      } else {
        // Wait up to 3 seconds for provider injection
        let attempts = 0;
        const maxAttempts = 30;
        const checkInterval = setInterval(() => {
          attempts++;
          if (typeof window.ethereum !== 'undefined' || attempts >= maxAttempts) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      }
    });
    
    const provider = detectEthereumProvider();
    
    if (provider) {
      console.log('Web3 provider detected successfully');
      return provider;
    }
    
    console.log('No Web3 provider detected');
    return null;
  } catch (error) {
    console.error('Error initializing Web3 provider:', error);
    return null;
  }
};

/**
 * Handle ethereum provider conflicts by creating a safe accessor
 */
export const resolveEthereumConflict = () => {
  try {
    // Check if there's already a conflict
    const descriptor = Object.getOwnPropertyDescriptor(window, 'ethereum');
    
    if (descriptor && descriptor.get && !descriptor.set) {
      // Already a getter-only property, no need to modify
      return true;
    }
    
    // Store any existing ethereum object
    const existingEthereum = window.ethereum;
    
    // Remove the existing property if it exists
    delete window.ethereum;
    
    // Define a getter that returns the provider safely
    Object.defineProperty(window, 'ethereum', {
      get: () => {
        return existingEthereum || detectEthereumProvider();
      },
      configurable: false,
      enumerable: true
    });
    
    return true;
  } catch (error) {
    console.error('Error resolving ethereum conflict:', error);
    return false;
  }
};

/**
 * Check if Web3 is available
 * @returns {boolean} True if Web3 is available
 */
export const isWeb3Available = () => {
  try {
    return detectEthereumProvider() !== null;
  } catch (error) {
    console.error('Error checking Web3 availability:', error);
    return false;
  }
};

/**
 * Get Web3 provider with error handling
 * @returns {Object|null} The Web3 provider or null
 */
export const getWeb3Provider = () => {
  try {
    const provider = detectEthereumProvider();
    
    if (!provider) {
      console.warn('No Web3 provider found. Please install MetaMask or another Web3 wallet.');
      return null;
    }
    
    return provider;
  } catch (error) {
    console.error('Error getting Web3 provider:', error);
    return null;
  }
};
export { resolveEthereumConflict };