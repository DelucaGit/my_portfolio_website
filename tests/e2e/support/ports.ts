/**
 * Where the suite's two static servers listen.
 * E2E_PORT lets several checkouts run the suite at the same time.
 */
export const PORT = Number(process.env.E2E_PORT ?? 4173);

/** The copy of the site in which two projects have ended (see ended-site.ts). */
export const ENDED_PORT = PORT + 1;
