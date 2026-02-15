import { createElement, type ReactNode } from "react";

const isRenderProp = (val: any): val is (children: ReactNode) => ReactNode =>
  typeof val === "function";

export function interpolate(
  message: string,
  params?: Record<string, any>,
): ReactNode {
  const p = params || {};
  const tokens = message.split(/(\{[\w]+\??\}|<[\w]+>|<\/[\w]+>)/g);

  const stack: ReactNode[][] = [[]];
  const tags: string[] = [];
  let elementKey = 0;

  tokens.forEach((token) => {
    if (!token) return;

    if (token.match(/^\{(\w+)\??\}$/)) {
      const isOptional = token.endsWith("?}");
      const key = token.slice(1, isOptional ? -2 : -1);
      const val = p[key];
      const currentChildren = stack[stack.length - 1];

      if (val !== undefined && val !== null) {
        currentChildren.push(val as ReactNode);
      } else {
        currentChildren.push(isOptional ? "" : token);
      }
    } else if (token.match(/^<(\w+)>$/)) {
      const tagName = token.slice(1, -1);
      tags.push(tagName);
      stack.push([]);
    } else if (token.match(/^<\/(\w+)>$/)) {
      const tagName = token.slice(2, -1);

      if (tags.length === 0 || tags[tags.length - 1] !== tagName) {
        stack[stack.length - 1].push(token);
        return;
      }

      tags.pop();
      const children = stack.pop()!;
      const renderFn = p[tagName];
      const currentChildren = stack[stack.length - 1];

      if (isRenderProp(renderFn)) {
        const content =
          children.length === 1 && typeof children[0] === "string"
            ? children[0]
            : children;
        currentChildren.push(renderFn(content));
      } else {
        currentChildren.push(
          createElement(tagName, { key: `tag-${elementKey++}` }, ...children),
        );
      }
    } else {
      stack[stack.length - 1].push(token);
    }
  });

  while (stack.length > 1) {
    const children = stack.pop()!;
    const tagName = tags.pop()!;
    stack[stack.length - 1].push(
      createElement(tagName, { key: `tag-${elementKey++}` }, ...children),
    );
  }

  const result = stack[0];
  return result.length === 1 ? result[0] : result;
}
