import * as Sentry from "@sentry/react";
import { config } from "@/shared/config";

export function initializeSentry() {
  if (import.meta.env.PROD && config.VITE_SENTRY_DSN) { // Only run Sentry in production and if DSN is provided
    Sentry.init({
      dsn: config.VITE_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of the transactions
      tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
      // Session Replay
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
  }
}
