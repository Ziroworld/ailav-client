import { useState, useEffect } from 'react';

export const useWebAuthn = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Check if WebAuthn is supported
    const checkSupport = async () => {
      if (window.PublicKeyCredential) {
        try {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setIsSupported(available);
        } catch (error) {
          console.warn('WebAuthn support check failed:', error);
          setIsSupported(false);
        }
      } else {
        setIsSupported(false);
      }
    };

    checkSupport();
  }, []);

  const register = async (userId) => {
    setIsRegistering(true);
    try {
      // Start registration
      const startResponse = await fetch('https://localhost:8080/api/V3/auth/webauthn/register/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
        credentials: 'include',
      });
      
      if (!startResponse.ok) {
        throw new Error('Failed to start WebAuthn registration');
      }
      
      const options = await startResponse.json();
      
      // Convert base64 strings to ArrayBuffer
      options.challenge = Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0));
      options.user.id = Uint8Array.from(atob(options.user.id), c => c.charCodeAt(0));
      
      // Start registration with browser
      const credential = await navigator.credentials.create({
        publicKey: options
      });
      
      // Convert ArrayBuffer to base64
      const credentialData = {
        id: credential.id,
        type: credential.type,
        response: {
          attestationObject: btoa(String.fromCharCode(...new Uint8Array(credential.response.attestationObject))),
          clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON)))
        }
      };
      
      // Finish registration
      const finishResponse = await fetch('https://localhost:8080/api/V3/auth/webauthn/register/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialData }),
        credentials: 'include',
      });
      
      if (!finishResponse.ok) {
        throw new Error('WebAuthn registration verification failed');
      }
      
      return await finishResponse.json();
    } catch (error) {
      console.error('WebAuthn registration error:', error);
      throw new Error('WebAuthn registration failed: ' + error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  const authenticate = async (email) => {
    setIsAuthenticating(true);
    try {
      // Start authentication
      const startResponse = await fetch('https://localhost:8080/api/V3/auth/webauthn/authenticate/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
      
      if (!startResponse.ok) {
        throw new Error('Failed to start WebAuthn authentication');
      }
      
      const options = await startResponse.json();
      
      // Convert base64 strings to ArrayBuffer
      options.challenge = Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0));
      options.allowCredentials = options.allowCredentials.map(cred => ({
        ...cred,
        id: Uint8Array.from(atob(cred.id), c => c.charCodeAt(0))
      }));
      
      // Start authentication with browser
      const credential = await navigator.credentials.get({
        publicKey: options
      });
      
      // Convert ArrayBuffer to base64
      const credentialData = {
        id: credential.id,
        type: credential.type,
        response: {
          authenticatorData: btoa(String.fromCharCode(...new Uint8Array(credential.response.authenticatorData))),
          clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON))),
          signature: btoa(String.fromCharCode(...new Uint8Array(credential.response.signature)))
        }
      };
      
      // Finish authentication
      const finishResponse = await fetch('https://localhost:8080/api/V3/auth/webauthn/authenticate/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialData }),
        credentials: 'include',
      });
      
      if (!finishResponse.ok) {
        throw new Error('WebAuthn authentication verification failed');
      }
      
      return await finishResponse.json();
    } catch (error) {
      console.error('WebAuthn authentication error:', error);
      throw new Error('WebAuthn authentication failed: ' + error.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return { 
    isSupported, 
    register, 
    authenticate, 
    isRegistering, 
    isAuthenticating 
  };
}; 