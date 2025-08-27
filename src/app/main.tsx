import { hydrateRoot } from 'react-dom/client'
import { Suspense } from 'react'
import { initializeSentry } from './providers/sentry'
import App from './App'
import './styles/index.css'
import './providers/i18n'

initializeSentry();

import { BrowserRouter } from "react-router-dom";

hydrateRoot(
  document.getElementById("root")!,
  <BrowserRouter>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </BrowserRouter>
);
