import { HowItWorks } from "./HowItWorks";

interface Step {
  title: string;
  description: string;
}

interface ToolLayoutProps {
  steps: Step[];
  note?: string;
  children: React.ReactNode;
}

export function ToolLayout({ steps, note, children }: ToolLayoutProps) {
  return (
    <div className="max-w-5xl">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6 items-start">
        <div>{children}</div>
        <HowItWorks steps={steps} note={note} />
      </div>
    </div>
  );
}
