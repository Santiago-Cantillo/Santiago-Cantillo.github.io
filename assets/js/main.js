(function () {
  "use strict";

  var systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  function applySystemTheme(event) {
    document.documentElement.toggleAttribute("data-theme", event.matches);
  }

  function reserveFooterSpace() {
    var footer = document.querySelector(".page__footer");
    if (footer) {
      document.body.style.marginBottom = footer.offsetHeight + "px";
    }
  }

  function initializeAuthorLinks() {
    var button = document.querySelector(".author__urls-wrapper button");
    var links = document.querySelector(".author__urls");
    if (!button || !links) return;

    button.addEventListener("click", function () {
      var opening = window.getComputedStyle(links).display === "none";
      links.style.display = opening ? "block" : "none";
      button.classList.toggle("open", opening);
      button.setAttribute("aria-expanded", String(opening));
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 925) {
        links.style.removeProperty("display");
        button.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
      }
    });
  }

  function initializeSectionNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".masthead__nav a[data-section]"));
    var sections = links.map(function (link) {
      return document.getElementById(link.getAttribute("data-section"));
    });
    if (!links.length) return;

    function highlightCurrentSection() {
      var current = 0;
      var nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      sections.forEach(function (section, index) {
        if (section && (section.getBoundingClientRect().top <= 120 || nearBottom)) current = index;
      });
      links.forEach(function (link, index) {
        if (index === current) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    }

    highlightCurrentSection();
    window.addEventListener("scroll", highlightCurrentSection, { passive: true });
  }

  function initializeGitHubDates() {
    document.querySelectorAll("time[data-github-repo]").forEach(function (time) {
      fetch("https://api.github.com/repos/" + time.getAttribute("data-github-repo"))
        .then(function (response) { return response.ok ? response.json() : null; })
        .then(function (repo) {
          if (!repo || !repo.pushed_at) return;
          var date = new Date(repo.pushed_at);
          time.setAttribute("datetime", repo.pushed_at);
          time.textContent = date.toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric", timeZone: "UTC"
          });
        })
        .catch(function () {});
    });
  }

  applySystemTheme(systemTheme);
  systemTheme.addEventListener("change", applySystemTheme);

  document.addEventListener("DOMContentLoaded", function () {
    initializeAuthorLinks();
    initializeSectionNav();
    initializeGitHubDates();
    reserveFooterSpace();
  });
  window.addEventListener("resize", reserveFooterSpace);
}());
