import { Breadcrumb } from "./Breadcrumb";
import { HowItWorks } from "./HowItWorks";

interface Step {
  title: string;
  description: string;
}

interface ToolLayoutProps {
  breadcrumb: string;
  steps: Step[];
  note?: string;
  children: React.ReactNode;
}

export function ToolLayout({ breadcrumb, steps, note, children }: ToolLayoutProps) {
  return (
    <div className="max-w-5xl">
      <Breadcrumb current={breadcrumb} />
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_288px] gap-8 items-start">
        <div>{children}</div>
        <HowItWorks steps={steps} note={note} />
      </div>
    </div>
  );
}
