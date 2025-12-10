import "./commands";

Cypress.on("uncaught:exception", (err, runnable) => {
  if (err.message.includes("ResizeObserver")) {
    return false;
  }
  if (err.message.includes("Unexpected end of JSON input")) {
    return false;
  }
  if (err.message.includes("Failed to execute 'json' on 'Response'")) {
    return false;
  }
  return true;
});
