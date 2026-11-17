import { useState } from "react";
import { Icon } from "@/components/icons";
import { Card } from "@/components/ui/surface";
import { cn } from "@/lib/cn";

const questions = [
  {
    q: "How do I swap a watch with someone?",
    a: "Open the watch on Attendance and pick who takes it. They accept in the app, and you approve it from Overview. Until it is approved, the watch is still yours.",
  },
  {
    q: "When are we paid?",
    a: "The 27th of the month, or the working day before if that falls on a weekend.",
  },
  {
    q: "I’m ill and can’t come in. Who do I tell?",
    a: "Call the duty officer at the terminal, then add the sickness in the app before your watch starts.",
  },
  {
    q: "How do I change my password?",
    a: "Open your account menu, choose Profile, then Change password. If you are signed out, use Forgot password on the sign-in screen.",
  },
  {
    q: "Who can see my payslip?",
    a: "You, and the people team running that month’s pay. Managers see hours and allowances, not your bank details.",
  },
];

export function FaqPage() {
  const [open, setOpen] = useState<string | null>(questions[0]?.q ?? null);

  return (
    <Card className="p-2 md:p-3" delay={40}>
      <ul>
        {questions.map((item, index) => {
          const isOpen = open === item.q;
          return (
            <li key={item.q} className="row-in border-t border-line first:border-t-0" style={{ animationDelay: `${index * 40}ms` }}>
              <button
                type="button"
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 px-3 py-3.5 text-left text-base font-semibold"
                onClick={() => setOpen(isOpen ? null : item.q)}
              >
                <span>{item.q}</span>
                <Icon name="chevron" className={cn("shrink-0 transition-transform duration-300", isOpen && "rotate-180")} />
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden" aria-hidden={!isOpen}>
                  <p className="px-3 pb-3.5 text-base text-ink-2">{item.a}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
