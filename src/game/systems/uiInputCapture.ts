const NON_TEXT_INPUT_TYPES = new Set([
  "button",
  "checkbox",
  "color",
  "file",
  "hidden",
  "image",
  "radio",
  "range",
  "reset",
  "submit",
]);

function isTextInputElement(el: Element): el is HTMLInputElement {
  if (!(el instanceof HTMLInputElement)) return false;
  // Default type is "text" if omitted.
  const type = (el.getAttribute("type") ?? el.type ?? "text").toLowerCase();
  return !NON_TEXT_INPUT_TYPES.has(type);
}

function isTextAreaElement(el: Element): el is HTMLTextAreaElement {
  return el instanceof HTMLTextAreaElement;
}

function isContentEditableElement(el: Element): boolean {
  // `isContentEditable` is true for descendants of a contenteditable root.
  if ((el as HTMLElement).isContentEditable) return true;

  // `closest()` catches the common case where focus is on a nested child.
  const closestEditable = el.closest?.(
    '[contenteditable=""], [contenteditable="true"], [contenteditable="plaintext-only"]'
  );
  return Boolean(closestEditable);
}

/**
 * Returns true when the user is focused on a text-editable DOM element.
 *
 * This is used to disable gameplay movement/hotkeys while typing, without
 * requiring any explicit modal/panel state tracking.
 */
export function isTypingInEditableElement(target?: EventTarget | null): boolean {
  // Be safe in non-browser contexts.
  if (typeof document === "undefined") return false;

  const el = (target instanceof Element ? target : document.activeElement) ?? null;
  if (!el) return false;

  // If the target is inside a shadow root, `document.activeElement` may be the
  // host; in that case, we still want to treat it as captured if any editable
  // lives inside.
  const effective = el instanceof Element ? el : null;
  if (!effective) return false;

  return isTextInputElement(effective) || isTextAreaElement(effective) || isContentEditableElement(effective);
}

/** Convenience wrapper for focus-based capture checks. */
export function isUIInputCaptured(): boolean {
  return isTypingInEditableElement(null);
}
