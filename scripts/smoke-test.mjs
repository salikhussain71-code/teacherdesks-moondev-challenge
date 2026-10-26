// Usage: node scripts/smoke-test.mjs https://your-app.vercel.app
// Verifies access control from the outside, with no login (what an attacker sees).
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
let failed = 0;
async function check(name, fn) {
  try { await fn(); console.log("PASS", name); }
  catch (e) { failed++; console.log("FAIL", name, "-", e.message); }
}
const eq = (a, b) => { if (a !== b) throw new Error(`expected ${b}, got ${a}`); };

await check("home page loads", async () => eq((await fetch(base)).status, 200));
await check("login page loads", async () => eq((await fetch(base + "/login")).status, 200));
await check("dashboard redirects when logged out", async () => {
  const r = await fetch(base + "/dashboard", { redirect: "manual" });
  eq(r.status >= 300 && r.status < 400, true);
});
await check("export blocked when logged out", async () => eq((await fetch(base + "/api/export")).status, 401));
await check("reminder blocked when logged out", async () =>
  eq((await fetch(base + "/api/reminder/00000000-0000-0000-0000-000000000000")).status, 401));
await check("reminder rejects bad id", async () => eq((await fetch(base + "/api/reminder/abc")).status, 400));
await check("unknown page gives 404", async () => eq((await fetch(base + "/nope")).status, 404));
console.log(failed ? `\n${failed} check(s) failed` : "\nAll checks passed");
process.exit(failed ? 1 : 0);
