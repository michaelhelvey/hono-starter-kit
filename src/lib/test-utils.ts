import assert from "node:assert/strict";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import "@testing-library/jest-dom/vitest";

GlobalRegistrator.register({
  settings: {
    disableCSSFileLoading: true,
    disableJavaScriptFileLoading: true,
  },
});

type RenderRequestFn = () => Promise<Response> | Response;

export async function renderRequest(renderRequestFn: RenderRequestFn): Promise<void> {
  const response = await renderRequestFn();

  assert.equal(
    response.status,
    200,
    "to render the request to the DOM, the response must be a 200 OK",
  );
  assert.match(
    response.headers.get("content-type") ?? "",
    /text\/html/,
    "to render the request to the DOM, the response must have a content-type of text/html",
  );

  // for some reason, in order to use @testing-library/dom's `screen` object, we
  // have to set the _body_ specifically, not the entire document.
  const body = await response.text();
  const doc = new DOMParser().parseFromString(body, "text/html");
  document.body.innerHTML = doc.body.innerHTML;
}
