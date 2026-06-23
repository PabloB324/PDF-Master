import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "@/components/ProgressBar";

describe("ProgressBar", () => {
  it("renders with the correct aria-valuenow", () => {
    render(<ProgressBar value={50} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "50");
  });

  it("clamps values above 100", () => {
    render(<ProgressBar value={150} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("clamps negative values to 0", () => {
    render(<ProgressBar value={-10} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("renders label when provided", () => {
    render(<ProgressBar value={30} label="Cargando..." />);
    expect(screen.getByText("Cargando...")).toBeDefined();
  });

  it("renders percentage text when label is provided", () => {
    render(<ProgressBar value={75} label="Procesando" />);
    expect(screen.getByText("75%")).toBeDefined();
  });
});
