/* 두 페이지(레시피 · 복숭아)가 같이 쓰는 화면 동작. 고치면 각 페이지의 app.js?v= 숫자를 하나 올린다. */
(function () {
  "use strict";

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function norm(s) { return String(s == null ? "" : s).replace(/\s+/g, "").toLowerCase(); }
  /* 2026-08-19 → 2026.08.19 */
  function fmtDate(iso) { if (!iso) return ""; var p = String(iso).split("-"); return p[0] + "." + p[1] + (p[2] ? "." + p[2] : ""); }
  function won(n) { return n > 0 ? Number(n).toLocaleString("ko-KR") + "원" : ""; }
  function stars(n) { return n > 0 ? '<span class="stars" role="img" aria-label="별점 ' + n + '점">' + "★".repeat(n) + "☆".repeat(5 - n) + "</span>" : ""; }

  var ICONS = {
    meal: '<path class="f" d="M3.5 11h17a8.5 7.5 0 0 1-17 0z"/><path d="M9 21h6M9.5 3.5c-1 1 1 2 0 3.5M14.5 3.5c-1 1 1 2 0 3.5"/>',
    dessert: '<path class="f" d="M5 19.5h14l-2.2-8.8H7.2z"/><path d="M7.2 10.7c.5-2.7 2.4-4.2 4.8-4.2s4.3 1.5 4.8 4.2M12 6.5V5.2"/><circle cx="12" cy="3.9" r="1.3"/>',
    drink: '<path class="f" d="M6.5 8.5h11l-1.3 11.3a1.5 1.5 0 0 1-1.5 1.2H9.3a1.5 1.5 0 0 1-1.5-1.2z"/><path d="M5 8.5h14M12.5 8.5l1.6-5.5h3"/>',
    peach: '<path class="f" d="M12 8c-4-2.2-8.5.2-8.5 5.1 0 4.4 3.8 7.9 8.5 7.9s8.5-3.5 8.5-7.9c0-4.9-4.5-7.3-8.5-5.1z"/><path d="M12 8c-1.2 3.8-1.2 8.6 0 13"/><path class="f" d="M12 8c-.8-2.6-2.9-4-5.6-3.8.6 2.7 2.8 4 5.6 3.8z"/>',
    farm: '<path class="f" d="M5 10v10.5h14V10l-7-5.5z"/><path d="M3 11.5l9-7 9 7M10 20.5V15h4v5.5"/>',
    note: '<rect class="f" x="5" y="3.5" width="14" height="17" rx="2.5"/><path d="M12 8.3l1.1 2.3 2.5.4-1.8 1.7.4 2.5-2.2-1.2-2.2 1.2.4-2.5-1.8-1.7 2.5-.4z"/>',
    chef: '<path class="f" d="M7 15c-2.6-.5-3.8-2.6-3.2-4.6.6-2 2.8-3 4.6-2.2C9 5.9 10.4 4.5 12 4.5s3 1.4 3.6 3.7c1.8-.8 4 .2 4.6 2.2.6 2-.6 4.1-3.2 4.6V20H7z"/><path d="M7 16.5h10"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>'
  };
  function icon(name, cls) { return '<svg class="icon' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || "") + "</svg>"; }

  /* ＋ 줄. inner가 true면 한 단계 안쪽 줄, card가 true면 통째로 열리는 단일 카드 */
  function fold(o) {
    var cls = o.card ? "fold row card card-fold" : o.inner ? "fold inner" : "fold row";
    return '<details class="' + cls + '" id="' + esc(o.id) + '"><summary>' +
      '<span class="fold-text"><span class="fold-name">' + esc(o.name) + "</span>" +
      (o.sum ? '<span class="fold-sum">' + esc(o.sum) + "</span>" : "") +
      (o.info ? '<span class="fold-info">' + esc(o.info) + "</span>" : "") + "</span>" +
      (o.date ? '<span class="fold-date">' + esc(o.date) + "</span>" : "") +
      (o.badge ? '<span class="badge">' + esc(o.badge) + "</span>" : "") +
      '<span class="pm" aria-hidden="true"></span></summary><div class="fold-body">' + o.body + "</div></details>";
  }
  function innerList(rows) { return rows.length ? '<div class="inner-list">' + rows.join("") + "</div>" : ""; }
  function guide(html) { return '<div class="guide">' + html + "</div>"; }
  function card(o) {
    return '<article class="card" id="' + esc(o.id) + '"><header class="card-head"><div class="card-title">' + (o.icon ? icon(o.icon) : "") +
      "<h2>" + esc(o.title) + "</h2>" + (o.badge ? '<span class="badge">' + esc(o.badge) + "</span>" : "") + "</div></header>" +
      (o.rows.length ? o.rows.join("") : '<p class="empty">' + esc(o.empty || "내용이 없습니다") + "</p>") + "</article>";
  }
  /* 화면 안 링크. go = { tab, sub, open: [펼칠 줄 id들] } */
  function link(text, go) { return '<a href="#' + esc(go.open[go.open.length - 1]) + '" data-go="' + esc(JSON.stringify(go)) + '">' + esc(text) + "</a>"; }

  function start(cfg) {
    var main = document.getElementById("app");
    var bar = document.getElementById("tabbar");
    var root = document.documentElement;
    var state = { tab: null, sub: {} };
    var hits = [];

    function tabById(id) { for (var i = 0; i < cfg.tabs.length; i++) if (cfg.tabs[i].id === id) return cfg.tabs[i]; return null; }

    var html = '<div class="search" role="search">' + icon("search") +
      '<input type="search" id="q" enterkeyhint="search" autocomplete="off" placeholder="' + esc(cfg.searchLabel) + '" aria-label="' + esc(cfg.searchLabel) + '" />' +
      '<button type="button" id="q-clear" aria-label="검색어 지우기" hidden>×</button></div><section id="results" hidden></section>';
    cfg.tabs.forEach(function (t) {
      html += '<section class="view" id="view-' + t.id + '" aria-label="' + esc(t.label) + '" hidden>';
      if (t.subs) {
        html += '<div class="subtabs" role="tablist" aria-label="' + esc(t.label) + ' 나누기">' + t.subs.map(function (s) {
          return '<button type="button" class="subtab" role="tab" data-sub="' + esc(s.id) + '" aria-selected="false">' + esc(s.label) + (s.count != null ? "<span>" + s.count + "</span>" : "") + "</button>";
        }).join("") + "</div>";
        html += t.subs.map(function (s) { return '<div class="cards subpanel" data-subpanel="' + esc(s.id) + '" hidden>' + s.html + "</div>"; }).join("");
      } else {
        html += '<div class="cards">' + t.html + "</div>";
      }
      html += "</section>";
    });
    main.innerHTML = html;
    bar.innerHTML = '<div class="tabs" role="tablist">' + cfg.tabs.map(function (t) {
      return '<button type="button" class="tab" role="tab" data-tab="' + esc(t.id) + '" aria-selected="false">' + icon(t.icon) + "<span>" + esc(t.label) + "</span></button>";
    }).join("") + "</div>";

    var q = document.getElementById("q");
    var qClear = document.getElementById("q-clear");
    var results = document.getElementById("results");

    function stickPx() { return parseFloat(root.style.getPropertyValue("--stick")) || 0; }
    function setStick() {
      var view = document.getElementById("view-" + state.tab);
      var bar2 = view && !view.hidden ? view.querySelector(".subtabs") : null;
      root.style.setProperty("--stick", (bar2 ? bar2.offsetHeight : 0) + "px");
    }
    /* 펼친 첫 단계 제목 높이를 재서 안쪽 제목이 그 아래에 붙게 한다 */
    function measure(d) {
      var row = d.classList.contains("row") ? d : d.closest(".row");
      if (row && row.open) row.style.setProperty("--outer-h", row.firstElementChild.offsetHeight + "px");
    }
    /* 화면 위에 붙는 것들(서브 탭, 바깥쪽 펼친 제목) 높이 합 */
    function offsetFor(el) {
      var top = stickPx();
      var d = el.parentElement && el.parentElement.closest("details[open]");
      while (d) { top += d.firstElementChild.offsetHeight; d = d.parentElement && d.parentElement.closest("details[open]"); }
      return top;
    }

    function showSub(tabId, subId) {
      var t = tabById(tabId);
      if (!t.subs.some(function (s) { return s.id === subId; })) subId = t.subs[0].id;
      state.sub[tabId] = subId;
      store.set(cfg.key + ":sub:" + tabId, subId);
      var view = document.getElementById("view-" + tabId);
      view.querySelectorAll(".subpanel").forEach(function (p) { p.hidden = p.getAttribute("data-subpanel") !== subId; });
      view.querySelectorAll(".subtab").forEach(function (b) {
        var on = b.getAttribute("data-sub") === subId;
        b.setAttribute("aria-selected", on ? "true" : "false");
        if (on && b.scrollIntoView) b.parentElement.scrollLeft = b.offsetLeft - 16;
      });
    }
    function showTab(id) {
      if (!tabById(id)) id = cfg.tabs[0].id;
      state.tab = id;
      store.set(cfg.key + ":tab", id);
      cfg.tabs.forEach(function (t) { document.getElementById("view-" + t.id).hidden = t.id !== id || !results.hidden; });
      bar.querySelectorAll(".tab").forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-tab") === id ? "true" : "false"); });
      var t = tabById(id);
      if (t.subs) showSub(id, state.sub[id] || store.get(cfg.key + ":sub:" + id) || t.subs[0].id);
      setStick();
    }

    function runSearch() {
      var term = norm(q.value);
      qClear.hidden = !q.value;
      results.hidden = !term;
      document.getElementById("view-" + state.tab).hidden = !!term;
      setStick();
      if (!term) { results.innerHTML = ""; return; }
      var all = cfg.entries.filter(function (e) { return norm(e.text).indexOf(term) >= 0; });
      hits = all.slice(0, 40);
      results.innerHTML = '<h2 class="group-title">검색 결과 <span>' + all.length + "건</span></h2>" +
        '<div class="card">' + (hits.length ? hits.map(function (e, i) {
          return '<button type="button" class="hit" data-hit="' + i + '"><span class="fold-text"><span class="fold-name">' + esc(e.name) + "</span><small>" + esc(e.where) + '</small></span><span class="go" aria-hidden="true">›</span></button>';
        }).join("") : '<p class="empty">검색 결과가 없습니다</p>') + "</div>";
    }
    function clearSearch() { if (q.value) { q.value = ""; runSearch(); } }

    /* 검색 · 링크로 이동: 그 탭(과 서브 탭)으로 바꾸고, 접힌 줄을 펼쳐서 그 항목(focus가 있으면 그 자리)으로 간다 */
    function goTo(go) {
      clearSearch();
      showTab(go.tab);
      if (go.sub) showSub(go.tab, go.sub);
      var target = null;
      (go.open || []).forEach(function (id) {
        var d = document.getElementById(id);
        if (d && d.tagName === "DETAILS") { d.open = true; target = d; }
      });
      if (go.focus) target = document.getElementById(go.focus) || target;
      if (!target) return;
      requestAnimationFrame(function () {
        measure(target);
        var y = window.scrollY + target.getBoundingClientRect().top - offsetFor(target);
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        target.classList.remove("flash");
        void target.offsetWidth;
        target.classList.add("flash");
        setTimeout(function () { target.classList.remove("flash"); }, 1500);
      });
    }

    document.addEventListener("click", function (e) {
      var el = e.target.closest("[data-go]");
      if (el) { e.preventDefault(); goTo(JSON.parse(el.getAttribute("data-go"))); return; }
      el = e.target.closest(".fold > summary");
      if (el) {
        var d = el.parentElement;
        if (!d.open) return;
        /* 붙어 있던 제목을 눌러 접으면 화면을 제목 자리로 돌려놓는다 */
        e.preventDefault();
        var stuck = d.getBoundingClientRect().top < el.getBoundingClientRect().top - 1;
        d.open = false;
        if (stuck) window.scrollTo({ top: window.scrollY + d.getBoundingClientRect().top - offsetFor(d), behavior: "auto" });
        return;
      }
      el = e.target.closest(".tab");
      if (el) { clearSearch(); showTab(el.getAttribute("data-tab")); window.scrollTo({ top: 0, behavior: "auto" }); return; }
      el = e.target.closest(".subtab");
      if (el) {
        var view = document.getElementById("view-" + state.tab);
        showSub(state.tab, el.getAttribute("data-sub"));
        var top = window.scrollY + view.getBoundingClientRect().top;
        if (window.scrollY > top) window.scrollTo({ top: top, behavior: "auto" });
        return;
      }
      el = e.target.closest("[data-hit]");
      if (el) { goTo(hits[Number(el.getAttribute("data-hit"))].go); return; }
      if (e.target.closest("#q-clear")) { clearSearch(); q.focus(); }
    });
    document.addEventListener("toggle", function (e) {
      var d = e.target;
      if (d.classList && d.classList.contains("row") && d.open) measure(d);
    }, true);
    window.addEventListener("resize", function () {
      setStick();
      document.querySelectorAll(".row[open]").forEach(measure);
    });
    q.addEventListener("input", runSearch);

    showTab(store.get(cfg.key + ":tab") || cfg.tabs[0].id);
  }

  window.App = { esc: esc, norm: norm, fmtDate: fmtDate, won: won, stars: stars, icon: icon, fold: fold, innerList: innerList, guide: guide, card: card, link: link, start: start };
})();
