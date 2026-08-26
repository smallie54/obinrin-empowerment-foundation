// Protects internal/scheduled-task endpoints from being triggered by
// anyone who finds the URL. The external cron service sends this secret
// as a header; anything without a matching one gets rejected.
export function verifyCronSecret(req, res, next) {
  const provided = req.headers["x-cron-secret"];

  if (!process.env.CRON_SECRET) {
    return res.status(503).json({ message: "CRON_SECRET is not configured on the server" });
  }

  if (provided !== process.env.CRON_SECRET) {
    return res.status(401).json({ message: "Invalid or missing cron secret" });
  }

  next();
}