/// <reference types="vite/client" />

declare global {
  interface Window {
    atelier: {
      chooseRepository: () => Promise<string | null>;
    };
  }
}

export {};
