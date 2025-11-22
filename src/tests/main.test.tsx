import { screen } from "@testing-library/dom";
import { expect, test } from "vitest";
import { withTestDatabase } from "../db/index.js";
import { app } from "../index.js";
import { renderRequest } from "../lib/test-utils.js";

test("renders the home page", async () => {
  await withTestDatabase(async () => {
    await renderRequest(async () => {
      return await app.request("/");
    });

    expect(screen.getByText("Hello, Hono!")).toBeInTheDocument();
  });
});
