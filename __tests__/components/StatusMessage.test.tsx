import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusMessage } from "@/components/StatusMessage";

describe("StatusMessage", () => {
  it("renders the message text", () => {
    render(<StatusMessage status="success" message="Todo correcto" />);
    expect(screen.getByRole("alert")).toBeDefined();
    expect(screen.getByText("Todo correcto")).toBeDefined();
  });

  it("applies success styles", () => {
    render(<StatusMessage status="success" message="OK" />);
    const el = screen.getByRole("alert");
    expect(el.className).toContain("green");
  });

  it("applies error styles", () => {
    render(<StatusMessage status="error" message="Fallo" />);
    const el = screen.getByRole("alert");
    expect(el.className).toContain("red");
  });

  it("applies info styles", () => {
    render(<StatusMessage status="info" message="Info" />);
    const el = screen.getByRole("alert");
    expect(el.className).toContain("blue");
  });
});
