import { LegalDocument } from "@/features/support/legal-document";

/** Stand-in until the terms HTML comes from the API. */
const html = `
<p>Last updated 3 November 2026. These terms cover the Temp01 crew desk for the Skerrow Line. By signing in you agree to them.</p>
<h2>The desk</h2>
<p>Temp01 is the day-to-day desk for rosters, attendance, pay and the requests people send you. It is a working tool for the company, not a public service. Access is for people the company has invited.</p>
<h2>Your account</h2>
<p>Keep your password to yourself and sign out on a shared terminal. You are responsible for what is done from your account. Tell the people team straight away if you think someone else has used it.</p>
<h2>Rosters, pay and records</h2>
<p>Watches, timesheets and payslips shown here are the company’s working record. If a figure looks wrong, raise it from Support before the pay run locks. A reply in the desk is the record of what was agreed.</p>
<ul>
  <li>Do not change another person’s hours unless that is your job.</li>
  <li>Leave and watch swaps stay pending until a manager approves them.</li>
  <li>Closing a request does not delete it. It stays on the desk for the people who need it.</li>
</ul>
<h2>Acceptable use</h2>
<p>Use the desk for company work. Do not post anything unlawful, abusive, or about a colleague that does not belong in a work record. We can suspend an account that is being misused.</p>
<h2>Availability</h2>
<p>We aim to keep the desk available through the working day. Maintenance, a fault, or a loss of connection at the terminal can take it offline. Keep a paper fallback for the sailing that is about to leave.</p>
<h2>Changes</h2>
<p>We can update these terms when the desk changes. The date at the top is the version in force. Continuing to sign in after that date means you accept the update.</p>
`;

export function TermsPage() {
  return <LegalDocument html={html} />;
}
