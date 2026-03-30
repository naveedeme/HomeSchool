/*
  Compatibility entry kept for repo visibility.
  The maintained JSX implementation now lives in /js/app.js
  so the static HTML file can stay clean and directly runnable.
*/

const CompatHomeSchoolApp = window.HomeSchoolAppModule?.HomeschoolApp;

if (
  CompatHomeSchoolApp &&
  document.getElementById("root") &&
  !window.__HOME_SCHOOL_BOOTSTRAPPED__
) {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<CompatHomeSchoolApp />);
  window.__HOME_SCHOOL_BOOTSTRAPPED__ = true;
}
