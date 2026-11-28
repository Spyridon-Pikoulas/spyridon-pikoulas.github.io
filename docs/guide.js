// The product guides (`_layouts/guide.html`): this page's headings in the sidebar, callouts from
// GitHub's > [!NOTE] quotes, copy buttons on code, figures that enlarge, heading links.
(() => {
  const article = document.querySelector(".guide article");
  if (!article) return;

  // The contents: open beside the page, folded above it on a phone
  const contents = document.querySelector(".contents");
  const wide = matchMedia("(min-width: 901px)");
  const fold = () => { contents.open = wide.matches; };
  fold();
  wide.addEventListener("change", fold);

  // This page's headings under its entry, the one being read marked
  const toc = document.querySelector(".toc");
  const heads = [...article.querySelectorAll("h2[id], h3[id]")];
  if (toc && heads.length > 1) {
    for (const h of heads) {
      const li = document.createElement("li");
      li.className = h.tagName.toLowerCase();
      const a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      li.append(a);
      toc.append(li);
    }
    toc.hidden = false;
    const links = [...toc.querySelectorAll("a")];
    // A heading is the one read once it passes 120 px from the top. The page's last headings can sit
    // too near its end to get there, so when the last can't, those in the last half-screen of
    // scrolling share it evenly in their order, the last at the very bottom (USER, 13 Nov: FAQ and
    // Still stuck never lit).
    const mark = () => {
      const y = scrollY;
      const reach = document.documentElement.scrollHeight - innerHeight;
      const at = heads.map((h) => h.getBoundingClientRect().top + y - 120);
      const from = Math.max(0, reach - innerHeight / 2);
      const first = at.findIndex((s) => s > from);
      if (at[at.length - 1] > reach && first >= 0) {
        const n = at.length - first;
        for (let j = 0; j < n; j++) at[first + j] = from + (reach - from) * (j + 1) / n;
      }
      let on = 0;
      at.forEach((s, i) => { if (s <= y + 1) on = i; });
      links.forEach((a, i) => a.classList.toggle("on", i === on));
    };
    addEventListener("scroll", mark, { passive: true });
    addEventListener("resize", mark);
    addEventListener("load", mark);
    mark();
  }
  for (const h of heads) {
    const a = document.createElement("a");
    a.className = "anchor";
    a.href = "#" + h.id;
    a.setAttribute("aria-label", "Link to this section");
    a.textContent = "#";
    h.append(a);
  }

  // > [!NOTE] / [!TIP] / [!WARNING] / [!IMPORTANT] / [!CAUTION]; quotes run together are split at each
  const kinds = { NOTE: "Note", TIP: "Tip", IMPORTANT: "Important", WARNING: "Warning", CAUTION: "Warning" };
  const marker = /^\s*\[!(\w+)\]\s*(<br\s*\/?>)?\s*/;
  for (const q of [...article.querySelectorAll("blockquote")]) {
    let box = null;
    for (const child of [...q.children]) {
      const m = child.tagName === "P" && child.innerHTML.match(marker);
      if (m && kinds[m[1]]) {
        box = document.createElement("blockquote");
        box.className = "callout " + kinds[m[1]].toLowerCase();
        const title = document.createElement("span");
        title.className = "callout-title";
        title.textContent = kinds[m[1]];
        box.append(title);
        q.before(box);
        child.innerHTML = child.innerHTML.slice(m[0].length);
        if (!child.innerHTML.trim()) { child.remove(); continue; }
      }
      if (box) box.append(child);
    }
    if (!q.children.length) q.remove();
  }

  // Code: a bar with its kind and a copy button
  const names = { console: "Console", powershell: "PowerShell", cpp: "C++", ini: "Config", python: "Python", qds: "Dialogue script" };
  for (const pre of article.querySelectorAll("pre")) {
    const box = pre.closest("div.highlighter-rouge") || pre;
    const lang = ((box.className + " " + (pre.querySelector("code")?.className || "")).match(/language-(\w+)/) || [])[1] || "";
    const wrap = document.createElement("div");
    wrap.className = "code " + lang;
    box.replaceWith(wrap);
    const bar = document.createElement("div");
    bar.className = "code-bar";
    const label = document.createElement("span");
    label.textContent = names[lang] || (lang && lang !== "plaintext" && lang !== "text" ? lang : "");
    const copy = document.createElement("button");
    copy.type = "button";
    copy.textContent = "Copy";
    copy.addEventListener("click", async () => {
      const text = pre.innerText.replace(/\n$/, "");
      try { await navigator.clipboard.writeText(text); copy.textContent = "Copied"; }
      catch { copy.textContent = "Select and copy"; }
      setTimeout(() => { copy.textContent = "Copy"; }, 1600);
    });
    bar.append(label, copy);
    wrap.append(bar, box);
  }

  // Figures: a click shows the picture at full size
  const zoom = document.querySelector(".zoom");
  const big = zoom.querySelector("img");
  for (const a of article.querySelectorAll("figure.shot > a")) {
    a.addEventListener("click", (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || !zoom.showModal) return;
      e.preventDefault();
      const img = a.querySelector("img");
      big.src = a.href;
      big.alt = img.alt;
      zoom.showModal();
    });
  }
  zoom.addEventListener("click", (e) => { if (e.target === zoom || e.target === big) zoom.close(); });
})();
