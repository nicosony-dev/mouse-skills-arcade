/* dragutil.js
   A small, dependency-free helper for making an element draggable with the
   Pointer Events API (works for mouse, touch, and pen with one code path).
   Used by the builder, tangram, magnets, and geomap engines.
*/

/**
 * Makes `el` draggable inside `stageEl` (position: relative/absolute parent).
 * options:
 *   onStart(el, ev)
 *   onMove(el, x, y, ev)   x/y are the element's new top-left, in stage coords
 *   onEnd(el, x, y, ev)
 *   onTap(el, ev)          fires on pointerup when the press moved less than
 *                          tapThresholdPx — a "click" without the ambiguity
 *                          of whether the browser's native click event still
 *                          fires after preventDefault() on pointerdown (it
 *                          doesn't, reliably, in every browser/input type)
 *   onDoubleTap(el, ev)    fires instead of onTap when two taps land within
 *                          350ms of each other — a 'dblclick' replacement
 *                          for the same reason as onTap above
 *   tapThresholdPx: number (default 6)
 *   bounds: boolean - if true, keeps the element fully inside the stage
 */
function makeDraggable(el, stageEl, options) {
  options = options || {};
  const tapThreshold = options.tapThresholdPx || 6;
  let startX = 0, startY = 0, origX = 0, origY = 0, dragging = false, moved = false, lastTapTime = 0;

  el.style.touchAction = 'none';

  function stageRect() {
    return stageEl.getBoundingClientRect();
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function onPointerDown(ev) {
    // Only primary button for mouse
    if (ev.button !== undefined && ev.button !== 0) return;
    dragging = true;
    moved = false;
    el.setPointerCapture && el.setPointerCapture(ev.pointerId);
    startX = ev.clientX;
    startY = ev.clientY;
    const rect = el.getBoundingClientRect();
    const sRect = stageRect();
    origX = rect.left - sRect.left;
    origY = rect.top - sRect.top;
    el.classList.add('dragging');
    if (el.parentElement) el.parentElement.appendChild(el); // bring to front within its parent
    if (options.onStart) options.onStart(el, ev);
    ev.preventDefault();
  }

  function onPointerMove(ev) {
    if (!dragging) return;
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;
    if (Math.hypot(dx, dy) > tapThreshold) moved = true;
    let newX = origX + dx;
    let newY = origY + dy;
    if (options.bounds) {
      const sRect = stageRect();
      const elRect = el.getBoundingClientRect();
      newX = clamp(newX, 0, Math.max(0, sRect.width - elRect.width));
      newY = clamp(newY, 0, Math.max(0, sRect.height - elRect.height));
    }
    el.style.left = newX + 'px';
    el.style.top = newY + 'px';
    if (options.onMove) options.onMove(el, newX, newY, ev);
  }

  function onPointerUp(ev) {
    if (!dragging) return;
    dragging = false;
    el.classList.remove('dragging');
    const rect = el.getBoundingClientRect();
    const sRect = stageRect();
    const finalX = rect.left - sRect.left;
    const finalY = rect.top - sRect.top;
    if (options.onEnd) options.onEnd(el, finalX, finalY, ev);
    if (!moved) {
      const now = Date.now();
      if (now - lastTapTime < 350 && options.onDoubleTap) {
        options.onDoubleTap(el, ev);
        lastTapTime = 0; // avoid a third quick tap chaining into another double-tap
      } else {
        lastTapTime = now;
        if (options.onTap) options.onTap(el, ev);
      }
    }
  }

  el.addEventListener('pointerdown', onPointerDown);
  el.addEventListener('pointermove', onPointerMove);
  el.addEventListener('pointerup', onPointerUp);
  el.addEventListener('pointercancel', onPointerUp);

  return {
    destroy() {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
    }
  };
}

/** Distance between two rect centers, used for drop-zone / snap checks. */
function rectCenter(rect) {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function centerDistance(rectA, rectB) {
  const a = rectCenter(rectA);
  const b = rectCenter(rectB);
  return Math.hypot(a.x - b.x, a.y - b.y);
}
