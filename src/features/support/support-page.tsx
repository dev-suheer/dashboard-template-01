import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/icons";
import { Button, IconButton } from "@/components/ui/button";
import { SelectField } from "@/components/ui/field";
import { SearchField } from "@/components/ui/search-field";
import { Modal } from "@/components/ui/modal";
import { Avatar, Card, StatusPill } from "@/components/ui/surface";
import { useToast } from "@/lib/toast";

type Status = "Open" | "Replied" | "Closed";

type Request = {
  id: string;
  name: string;
  email: string;
  phone: string;
  tone: 1 | 2 | 3 | 4 | 5 | 6;
  subject: string;
  message: string;
  status: Status;
  reply: string;
};

const seed: Request[] = [
  {
    id: "HT-91",
    name: "Molly Kaur",
    email: "molly.kaur@skerrowline.co.uk",
    phone: "+44 7700 900214",
    tone: 6,
    subject: "Does my ENG1 renewal count as paid time if the appointment is on a rostered day",
    message: "The medical is next Thursday at 09:30 in Oban, which is the middle of my watch on Corran. I can make the sailing after if someone covers the first hour, but I need to know whether the appointment itself is paid before I book the relief.",
    status: "Open",
    reply: "",
  },
  {
    id: "HT-88",
    name: "Idris Chen",
    email: "idris.chen@skerrowline.co.uk",
    phone: "+44 7700 900331",
    tone: 4,
    subject: "Payslip shows the wrong tax code",
    message: "November’s slip still has 1257L. HMRC wrote last month and moved me to 1100L. Can the people team correct it before the run locks on the 22nd?",
    status: "Replied",
    reply: "We’ll correct the code on the November run. You’ll see 1100L on the slip that goes out on the 27th.",
  },
  {
    id: "HT-84",
    name: "Aisha Hughes",
    email: "aisha.hughes@skerrowline.co.uk",
    phone: "+44 7700 900448",
    tone: 2,
    subject: "Christmas leave for my sister’s wedding in Galway",
    message: "I put in 20–26 November as annual leave and it is still waiting. The ferry to Dublin is booked. If that week can’t be spared, tell me which two days I should keep so the 15:45 sailing stays crewed.",
    status: "Open",
    reply: "",
  },
  {
    id: "HT-79",
    name: "Kenji Arai",
    email: "kenji.arai@skerrowline.co.uk",
    phone: "+44 7700 900512",
    tone: 1,
    subject: "Friday night watch swap with Ruby Reid",
    message: "Ruby can take Friday night on Brae Lass. I’ve asked her in the app and she accepted. It still needs a manager to approve it or the watch stays on me.",
    status: "Closed",
    reply: "Approved. Friday night is Ruby’s, and you’re off that watch.",
  },
];

const tone: Record<Status, "warn" | "info" | "good"> = {
  Open: "warn",
  Replied: "info",
  Closed: "good",
};

function Clip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const rect = open ? buttonRef.current?.getBoundingClientRect() : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="block max-w-[220px] cursor-pointer truncate text-left text-sm hover:text-accent-text"
        onClick={() => setOpen((value) => !value)}
      >
        {text}
      </button>
      {open && rect
        ? createPortal(
            <div
              ref={panelRef}
              role="tooltip"
              style={{ top: rect.bottom + 8, left: Math.max(12, Math.min(rect.left, window.innerWidth - 304)) }}
              className="fixed z-50 w-72 rounded-lg bg-card p-3 text-sm leading-relaxed text-ink shadow-pop ring-1 ring-line"
            >
              {text}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

export function SupportPage() {
  const { push } = useToast();
  const [rows, setRows] = useState(seed);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("Open");
  const [reply, setReply] = useState("");
  const active = rows.find((row) => row.id === activeId) ?? null;
  const needle = query.trim().toLowerCase();
  const visible = rows.filter((row) =>
    !needle ||
    [row.name, row.email, row.phone, row.subject, row.message, row.status].some((value) =>
      value.toLowerCase().includes(needle),
    ),
  );

  const open = (row: Request) => {
    setActiveId(row.id);
    setStatus(row.status);
    setReply(row.reply);
  };

  const save = () => {
    if (!active) return;
    if (reply.trim().length > 0 && reply.trim().length < 8) return;
    setRows((current) =>
      current.map((row) =>
        row.id === active.id ? { ...row, status, reply: reply.trim() || row.reply } : row,
      ),
    );
    setActiveId(null);
    push(reply.trim() ? "Reply sent" : "Status updated");
  };

  return (
    <>
      <Card className="p-4 md:p-5" delay={40}>
        <SearchField
          aria-label="Search requests"
          placeholder="Search by name, email, phone or subject"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          fieldClassName="max-w-sm"
        />
        <div className="mt-4 w-full max-w-full overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead className="text-xs font-semibold text-muted">
              <tr>
                {["From", "Phone", "Subject", "Message", "Status", "Actions"].map((heading) => (
                  <th key={heading} className="px-2 py-2 font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((row, index) => (
                <tr key={row.id} className="row-in border-t border-line" style={{ animationDelay: `${index * 40}ms` }}>
                  <td className="px-2 py-2.5">
                    <span className="flex items-center gap-3">
                      <Avatar name={row.name} tone={row.tone} />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">{row.name}</span>
                        <span className="block text-xs text-muted">{row.email}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-sm tabular-nums">{row.phone}</td>
                  <td className="px-2 py-2.5"><Clip text={row.subject} /></td>
                  <td className="px-2 py-2.5"><Clip text={row.message} /></td>
                  <td className="px-2 py-2.5"><StatusPill tone={tone[row.status]}>{row.status}</StatusPill></td>
                  <td className="px-2 py-2.5">
                    <IconButton label={`Reply to ${row.name}`} onClick={() => open(row)}>
                      <Icon name="reply" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">No requests match that search.</p>
          ) : null}
        </div>
      </Card>

      <Modal
        open={active !== null}
        title={active ? `Reply to ${active.name}` : "Reply"}
        description={active ? `${active.email} · ${active.phone}` : undefined}
        onClose={() => setActiveId(null)}
        footer={
          <>
            <Button onClick={() => setActiveId(null)}>Cancel</Button>
            <Button variant="primary" onClick={save}>Save</Button>
          </>
        }
      >
        {active ? (
          <div className="grid gap-4">
            <div>
              <p className="text-sm font-semibold">{active.subject}</p>
              <p className="mt-1 text-sm text-ink-2">{active.message}</p>
            </div>
            <SelectField label="Status" value={status} onChange={(event) => setStatus(event.target.value as Status)}>
              <option>Open</option>
              <option>Replied</option>
              <option>Closed</option>
            </SelectField>
            <label className="grid gap-1.5 text-sm">
              <span className="font-semibold text-ink-2">Reply</span>
              <textarea
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                rows={4}
                placeholder="Write your reply"
                className="w-full resize-y rounded-lg bg-card px-3.5 py-2.5 text-md text-ink shadow-raise ring-1 ring-line-strong outline-none placeholder:text-muted focus:ring-2 focus:ring-accent"
              />
              {reply.trim().length > 0 && reply.trim().length < 8 ? (
                <span role="alert" className="text-xs font-semibold text-bad">Write at least a short sentence.</span>
              ) : null}
            </label>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
