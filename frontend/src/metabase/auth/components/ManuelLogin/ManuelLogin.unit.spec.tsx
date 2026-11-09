import fetchMock from "fetch-mock";

import {
  setupPropertiesEndpoints,
  setupSessionHandoffExchangeEndpoint,
} from "__support__/server-mocks";
import { renderWithProviders, screen, waitFor } from "__support__/ui";
import { Route } from "metabase/router";
import * as domUtils from "metabase/utils/dom";
import { createMockSettings } from "metabase-types/api/mocks";

import { ManuelLogin } from "./ManuelLogin";

const EXCHANGE_PATH = "path:/api/session/handoff/exchange";

interface SetupOpts {
  search?: string;
  status?: number;
}

const setup = ({ search = "", status = 200 }: SetupOpts = {}) => {
  setupPropertiesEndpoints(createMockSettings());
  setupSessionHandoffExchangeEndpoint({ status });
  const replaceLocation = jest
    .spyOn(domUtils, "replaceLocation")
    .mockImplementation(() => undefined);

  renderWithProviders(<Route path="/auth/manuel" element={<ManuelLogin />} />, {
    withRouter: true,
    initialRoute: `/auth/manuel${search}`,
  });

  return { replaceLocation };
};

describe("ManuelLogin", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    document.cookie =
      "metabase.SESSION=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });

  it("exchanges the code once and leaves the page without keeping its URL in history", async () => {
    const { replaceLocation } = setup({ search: "?code=the-code" });

    await waitFor(() => expect(replaceLocation).toHaveBeenCalledWith("/"));

    const calls = fetchMock.callHistory.calls(EXCHANGE_PATH);
    expect(calls).toHaveLength(1);
    const body: unknown = JSON.parse(String(calls[0].options.body));
    expect(body).toEqual({ code: "the-code" });
  });

  it("shows a way back when the code is rejected", async () => {
    const { replaceLocation } = setup({
      search: "?code=spent-code",
      status: 401,
    });

    expect(
      await screen.findByText("Please continue at Manuel.Ai"),
    ).toBeInTheDocument();
    expect(replaceLocation).not.toHaveBeenCalled();
  });

  it("no longer accepts a session token from the URL", async () => {
    const { replaceLocation } = setup({ search: "?session=stolen-token" });

    expect(
      await screen.findByText("Please continue at Manuel.Ai"),
    ).toBeInTheDocument();
    expect(document.cookie).not.toContain("stolen-token");
    expect(fetchMock.callHistory.called(EXCHANGE_PATH)).toBe(false);
    expect(replaceLocation).not.toHaveBeenCalled();
  });
});
