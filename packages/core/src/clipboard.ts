/**
 * Copies text to the clipboard and says whether it worked. `navigator.clipboard` only exists on secure pages (https, or localhost),
 * so on a plain-http page (an app opened by its LAN address, say) it is simply undefined and a bare `navigator.clipboard.writeText`
 * does nothing, silently. The older hidden-textarea + `execCommand("copy")` route still works there, from inside a click, so it is
 * the fallback. Resolves false (never throws) when neither works, so the caller can tell the person instead of pretending.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* denied or unavailable: try the fallback */
  }
  try {
    if (typeof document === "undefined" || typeof document.execCommand !== "function") return false;
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.setAttribute("aria-hidden", "true");
    area.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}
