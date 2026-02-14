import type { ReactNode } from "react";

// Helper to check if a param is a render function
const isRenderProp = (val: any): val is (children: ReactNode) => ReactNode =>
  typeof val === "function";

export function interpolate(
  message: string,
  params?: Record<string, any>,
): ReactNode {
  if (!params) return message;

  // Split into tokens: {var}, <tag>, </tag>, or text
  const tokens = message.split(/(\{[\w]+\}|<[\w]+>|<\/[\w]+>)/g);

  const stack: ReactNode[][] = [[]]; // Stack of children arrays
  const tags: string[] = []; // Stack of open tags

  tokens.forEach((token) => {
    if (!token) return;

    if (token.match(/^\{(\w+)\}$/)) {
      // Case 1: Variable {name}
      const key = token.slice(1, -1);
      const val = params[key];
      const currentChildren = stack[stack.length - 1];

      if (val !== undefined && val !== null) {
        // If it's a function (component), call it? Usually {var} is primitive.
        // We push as-is to let React handle it (string/number).
        currentChildren.push(val as ReactNode);
      } else {
        currentChildren.push(token);
      }
    } else if (token.match(/^<(\w+)>$/)) {
      // Case 2: Open Tag <bold>
      const tagName = token.slice(1, -1);
      tags.push(tagName);
      stack.push([]); // Start new context
    } else if (token.match(/^<\/(\w+)>$/)) {
      // Case 3: Close Tag </bold>
      const tagName = token.slice(2, -1);

      // Mismatch check (simple validation)
      if (tags.length === 0 || tags[tags.length - 1] !== tagName) {
        stack[stack.length - 1].push(token); // Treat as text
        return;
      }

      tags.pop();
      const children = stack.pop()!;
      const renderFn = params[tagName];

      // If single string child, unwrap it (cleaner DOM)
      const content =
        children.length === 1 && typeof children[0] === "string"
          ? children[0]
          : children;

      const currentChildren = stack[stack.length - 1];

      if (isRenderProp(renderFn)) {
        currentChildren.push(renderFn(content));
      } else {
        // Fallback: If no function provided, just render children (strip tags)
        currentChildren.push(...children);
      }
    } else {
      // Case 4: Plain Text
      stack[stack.length - 1].push(token);
    }
  });

  // Flush remaining items
  while (stack.length > 1) {
    const children = stack.pop()!;
    stack[stack.length - 1].push(...children);
  }

  const result = stack[0];
  // Return single item if possible, else array
  return result.length === 1 ? result[0] : result;
}
