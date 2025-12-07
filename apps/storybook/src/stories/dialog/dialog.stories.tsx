import { Dialog } from "@rnt-lib/core";
import { useState } from "react";
import preview from "@/preview";

function DialogComponent(props: Omit<React.ComponentProps<typeof Dialog>, "open" | "onClose">) {
  const [_open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)} type="button">
        Open
      </button>
      <Dialog onClose={() => setOpen(false)} {...props} open={_open} />
    </div>
  );
}

const meta = preview.meta({ component: DialogComponent, title: "Dialog", tags: ["autodocs"] });

export default meta;

export const Primary = meta.story({
  args: {
    children: "This is a dialog",
  },
});

export const Dismissable = meta.story({
  args: {
    children: "This is a dialog with a title",
    closedBy: "any",
  },
});
