import { describe, expect, it } from "vite-plus/test";

import { parseDiffRouteSearch, stripRightPanelSearchParams } from "./diffRouteSearch";

describe("parseDiffRouteSearch", () => {
  it("parses valid diff search values", () => {
    const parsed = parseDiffRouteSearch({
      diff: "1",
      diffTurnId: "turn-1",
      diffFilePath: "src/app.ts",
    });

    expect(parsed).toEqual({
      diff: "1",
      diffTurnId: "turn-1",
      diffFilePath: "src/app.ts",
    });
  });

  it("treats numeric and boolean diff toggles as open", () => {
    expect(
      parseDiffRouteSearch({
        diff: 1,
        diffTurnId: "turn-1",
      }),
    ).toEqual({
      diff: "1",
      diffTurnId: "turn-1",
    });

    expect(
      parseDiffRouteSearch({
        diff: true,
        diffTurnId: "turn-1",
      }),
    ).toEqual({
      diff: "1",
      diffTurnId: "turn-1",
    });
  });

  it("drops turn and file values when diff is closed", () => {
    const parsed = parseDiffRouteSearch({
      diff: "0",
      diffTurnId: "turn-1",
      diffFilePath: "src/app.ts",
    });

    expect(parsed).toEqual({});
  });

  it("drops file value when turn is not selected", () => {
    const parsed = parseDiffRouteSearch({
      diff: "1",
      diffFilePath: "src/app.ts",
    });

    expect(parsed).toEqual({
      diff: "1",
    });
  });

  it("normalizes whitespace-only values", () => {
    const parsed = parseDiffRouteSearch({
      diff: "1",
      diffTurnId: "  ",
      diffFilePath: "  ",
    });

    expect(parsed).toEqual({
      diff: "1",
    });
  });

  it("parses editor file paths only while the editor is open", () => {
    expect(
      parseDiffRouteSearch({
        editor: "1",
        editorFile: "apps/web/src/ChatView.tsx",
      }),
    ).toEqual({
      editor: "1",
      editorFile: "apps/web/src/ChatView.tsx",
    });

    expect(
      parseDiffRouteSearch({
        editor: "0",
        editorFile: "apps/web/src/ChatView.tsx",
      }),
    ).toEqual({});
  });
});

describe("stripRightPanelSearchParams", () => {
  it("explicitly clears retained diff and editor params", () => {
    expect(
      stripRightPanelSearchParams({
        diff: "1",
        diffTurnId: "turn-1",
        diffFilePath: "src/app.ts",
        editor: "1",
        editorFile: "src/app.ts",
        unrelated: "keep",
      }),
    ).toEqual({
      diff: undefined,
      diffTurnId: undefined,
      diffFilePath: undefined,
      editor: undefined,
      editorFile: undefined,
      unrelated: "keep",
    });
  });
});
