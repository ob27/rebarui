import { describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Text } from "../components/Text";
import { Heading } from "../components/Heading";
import { Input } from "../components/Input";
import { Switch } from "../components/Switch";
import { Avatar } from "../components/Avatar";
import { ActionSheet } from "../components/ActionSheet";

describe("Button additions", () => {
  it("block, shape, iconOnly and start/end icons set attributes", () => {
    render(
      <Button block shape="rounded" startIcon={<i data-testid="s" />} endIcon={<i data-testid="e" />}>
        Share
      </Button>,
    );
    const b = screen.getByRole("button", { name: "Share" });
    expect(b).toHaveAttribute("data-rebar-block", "true");
    expect(b).toHaveAttribute("data-rebar-shape", "rounded");
    expect(screen.getByTestId("s")).toBeInTheDocument();
    expect(screen.getByTestId("e")).toBeInTheDocument();
  });

  it("pill is the default shape and leaves no shape attribute", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button")).not.toHaveAttribute("data-rebar-shape");
    expect(screen.getByRole("button")).not.toHaveAttribute("data-rebar-block");
  });

  it("iconOnly keeps its aria-label as the name", () => {
    render(
      <Button iconOnly aria-label="Add" variant="secondary">
        <svg />
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Add" })).toHaveAttribute("data-rebar-icon-only", "true");
  });

  it("loading replaces the start icon with the spinner", () => {
    render(
      <Button loading startIcon={<i data-testid="s" />}>
        Saving
      </Button>,
    );
    expect(screen.queryByTestId("s")).not.toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });

  it("href renders an anchor with button styling", () => {
    render(
      <Button href="/mission" variant="tertiary" endIcon={<i />}>
        Read our mission
      </Button>,
    );
    const a = screen.getByRole("link", { name: "Read our mission" });
    expect(a).toHaveAttribute("href", "/mission");
    expect(a).toHaveAttribute("data-rebar-component", "button");
    expect(a).toHaveClass("rebar-button");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("target _blank adds rel noopener", () => {
    render(
      <Button href="https://example.com" target="_blank">
        Open
      </Button>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renderLink receives the href, class and marks", () => {
    const renderLink = vi.fn(({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
      <a href={href} className={className} data-router="x">
        {children}
      </a>
    ));
    render(
      <Button href="/a" renderLink={renderLink as never}>
        Go
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute("data-router", "x");
    expect(renderLink.mock.calls[0]?.[0]).toMatchObject({ href: "/a", "data-rebar-component": "button" });
  });

  it("a disabled link is aria-disabled and cannot navigate", () => {
    render(
      <Button href="/a" disabled>
        Go
      </Button>,
    );
    const a = screen.getByRole("link", { name: "Go" });
    expect(a).toHaveAttribute("aria-disabled", "true");
    expect(a).not.toHaveAttribute("href");
  });

  it("asChild applies the button look to the child", () => {
    render(
      <Button asChild variant="secondary" startIcon={<i data-testid="i" />}>
        <a href="/x">Child link</a>
      </Button>,
    );
    const a = screen.getByRole("link", { name: "Child link" });
    expect(a).toHaveClass("rebar-button");
    expect(a).toHaveAttribute("data-rebar-variant", "secondary");
    expect(screen.getByTestId("i")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("Card additions", () => {
  it("tone sets a data attribute", () => {
    render(<Card tone={3} title="Mass attendance" data-testid="c" />);
    expect(screen.getByTestId("c")).toHaveAttribute("data-rebar-tone", "3");
  });

  it("default tone leaves no attribute", () => {
    render(<Card title="x" data-testid="c" />);
    expect(screen.getByTestId("c")).not.toHaveAttribute("data-rebar-tone");
  });

  it("href makes the whole card a link, with renderLink support", () => {
    const { rerender } = render(<Card href="/perspectives/mary" title="Why Catholics honour Mary" />);
    const a = screen.getByRole("link", { name: /Why Catholics honour Mary/ });
    expect(a).toHaveAttribute("data-rebar-component", "card");
    expect(a).toHaveAttribute("data-rebar-link", "true");
    rerender(
      <Card
        href="/p"
        title="Routed"
        renderLink={({ href, children, className }) => (
          <a href={href} className={className as string} data-router="yes">
            {children as React.ReactNode}
          </a>
        )}
      />,
    );
    expect(screen.getByRole("link", { name: /Routed/ })).toHaveAttribute("data-router", "yes");
  });

  it("row orientation and eyebrow", () => {
    render(<Card orientation="row" eyebrow="Plan" title="Plus" cover={<img alt="" src="x" />} data-testid="c" />);
    expect(screen.getByTestId("c")).toHaveAttribute("data-rebar-orientation", "row");
    expect(screen.getByText("Plan")).toHaveAttribute("data-rebar-variant", "eyebrow");
  });

  it("cornerBadge renders on a row card", () => {
    render(<Card orientation="row" title="Plus" cornerBadge="Current" />);
    expect(screen.getByText("Current")).toBeInTheDocument();
  });

  it("promo is a row card with a dismiss button", async () => {
    const onDismiss = vi.fn();
    render(<Card promo title="You have used 82%" onDismiss={onDismiss} actions={[<button key="a">See plans</button>]} data-testid="c" />);
    expect(screen.getByTestId("c")).toHaveAttribute("data-rebar-promo", "true");
    expect(screen.getByTestId("c")).toHaveAttribute("data-rebar-orientation", "row");
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalled();
  });

  it("onDismiss alone (not promo) shows no close button", () => {
    render(<Card title="x" onDismiss={() => {}} />);
    expect(screen.queryByRole("button", { name: "Dismiss" })).not.toBeInTheDocument();
  });
});

describe("Text and Heading: eyebrow and section label", () => {
  it("eyebrow sets variant and defaults to the primary tone", () => {
    render(<Text variant="eyebrow">Account</Text>);
    const t = screen.getByText("Account");
    expect(t).toHaveAttribute("data-rebar-variant", "eyebrow");
    expect(t).toHaveAttribute("data-rebar-tone", "primary");
  });

  it("section-label defaults muted with an end rule; tone and rule override", () => {
    const { rerender } = render(<Text variant="section-label">This week</Text>);
    expect(screen.getByText("This week")).toHaveAttribute("data-rebar-tone", "muted");
    expect(screen.getByText("This week")).toHaveAttribute("data-rebar-rule", "end");
    rerender(
      <Text variant="section-label" tone="primary" rule="both">
        This week
      </Text>,
    );
    expect(screen.getByText("This week")).toHaveAttribute("data-rebar-tone", "primary");
    expect(screen.getByText("This week")).toHaveAttribute("data-rebar-rule", "both");
    rerender(
      <Text variant="section-label" rule={false}>
        This week
      </Text>,
    );
    expect(screen.getByText("This week")).not.toHaveAttribute("data-rebar-rule");
  });

  it("inverse tone", () => {
    render(
      <Text variant="eyebrow" tone="inverse">
        Perspective
      </Text>,
    );
    expect(screen.getByText("Perspective")).toHaveAttribute("data-rebar-tone", "inverse");
  });

  it("plain text carries no variant", () => {
    render(<Text>plain</Text>);
    expect(screen.getByText("plain")).not.toHaveAttribute("data-rebar-variant");
    expect(screen.getByText("plain")).not.toHaveAttribute("data-rebar-tone");
  });

  it("Heading eyebrow renders above and names the heading", () => {
    render(<Heading level={2} eyebrow="Narrated by an Athic author">Confession to a priest</Heading>);
    const h = screen.getByRole("heading", { level: 2 });
    expect(h).toHaveAccessibleName("Narrated by an Athic author Confession to a priest");
    expect(screen.getByText("Narrated by an Athic author")).toHaveAttribute("data-rebar-variant", "eyebrow");
  });

  it("Heading without eyebrow is unchanged (no wrapper, no id)", () => {
    const { container } = render(<Heading>Plain</Heading>);
    expect(container.querySelector(".rebar-heading-group")).toBeNull();
    expect(screen.getByRole("heading")).not.toHaveAttribute("id");
  });

  it("Heading rule", () => {
    render(<Heading level={2} rule>Your data</Heading>);
    expect(screen.getByRole("heading")).toHaveAttribute("data-rebar-rule", "end");
  });
});

describe("Input password reveal", () => {
  it("is opt-in: a bare password input has no toggle", () => {
    render(<Input type="password" aria-label="p" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("revealable toggles the field type and the label", async () => {
    render(<Input type="password" revealable aria-label="Passphrase" defaultValue="secret" />);
    const field = screen.getByLabelText("Passphrase");
    expect(field).toHaveAttribute("type", "password");
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(field).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(screen.getByRole("button", { name: "Hide password" }));
    expect(field).toHaveAttribute("type", "password");
  });

  it("custom toggleLabels", () => {
    render(<Input type="password" revealable toggleLabels={{ show: "Show passphrase", hide: "Hide passphrase" }} aria-label="p" />);
    expect(screen.getByRole("button", { name: "Show passphrase" })).toBeInTheDocument();
  });

  it("controlled visible", async () => {
    const onVisibleChange = vi.fn();
    render(<Input type="password" aria-label="p" revealable={{ visible: false, onVisibleChange }} />);
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(onVisibleChange).toHaveBeenCalledWith(true);
    expect(screen.getByLabelText("p")).toHaveAttribute("type", "password");
  });

  it("the eye button is keyboard operable", async () => {
    render(<Input type="password" revealable aria-label="p" />);
    screen.getByRole("button", { name: "Show password" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByLabelText("p")).toHaveAttribute("type", "text");
  });

  it("autoHide hides again after 8 seconds", () => {
    vi.useFakeTimers();
    try {
      render(<Input type="password" revealable autoHide aria-label="p" />);
      act(() => {
        screen.getByRole("button", { name: "Show password" }).click();
      });
      expect(screen.getByLabelText("p")).toHaveAttribute("type", "text");
      act(() => {
        vi.advanceTimersByTime(8100);
      });
      expect(screen.getByLabelText("p")).toHaveAttribute("type", "password");
    } finally {
      vi.useRealTimers();
    }
  });

  it("startIcon renders inside the field wrapper", () => {
    const { container } = render(<Input startIcon={<i data-testid="lock" />} aria-label="p" />);
    expect(screen.getByTestId("lock")).toBeInTheDocument();
    expect(container.querySelector('[data-rebar-part="affix"]')).toBeInTheDocument();
  });

  it("invalid passes through", () => {
    render(<Input type="password" revealable invalid aria-label="p" />);
    expect(screen.getByLabelText("p")).toHaveAttribute("aria-invalid", "true");
  });
});

describe("Switch loading", () => {
  it("loading shows a spinner, aria-busy and keeps its value", () => {
    render(<Switch aria-label="Remind me daily" defaultChecked loading />);
    const s = screen.getByRole("switch");
    expect(s).toHaveAttribute("aria-busy", "true");
    expect(s).toHaveAttribute("aria-checked", "true");
    expect(s.querySelector('[data-rebar-part="spinner"]')).toBeInTheDocument();
  });

  it("does not change while loading", async () => {
    const onChange = vi.fn();
    render(<Switch aria-label="s" loading onChange={onChange} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("onChange gets the next value and a promise sets loading until it settles", async () => {
    let release: () => void = () => {};
    const work = new Promise<void>((r) => (release = r));
    render(<Switch aria-label="s" onChange={() => work} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(screen.getByRole("switch")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    await act(async () => {
      release();
      await work;
    });
    expect(screen.getByRole("switch")).not.toHaveAttribute("aria-busy");
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("a rejection reverts an uncontrolled value", async () => {
    render(<Switch aria-label="s" onChange={() => Promise.reject(new Error("blocked"))} />);
    await userEvent.click(screen.getByRole("switch"));
    await waitFor(() => expect(screen.getByRole("switch")).not.toHaveAttribute("aria-busy"));
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("existing onCheckedChange and controlled checked still work", async () => {
    const onCheckedChange = vi.fn();
    function Host() {
      const [on, setOn] = useState(false);
      return <Switch aria-label="s" checked={on} onCheckedChange={(v) => { onCheckedChange(v); setOn(v); }} />;
    }
    render(<Host />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("size sets an attribute", () => {
    render(<Switch aria-label="s" size="lg" />);
    expect(screen.getByRole("switch")).toHaveAttribute("data-rebar-size", "lg");
  });
});

describe("Avatar additions", () => {
  it("overlay edit makes the avatar a button", async () => {
    const onClick = vi.fn();
    render(<Avatar fallback="MK" overlay="edit" onClick={onClick} aria-label="Change photo" size="xl" />);
    const b = screen.getByRole("button", { name: "Change photo" });
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(b).toHaveAttribute("data-rebar-size", "xl");
    await userEvent.click(b);
    expect(onClick).toHaveBeenCalledTimes(1);
    b.focus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("custom overlay content", () => {
    render(<Avatar fallback="MK" overlay="Change" />);
    expect(screen.getByText("Change")).toBeInTheDocument();
  });

  it("loading shows the scrim, is busy and ignores clicks", async () => {
    const onClick = vi.fn();
    render(<Avatar fallback="MK" overlay="edit" loading onClick={onClick} aria-label="Photo" />);
    expect(screen.getByRole("status", { name: "Uploading" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Photo" }));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Photo" })).toHaveAttribute("aria-busy", "true");
  });

  it("badge renders in a wrapper", () => {
    const { container } = render(<Avatar fallback="MK" badge={<i data-testid="cam" />} />);
    expect(screen.getByTestId("cam")).toBeInTheDocument();
    expect(container.querySelector('[data-rebar-part="avatar-wrap"]')).toBeInTheDocument();
  });

  it("invalid sets an attribute", () => {
    const { container } = render(<Avatar fallback="MK" invalid />);
    expect(container.querySelector('[data-rebar-component="avatar"]')).toHaveAttribute("data-rebar-invalid", "true");
  });

  it("a numeric size sets the diameter", () => {
    const { container } = render(<Avatar fallback="MK" size={72} />);
    const el = container.querySelector('[data-rebar-component="avatar"]') as HTMLElement;
    expect(el.style.width).toBe("72px");
    expect(el).toHaveAttribute("data-rebar-size", "custom");
  });

  it("a plain avatar is not a button", () => {
    render(<Avatar fallback="MK" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("ActionSheet extras", () => {
  it("renders info, divider, link, loading, danger and disabled items", () => {
    render(
      <ActionSheet
        defaultOpen
        title="Discussion actions"
        items={[
          { type: "info", label: "Saved to Library 14 October" },
          { label: "Open in browser", href: "https://example.com", target: "_blank" },
          { type: "divider", label: "" },
          { label: "Generating", loading: true },
          { label: "Download audio", disabled: true, hint: "Plus" },
          { label: "Delete", destructive: true },
        ]}
      />,
    );
    expect(screen.getByText("Saved to Library 14 October").closest("[data-rebar-part]")).toHaveAttribute("data-rebar-part", "info");
    expect(screen.getByRole("separator")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open in browser/ })).toHaveAttribute("href", "https://example.com");
    expect(screen.getByRole("button", { name: /Generating/ })).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("button", { name: /Download audio/ })).toBeDisabled();
    expect(screen.getByText("Plus")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toHaveClass("rebar-action-sheet-item-destructive");
  });

  it("existing actions prop still works and closes on select", async () => {
    const onSelect = vi.fn();
    render(<ActionSheet defaultOpen actions={[{ label: "Rename", onSelect }]} />);
    await userEvent.click(screen.getByRole("button", { name: "Rename" }));
    expect(onSelect).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("button", { name: "Rename" })).not.toBeInTheDocument());
  });

  it("closeOnSelect false keeps the sheet open", async () => {
    render(<ActionSheet defaultOpen closeOnSelect={false} actions={[{ label: "Rename", onSelect: () => {} }]} />);
    await userEvent.click(screen.getByRole("button", { name: "Rename" }));
    expect(screen.getByRole("button", { name: "Rename" })).toBeInTheDocument();
  });

  it("a promise onSelect sets the item loading, blocks other taps and dismissal, then closes", async () => {
    let release: () => void = () => {};
    const work = new Promise<void>((r) => (release = r));
    const other = vi.fn();
    render(<ActionSheet defaultOpen actions={[{ label: "Generate", onSelect: () => work }, { label: "Other", onSelect: other }]} />);
    await userEvent.click(screen.getByRole("button", { name: "Generate" }));
    expect(screen.getByRole("button", { name: "Generate" })).toHaveAttribute("aria-busy", "true");
    await userEvent.click(screen.getByRole("button", { name: "Other" }));
    expect(other).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    await act(async () => {
      release();
      await work;
    });
    await waitFor(() => expect(screen.queryByRole("button", { name: "Generate" })).not.toBeInTheDocument());
  });

  it("a link item calls renderLink", () => {
    render(
      <ActionSheet
        defaultOpen
        actions={[{ label: "Share", href: "/share", renderLink: ({ href, children, className }) => <a href={href} className={className as string} data-router="r">{children as React.ReactNode}</a> }]}
      />,
    );
    expect(screen.getByRole("link", { name: "Share" })).toHaveAttribute("data-router", "r");
  });

  it("dismissible false refuses Cancel", async () => {
    const onOpenChange = vi.fn();
    render(<ActionSheet defaultOpen dismissible={false} onOpenChange={onOpenChange} actions={[{ label: "x" }]} />);
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
