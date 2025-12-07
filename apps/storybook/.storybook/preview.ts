// import chromaticAddon from "@chromatic-com/storybook";
import addonA11y from "@storybook/addon-a11y";
import docsAddon from "@storybook/addon-docs";
import vitestAddon from "@storybook/addon-vitest";
import { definePreview } from "@storybook/react-vite";

export default definePreview({
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  addons: [
    //chromaticAddon(),
    docsAddon(),
    addonA11y(),
    vitestAddon(),
  ],
});
