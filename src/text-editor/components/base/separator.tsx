import { memo } from "react";
import type { SeparatorNode } from "../../model/schema";
import type { GetReferenceProps, SetReference } from "./general-node";

export const Separator = memo(
  ({
    node,
    setReference,
    getReferenceProps,
  }: {
    node: SeparatorNode;
    setReference: SetReference;
    getReferenceProps: GetReferenceProps;
  }) => {
    return (
      <div
        {...getReferenceProps()}
        ref={setReference}
        contentEditable={false}
        data-node-id={node.id}
        tabIndex={-1}
        className="my-[var(--editor-separator-my)] py-[var(--editor-separator-py)] select-none"
      >
        <hr contentEditable={false} />
      </div>
    );
  },
);

Separator.displayName = "Separator";
