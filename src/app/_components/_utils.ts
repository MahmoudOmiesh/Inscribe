function getCaretOffsetInNode(nodeId: string) {
  const node = document.querySelector(`[data-node-id="${nodeId}"]`);
  if (!node) return 0;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return 0;

  const range = selection.getRangeAt(0);
  const preCaretRange = range.cloneRange();

  preCaretRange.selectNodeContents(node);
  preCaretRange.setEnd(range.endContainer, range.endOffset);

  const caretOffset = preCaretRange.toString().length;
  return caretOffset;
}

function moveCaretToNode(node: Node, offset: number) {
  const range = document.createRange();
  range.setStart(node, offset);
  range.collapse(true);

  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}

function moveCaret(nodeId: string, offset = 0) {
  const node = document.querySelector(`[data-node-id="${nodeId}"]`);
  if (!node) return;

  let currentOffset = 0;

  function traverseNodes(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const textLength = node.textContent?.length ?? 0;
      if (currentOffset + textLength >= offset) {
        moveCaretToNode(node, offset - currentOffset);
        return true;
      } else {
        currentOffset += textLength;
      }
    } else {
      for (const child of node.childNodes) {
        if (child && traverseNodes(child)) {
          return true;
        }
      }
    }
    return false; // Not found in this branch
  }

  if (offset === 0) {
    moveCaretToNode(node, 0);
  } else {
    traverseNodes(node);
  }
}

function getNodeEndOffset(node: EditorNode) {
  return node.children.reduce((acc, child) => acc + child.text.length, 0);
}

function deleteCharacter(node: EditorNode, offset: number) {
  let currentOffset = 0;
  const newChildren = node.children.map((child) => {
    const combinedOffset = currentOffset + child.text.length;
    let ret;
    if (combinedOffset >= offset && currentOffset < offset) {
      const newText =
        child.text.slice(0, offset - currentOffset - 1) +
        child.text.slice(offset - currentOffset);
      ret =
        newText.length > 0
          ? {
              ...child,
              text: newText,
            }
          : undefined;
    } else {
      ret = child;
    }
    currentOffset += child.text.length;
    return ret;
  });

  return {
    ...node,
    children: newChildren.filter((c) => c !== undefined),
  };
}

function addCharacter(node: EditorNode, char: string, offset: number) {
  let currentOffset = 0;
  const newChildren =
    node.children.length > 0
      ? node.children.map((child) => {
          const combinedOffset = currentOffset + child.text.length;
          let ret;

          if (combinedOffset >= offset && currentOffset < offset) {
            const newText =
              child.text.slice(0, offset - currentOffset) +
              char +
              child.text.slice(offset - currentOffset);
            ret = {
              ...child,
              text: newText,
            };
          } else {
            ret = child;
          }

          currentOffset += child.text.length;
          return ret;
        })
      : [
          {
            type: "text" as const,
            text: char,
          },
        ];

  return {
    ...node,
    children: newChildren.filter((c) => c !== undefined),
  };
}

function mergeNodes(node: EditorNode, prevNode: EditorNode) {
  return {
    ...prevNode,
    children: [...prevNode.children, ...node.children],
  };
}

function splitNode(node: EditorNode, offset: number) {
  const left: EditorNode = {
    id: node.id,
    type: node.type,
    children: [],
  };
  const right: EditorNode = {
    id: crypto.randomUUID(),
    type: node.type,
    children: [],
  };

  let currentOffset = 0;
  node.children.forEach((child) => {
    const combinedOffset = currentOffset + child.text.length;
    if (combinedOffset < offset) {
      left.children.push(child);
    }
    if (combinedOffset >= offset && currentOffset <= offset) {
      const leftText = child.text.slice(0, offset - currentOffset);
      const rightText = child.text.slice(offset - currentOffset);
      if (leftText.length > 0) {
        left.children.push({
          ...child,
          text: leftText,
        });
      }
      if (rightText.length > 0) {
        right.children.push({
          ...child,
          text: rightText,
        });
      }
    }
    if (currentOffset > offset) {
      right.children.push(child);
    }

    currentOffset += child.text.length;
  });

  return [left, right] as const;
}

function getCaretOffsetInNode(nodeId: string) {
  const node = document.querySelector(`[data-node-id="${nodeId}"]`);
  if (!node) return 0;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return 0;

  const range = selection.getRangeAt(0);
  const preCaretRange = range.cloneRange();

  preCaretRange.selectNodeContents(node);
  preCaretRange.setEnd(range.endContainer, range.endOffset);

  const caretOffset = preCaretRange.toString().length;
  return caretOffset;
}
