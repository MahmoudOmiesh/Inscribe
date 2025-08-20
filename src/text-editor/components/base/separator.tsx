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
        className="py-4"
      >
        <hr />
      </div>
    );
  },
);

Separator.displayName = "Separator";
