import { LegalDocument } from "@/features/support/legal-document";

/** Stand-in until the privacy HTML comes from the API. */
const html = `
<p>Last updated 3 November 2026. This policy explains what the Temp01 crew desk keeps about you, and who can see it.</p>
<h2>What we keep</h2>
<p>The desk holds the details the company needs to roster and pay you.</p>
<ul>
  <li>Your name, work email, phone number and the photo on your account.</li>
  <li>Watches, attendance, leave and the ships or terminal you work.</li>
  <li>Pay figures, tax codes and payslips for the runs you are on.</li>
  <li>Requests you send or receive, including replies and status.</li>
</ul>
<h2>Why we keep it</h2>
<p>We use it to build the roster, run pay, answer a request, and keep a record of what was agreed. We do not sell it, and we do not use it for advertising.</p>
<h2>Who can see it</h2>
<p>You can see your own record. Managers see the hours, watches and allowances for the people they run. The people team sees what they need to run pay, including bank and tax details. A colleague sees your name and watch when a swap or a request involves them. They do not see your payslip.</p>
<h2>How long we keep it</h2>
<p>Account and pay records stay for as long as employment law requires after you leave. Support requests stay with the record they belong to. When a retention period ends, we delete or archive the row.</p>
<h2>Your choices</h2>
<p>You can correct your name, phone and photo from Profile. Email changes go through the people team so the payroll record stays matched. To ask for a copy of what we hold, or to question a figure, send a request from Support.</p>
`;

export function PrivacyPage() {
  return <LegalDocument html={html} />;
}
