import { createElement, type ReactNode } from "react";

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const isRenderProp = (val: any): val is (children: ReactNode) => ReactNode =>
  typeof val === "function";

export function interpolate(
  message: string,
  params?: Record<string, any>,
): ReactNode {
  const p = params || {};

  // UPDATED: Regex now matches {{var}}, {{ var }}, {{ var? }}
  const tokens = message.split(/(\{\{\s*[\w]+\??\s*\}\}|<[\w]+>|<\/[\w]+>)/g);

  const stack: ReactNode[][] = [[]];
  const tags: string[] = [];
  let elementKey = 0;

  tokens.forEach((token) => {
    if (!token) return;

    // UPDATED: Match the token and safely extract the variable name without spaces
    const varMatch = token.match(/^\{\{\s*(\w+)(\??)\s*\}\}$/);

    if (varMatch) {
      // HANDLE VARIABLES
      const key = varMatch[1]; // The variable name (e.g., "name")
      const isOptional = varMatch[2] === "?"; // True if it has a '?'
      const val = p[key];
      const currentChildren = stack[stack.length - 1];

      if (val !== undefined && val !== null) {
        currentChildren.push(val as ReactNode);
      } else {
        currentChildren.push(isOptional ? "" : token);
      }
    } else if (token.match(/^<(\w+)>$/)) {
      // OPEN TAG
      const rawTagName = token.slice(1, -1);
      const tagName = rawTagName.toLowerCase();
      const currentChildren = stack[stack.length - 1];

      if (VOID_ELEMENTS.has(tagName)) {
        const renderFn = p[rawTagName] || p[tagName];
        if (isRenderProp(renderFn)) {
          currentChildren.push(renderFn(""));
        } else {
          currentChildren.push(
            createElement(tagName, { key: `tag-${elementKey++}` }),
          );
        }
        return;
      }

      tags.push(tagName);
      stack.push([]);
    } else if (token.match(/^<\/(\w+)>$/)) {
      // CLOSE TAG
      const rawTagName = token.slice(2, -1);
      const tagName = rawTagName.toLowerCase();

      if (VOID_ELEMENTS.has(tagName)) {
        return;
      }

      if (tags.length === 0 || tags[tags.length - 1] !== tagName) {
        stack[stack.length - 1].push(token);
        return;
      }

      tags.pop();
      const children = stack.pop()!;
      const renderFn = p[rawTagName] || p[tagName];
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
      // PLAIN TEXT
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
