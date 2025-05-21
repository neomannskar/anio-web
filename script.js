const yearEl   = document.getElementById("year");
const cursorEl = document.getElementById("cursor");
const months   = Array.from(document.querySelectorAll(".month"));

const fadeStart = 50;   // px scrolled before fading begins
const fadeEnd   = 200;  // px scrolled when cursor is fully gone

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  console.log(y);
  // compute a 1 → 0 opacity between fadeStart and fadeEnd
  let opacity = 1;
  if (y > fadeStart) {
    opacity = 1 - ((y - fadeStart) / (fadeEnd - fadeStart));
    opacity = Math.max(0, Math.min(1, opacity));
  }
  cursorEl.style.opacity = opacity;
});

function daysIn(monthIndex) {
  const y = new Date().getFullYear();
  return new Date(y, monthIndex + 1, 0).getDate();
}

function populateDays() {
  const now = new Date();
  const todayMonth = now.getMonth();
  const todayDate  = now.getDate();

  months.forEach(li => {
    const mIndex = +li.dataset.month;
    const count  = daysIn(mIndex);
    const daysUl = li.querySelector(".days");
    daysUl.innerHTML = "";

    for (let d = 1; d <= count; d++) {
      const dayLi = document.createElement("li");
      dayLi.textContent = d;
      // mark past/future
      if (mIndex < todayMonth || (mIndex === todayMonth && d <= todayDate)) {
        dayLi.classList.add("past");
      } else {
        dayLi.classList.add("future");
      }
      daysUl.appendChild(dayLi);
    }
  });
}

function updateCursor() {
  const now   = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end   = new Date(now.getFullYear() + 1, 0, 1);
  const frac  = (now - start) / (end - start);

  // get all month <li> elements
  const monthEls = Array.from(document.querySelectorAll(".month"));

  // first & last DOMRects relative to the wrapper
  const wrapperRect = document.querySelector(".wrapper")
                             .getBoundingClientRect();
  const firstRect   = monthEls[0]
                             .getBoundingClientRect();
  const lastRect    = monthEls[11]
                             .getBoundingClientRect();

  // compute center X relative to wrapper's left
  const firstCenter = (firstRect.left   + firstRect.right) / 2
                      - wrapperRect.left;
  const lastCenter  = (lastRect.left    + lastRect.right) / 2
                      - wrapperRect.left;

  // interpolate
  const x = firstCenter + frac * (lastCenter - firstCenter);

  // position cursor (we keep translateX(-50%) so x is the center point)
  cursorEl.style.left = `${x}px`;
}

window.addEventListener("load", () => {
  populateDays();
  updateCursor();
});

window.addEventListener("resize", () => {
  updateCursor();
});
