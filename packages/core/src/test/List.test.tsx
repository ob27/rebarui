import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { List, ListItem, ListSection } from "../components/List";
import { Switch } from "../components/Switch";

describe("List and ListItem", () => {
  it("renders a list of items with data attributes", () => {
    const { container } = render(
      <List variant="grouped" aria-label="Settings">
        <ListItem title="Plan and billing" trailing="chevron" />
        <ListItem title="App icon" />
      </List>,
    );
    expect(screen.getByRole("list", { name: "Settings" })).toHaveAttribute("data-rebar-variant", "grouped");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(container.querySelector('[data-rebar-part="chevron"]')).toBeInTheDocument();
  });

  it("defaults to the cards variant and passes the variant to rows", () => {
    render(
      <List>
        <ListItem title="One" />
      </List>,
    );
    expect(screen.getByRole("listitem")).toHaveAttribute("data-rebar-variant", "cards");
  });

  it("uses a serif title with media and sans without, unless titleStyle says otherwise", () => {
    render(
      <List>
        <ListItem title="a" media={<img alt="" src="x.png" />} />
        <ListItem title="b" />
        <ListItem title="c" titleStyle="sans" media={<span />} />
      </List>,
    );
    const rows = screen.getAllByRole("listitem");
    expect(rows[0]).toHaveAttribute("data-rebar-title-style", "serif");
    expect(rows[1]).toHaveAttribute("data-rebar-title-style", "sans");
    expect(rows[2]).toHaveAttribute("data-rebar-title-style", "sans");
  });

  it("renders title, description and meta", () => {
    render(<ListItem title="Remind me daily" description="Off by default" meta="2 hours ago" />);
    expect(screen.getByText("Remind me daily")).toBeInTheDocument();
    expect(screen.getByText("Off by default")).toBeInTheDocument();
    expect(screen.getByText("2 hours ago")).toBeInTheDocument();
  });

  it("is a button when onClick is given, and activates by keyboard", async () => {
    const onClick = vi.fn();
    render(<ListItem title="Open me" onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Open me" });
    button.focus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is a link with href and uses renderLink when given", () => {
    const { rerender } = render(<ListItem title="Mission" href="/mission" />);
    expect(screen.getByRole("link", { name: "Mission" })).toHaveAttribute("href", "/mission");
    rerender(
      <ListItem
        title="Mission"
        href="/mission"
        renderLink={({ href, children, className, ...rest }) => (
          <a data-router="yes" href={href} className={className} data-rebar-part={rest["data-rebar-part"] as string}>
            {children}
          </a>
        )}
      />,
    );
    expect(screen.getByRole("link", { name: "Mission" })).toHaveAttribute("data-router", "yes");
  });

  it("a plain row is not interactive", () => {
    render(<ListItem title="Static" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("a trailing control does not trigger the row", async () => {
    const onClick = vi.fn();
    const onCheckedChange = vi.fn();
    render(<ListItem title="Remind me" onClick={onClick} trailing={<Switch aria-label="Remind me" onCheckedChange={onCheckedChange} />} />);
    await userEvent.click(screen.getByRole("switch", { name: "Remind me" }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("the more trailing renders a labelled button calling onMore", async () => {
    const onMore = vi.fn();
    render(<ListItem title="Discussion" trailing="more" onMore={onMore} />);
    await userEvent.click(screen.getByRole("button", { name: "More actions" }));
    expect(onMore).toHaveBeenCalled();
  });

  it("renders a leading icon tile with tone", () => {
    const { container } = render(<ListItem title="Reflections" leading={{ icon: <svg />, tone: 3 }} />);
    expect(container.querySelector('[data-rebar-part="leading"]')).toHaveAttribute("data-rebar-tone", "3");
  });

  it("marks selected with aria-current", () => {
    render(<ListItem title="Open item" selected onClick={() => {}} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("listitem")).toHaveAttribute("data-rebar-selected", "true");
  });

  it("loading is busy, not clickable, and shows a spinner", async () => {
    const onClick = vi.fn();
    render(<ListItem title="Deleting" loading onClick={onClick} />);
    const row = screen.getByRole("listitem");
    expect(row).toHaveAttribute("aria-busy", "true");
    expect(row).toHaveAttribute("data-rebar-state", "loading");
    expect(screen.getByRole("status", { name: "Working" })).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("disabled is not focusable or clickable", () => {
    render(<ListItem title="Nope" disabled onClick={() => {}} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByRole("listitem")).toHaveAttribute("data-rebar-state", "disabled");
  });

  it("skeleton hides from assistive tech", () => {
    const { container } = render(<ListItem title="" skeleton />);
    expect(container.querySelector("li")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("li")).toHaveAttribute("data-rebar-state", "skeleton");
  });

  describe("highlight", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("shows the New chip and clears itself after 4 seconds", () => {
      const onEnd = vi.fn();
      render(<ListItem title="Fresh" highlight="new" onHighlightEnd={onEnd} />);
      expect(screen.getByText("New")).toBeInTheDocument();
      expect(screen.getByRole("listitem")).toHaveAttribute("data-rebar-highlight", "true");
      act(() => {
        vi.advanceTimersByTime(4000);
      });
      expect(screen.queryByText("New")).not.toBeInTheDocument();
      expect(screen.getByRole("listitem")).not.toHaveAttribute("data-rebar-highlight");
      expect(onEnd).toHaveBeenCalled();
    });

    it("a pinned highlight stays", () => {
      render(<ListItem title="Fresh" highlight highlightPinned />);
      act(() => {
        vi.advanceTimersByTime(10000);
      });
      expect(screen.getByRole("listitem")).toHaveAttribute("data-rebar-highlight", "true");
    });
  });

  it("List.loading shows four skeleton rows", () => {
    const { container } = render(<List loading />);
    expect(container.querySelectorAll('[data-rebar-state="skeleton"]')).toHaveLength(4);
    expect(screen.getByRole("list", { hidden: true })).toHaveAttribute("aria-busy", "true");
  });

  it("List.empty renders when there are no children", () => {
    render(<List empty={<p>No discussions yet</p>} />);
    expect(screen.getByText("No discussions yet")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});

describe("ListSection", () => {
  it("renders an eyebrow title and a footer, labelling the section", () => {
    render(
      <ListSection title="Bible translation" footer="Used for the Bible and the Mass readings.">
        <List>
          <ListItem title="Douay-Rheims" />
        </List>
      </ListSection>,
    );
    expect(screen.getByRole("region", { name: "Bible translation" })).toBeInTheDocument();
    expect(screen.getByText("Bible translation")).toHaveAttribute("data-rebar-variant", "eyebrow");
    expect(screen.getByText("Used for the Bible and the Mass readings.")).toBeInTheDocument();
  });
});
