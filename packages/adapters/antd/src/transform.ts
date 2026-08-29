import type {
  API,
  ASTPath,
  FileInfo,
  JSXAttribute,
  JSXElement,
  JSXExpressionContainer,
  JSXOpeningElement,
  Options,
} from "jscodeshift";

/**
 * Migrates rebar-ui usage to Ant Design v6. Scope is deliberately bounded to what's safe to
 * automate — see packages/adapters/antd/README.md for exactly what this does and does not
 * handle, and ref/ARCHITECTURE.md#migration-adapters for why this exists as a template rather
 * than a one-off. Verified against the live v6 API docs (ant.design/components/*), not assumed:
 * v6 renamed Alert's `message` prop back to `title` (matching Rebar's own name, so no rename is
 * needed there anymore) and standardized size enums to `small`/`medium`/`large` (`middle` is
 * deprecated). Everything else this codemod touches — Modal's `onCancel`, Checkbox's
 * `CheckboxChangeEvent`, Tooltip's `title` prop — was checked directly and is unchanged from v5.
 */

const DIRECT_RENAME: Record<string, string> = {
  Dialog: "Modal",
};

const SAME_NAME = new Set([
  "Button",
  "Input",
  "Card",
  "Alert",
  "Form",
  "Checkbox",
  "Radio",
  "Switch",
  "Select",
  "Slider",
  "Tooltip",
]);

const MEMBER_RENAME: Record<string, { object: string; property: string }> = {
  FormItem: { object: "Form", property: "Item" },
  RadioGroup: { object: "Radio", property: "Group" },
};

// Deliberately not migrated in v1 — either AntD has no direct equivalent (Box/Stack/Text/
// Heading), the composition shape is too different to flatten safely at the syntax level
// (Tabs' composition vs. AntD's items-array; Accordion/AccordionItem vs. Collapse's
// items-array), the prop shape is structurally incompatible rather than just differently
// named (Popover/Dropdown: our `trigger` prop holds an element, AntD's `trigger` prop is an
// interaction-mode string with the element as children instead — a naive rename would
// produce broken code, not just oddly-named code), the values need computing rather than
// renaming (Progress: AntD's `percent` assumes 0-100, ours has a separate `max` that isn't
// necessarily 100), the prop is structurally different (Avatar: AntD's fallback is children,
// ours is a `fallback` prop), or the two libraries don't even share a paradigm (Toast: AntD's
// message/notification APIs are imperative function calls, not a component you render).
const NOT_MIGRATED = new Set([
  "Box",
  "Stack",
  "Text",
  "Heading",
  "Tabs",
  "Tab",
  "TabList",
  "TabPanel",
  "Popover",
  "Dropdown",
  "Progress",
  "Avatar",
  "Accordion",
  "AccordionItem",
  "Toast",
  "ToastProvider",
]);

const BUTTON_VARIANT_TO_TYPE: Record<string, string> = {
  primary: "primary",
  secondary: "default",
  tertiary: "text",
};

const SIZE_MAP: Record<string, string> = { sm: "small", md: "medium", lg: "large" };

const REVIEW_COMMENT_ON_CANCEL =
  " rebar-migrate: AntD's onCancel takes no argument, unlike onOpenChange(open: boolean) — review this handler.";

const REVIEW_COMMENT_CHECKBOX_ONCHANGE =
  " rebar-migrate: AntD's onChange receives a CheckboxChangeEvent (checked is e.target.checked), unlike onCheckedChange(checked: boolean) — review this handler.";

const REVIEW_COMMENT_RADIO_ONCHANGE =
  " rebar-migrate: AntD's Radio.Group onChange receives a RadioChangeEvent (value is e.target.value), unlike onValueChange(value: string) — review this handler.";

function transform(fileInfo: FileInfo, api: API, _options: Options): string | undefined {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  const rebarImport = root
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === "rebar-ui")
    .at(0);

  if (rebarImport.size() === 0) {
    return undefined;
  }

  const importPath = rebarImport.paths()[0]!;
  const specifiers = importPath.node.specifiers ?? [];

  const keptSpecifiers: typeof specifiers = [];
  const antdSpecifierNames = new Map<string, string>(); // local name -> imported name
  const renames: Array<{ from: string; to: string }> = [];
  const memberRenames: Array<{ from: string; objectLocal: string; property: string }> = [];

  let formLocalName: string | null = null;
  for (const spec of specifiers) {
    if (spec.type === "ImportSpecifier" && spec.imported.name === "Form") {
      formLocalName = spec.local?.name ?? spec.imported.name;
    }
  }

  for (const spec of specifiers) {
    if (spec.type !== "ImportSpecifier") {
      keptSpecifiers.push(spec);
      continue;
    }

    const importedName = spec.imported.name;
    const localName = spec.local?.name ?? importedName;

    if (NOT_MIGRATED.has(importedName)) {
      keptSpecifiers.push(spec);
      continue;
    }

    if (importedName in DIRECT_RENAME) {
      const newName = DIRECT_RENAME[importedName]!;
      antdSpecifierNames.set(newName, newName);
      renames.push({ from: localName, to: newName });
      continue;
    }

    if (importedName in MEMBER_RENAME) {
      const { object, property } = MEMBER_RENAME[importedName]!;
      if (!formLocalName) formLocalName = object;
      antdSpecifierNames.set(formLocalName, object);
      memberRenames.push({ from: localName, objectLocal: formLocalName, property });
      continue;
    }

    if (SAME_NAME.has(importedName)) {
      antdSpecifierNames.set(localName, importedName);
      continue;
    }

    // Unknown specifier from rebar-ui: leave it where it was rather than guess.
    keptSpecifiers.push(spec);
  }

  // Rewrite or remove the original rebar-ui import.
  if (keptSpecifiers.length === 0) {
    j(importPath).remove();
  } else {
    importPath.node.specifiers = keptSpecifiers;
  }

  // Merge migrated specifiers into an existing `antd` import, or insert a new one.
  if (antdSpecifierNames.size > 0) {
    const existingAntdImport = root
      .find(j.ImportDeclaration)
      .filter((path) => path.node.source.value === "antd")
      .at(0);

    const newSpecifierNodes = Array.from(antdSpecifierNames.entries()).map(([local, imported]) =>
      local === imported
        ? j.importSpecifier(j.identifier(imported))
        : j.importSpecifier(j.identifier(imported), j.identifier(local)),
    );

    if (existingAntdImport.size() > 0) {
      const existing = existingAntdImport.paths()[0]!;
      const existingLocalNames = new Set(
        (existing.node.specifiers ?? [])
          .filter((s): s is typeof s & { type: "ImportSpecifier" } => s.type === "ImportSpecifier")
          .map((s) => s.local?.name ?? s.imported.name),
      );
      for (const node of newSpecifierNodes) {
        const localName = node.local?.name ?? node.imported.name;
        if (!existingLocalNames.has(localName)) {
          existing.node.specifiers = [...(existing.node.specifiers ?? []), node];
        }
      }
    } else {
      const newImport = j.importDeclaration(newSpecifierNodes, j.literal("antd"));
      j(importPath.node.type === "ImportDeclaration" && keptSpecifiers.length === 0 ? importPath : importPath).insertAfter(
        newImport,
      );
    }
  }

  // Rename JSX tag usages for direct (identifier -> identifier) renames.
  for (const { from, to } of renames) {
    root
      .find(j.JSXIdentifier, { name: from })
      .filter((path) => {
        const parent = path.parent.node;
        return parent.type === "JSXOpeningElement" || parent.type === "JSXClosingElement";
      })
      .forEach((path) => {
        path.node.name = to;
      });
  }

  // Rename JSX tag usages for member-expression renames (FormItem -> Form.Item).
  for (const { from, objectLocal, property } of memberRenames) {
    root
      .find(j.JSXOpeningElement)
      .filter((path) => path.node.name.type === "JSXIdentifier" && path.node.name.name === from)
      .forEach((path) => {
        path.node.name = j.jsxMemberExpression(j.jsxIdentifier(objectLocal), j.jsxIdentifier(property));
      });

    root
      .find(j.JSXClosingElement)
      .filter((path) => path.node.name.type === "JSXIdentifier" && path.node.name.name === from)
      .forEach((path) => {
        path.node.name = j.jsxMemberExpression(j.jsxIdentifier(objectLocal), j.jsxIdentifier(property));
      });
  }

  function findAttr(opening: JSXOpeningElement, name: string): JSXAttribute | undefined {
    return opening.attributes?.find(
      (attr): attr is JSXAttribute => attr.type === "JSXAttribute" && attr.name.name === name,
    );
  }

  function removeAttr(opening: JSXOpeningElement, name: string) {
    opening.attributes = opening.attributes?.filter(
      (attr) => !(attr.type === "JSXAttribute" && attr.name.name === name),
    );
  }

  function getStringLiteralValue(attr: JSXAttribute): string | undefined {
    if (attr.value?.type === "Literal" || attr.value?.type === "StringLiteral") {
      return attr.value.value as string;
    }
    return undefined;
  }

  // Button + Input: variant/size prop remapping.
  root
    .find(j.JSXOpeningElement)
    .filter((path) => path.node.name.type === "JSXIdentifier" && path.node.name.name === "Button")
    .forEach((path) => {
      const opening = path.node;

      // AntD Button's `type` prop means visual variant, not the native HTML button type —
      // unlike Rebar's, which passes `type` straight through to a real <button>. Move the
      // native meaning to `htmlType` (AntD's dedicated prop for it) before `variant` claims
      // `type`, or a submit button silently loses its native type and gets an invalid
      // duplicate `type` attribute instead. Found by dogfooding this against a real form.
      const nativeTypeAttr = findAttr(opening, "type");
      if (nativeTypeAttr) {
        nativeTypeAttr.name = j.jsxIdentifier("htmlType");
      }

      const variantAttr = findAttr(opening, "variant");
      if (variantAttr) {
        const value = getStringLiteralValue(variantAttr);
        if (value === "destructive") {
          removeAttr(opening, "variant");
          opening.attributes?.push(j.jsxAttribute(j.jsxIdentifier("danger")));
        } else if (value && value in BUTTON_VARIANT_TO_TYPE) {
          variantAttr.name = j.jsxIdentifier("type");
          variantAttr.value = j.literal(BUTTON_VARIANT_TO_TYPE[value]!);
        }
      }
      const sizeAttr = findAttr(opening, "size");
      if (sizeAttr) {
        const value = getStringLiteralValue(sizeAttr);
        if (value && value in SIZE_MAP) {
          sizeAttr.value = j.literal(SIZE_MAP[value]!);
        }
      }
    });

  root
    .find(j.JSXOpeningElement)
    .filter((path) => path.node.name.type === "JSXIdentifier" && path.node.name.name === "Input")
    .forEach((path) => {
      const sizeAttr = findAttr(path.node, "size");
      if (sizeAttr) {
        const value = getStringLiteralValue(sizeAttr);
        if (value && value in SIZE_MAP) {
          sizeAttr.value = j.literal(SIZE_MAP[value]!);
        }
      }
    });

  // Alert: no prop rename needed — AntD v6's `title` prop matches Rebar's own name directly.

  // Modal (renamed from Dialog): onOpenChange -> onCancel (flagged), description -> child.
  root
    .find(j.JSXElement)
    .filter(
      (path) =>
        path.node.openingElement.name.type === "JSXIdentifier" &&
        path.node.openingElement.name.name === "Modal",
    )
    .forEach((path) => {
      const opening = path.node.openingElement;

      const onOpenChangeAttr = findAttr(opening, "onOpenChange");
      if (onOpenChangeAttr) {
        onOpenChangeAttr.name = j.jsxIdentifier("onCancel");
        onOpenChangeAttr.comments = [
          j.commentLine(REVIEW_COMMENT_ON_CANCEL, true, false),
        ];
      }

      const descriptionAttr = findAttr(opening, "description");
      if (descriptionAttr) {
        removeAttr(opening, "description");
        const value = descriptionAttr.value;
        let childExpression;
        if (value?.type === "JSXExpressionContainer") {
          childExpression = value;
        } else if (value?.type === "Literal" || value?.type === "StringLiteral") {
          childExpression = j.jsxExpressionContainer(value as JSXExpressionContainer["expression"]);
        }
        if (childExpression) {
          const paragraph = j.jsxElement(
            j.jsxOpeningElement(j.jsxIdentifier("p"), []),
            j.jsxClosingElement(j.jsxIdentifier("p")),
            [childExpression as never],
          );
          path.node.children = [paragraph, ...(path.node.children ?? [])];
        }
      }
    });

  // Form: onSubmit -> onFinish.
  root
    .find(j.JSXOpeningElement)
    .filter((path) => path.node.name.type === "JSXIdentifier" && path.node.name.name === "Form")
    .forEach((path) => {
      const onSubmitAttr = findAttr(path.node, "onSubmit");
      if (onSubmitAttr) {
        onSubmitAttr.name = j.jsxIdentifier("onFinish");
      }
    });

  // Form.Item (renamed from FormItem): required -> required + rules; unwrap the render-prop
  // children pattern into a single plain child, since AntD's Form.Item clones one direct child
  // rather than calling a render function.
  root
    .find(j.JSXElement)
    .filter((path) => {
      const name = path.node.openingElement.name;
      return name.type === "JSXMemberExpression" && name.property.name === "Item";
    })
    .forEach((path: ASTPath<JSXElement>) => {
      const opening = path.node.openingElement;

      const requiredAttr = findAttr(opening, "required");
      if (requiredAttr) {
        const isExplicitFalse =
          requiredAttr.value?.type === "JSXExpressionContainer" &&
          requiredAttr.value.expression.type === "Literal" &&
          requiredAttr.value.expression.value === false;

        if (!isExplicitFalse) {
          opening.attributes?.push(
            j.jsxAttribute(
              j.jsxIdentifier("rules"),
              j.jsxExpressionContainer(
                j.arrayExpression([
                  j.objectExpression([
                    j.objectProperty(j.identifier("required"), j.booleanLiteral(true)),
                    j.objectProperty(
                      j.identifier("message"),
                      j.stringLiteral("This field is required"),
                    ),
                  ]),
                ]),
              ),
            ),
          );
        }
      }

      const meaningfulChildren = (path.node.children ?? []).filter(
        (child) => !(child.type === "JSXText" && child.value.trim() === ""),
      );

      if (meaningfulChildren.length === 1) {
        const only = meaningfulChildren[0]!;
        if (only.type === "JSXExpressionContainer" && only.expression.type === "ArrowFunctionExpression") {
          const arrow = only.expression;
          const param = arrow.params[0];
          const paramName = param?.type === "Identifier" ? param.name : undefined;

          let inner: JSXElement | undefined;
          if (arrow.body.type === "JSXElement") {
            inner = arrow.body;
          } else if (arrow.body.type === "BlockStatement") {
            const returnStatement = arrow.body.body.find((stmt) => stmt.type === "ReturnStatement");
            if (
              returnStatement?.type === "ReturnStatement" &&
              returnStatement.argument?.type === "JSXElement"
            ) {
              inner = returnStatement.argument;
            }
          }

          if (inner && paramName) {
            inner.openingElement.attributes = inner.openingElement.attributes?.filter(
              (attr) => !(attr.type === "JSXSpreadAttribute" && attr.argument.type === "Identifier" && attr.argument.name === paramName),
            );
            path.node.children = [inner];
          }
        }
      }
    });

  // Checkbox: onCheckedChange -> onChange, flagged — signatures differ (boolean vs event).
  root
    .find(j.JSXOpeningElement)
    .filter((path) => path.node.name.type === "JSXIdentifier" && path.node.name.name === "Checkbox")
    .forEach((path) => {
      const attr = findAttr(path.node, "onCheckedChange");
      if (attr) {
        attr.name = j.jsxIdentifier("onChange");
        attr.comments = [j.commentLine(REVIEW_COMMENT_CHECKBOX_ONCHANGE, true, false)];
      }
    });

  // Radio.Group (renamed from RadioGroup): onValueChange -> onChange, flagged.
  root
    .find(j.JSXOpeningElement)
    .filter(
      (path) =>
        path.node.name.type === "JSXMemberExpression" &&
        path.node.name.object.type === "JSXIdentifier" &&
        path.node.name.object.name === "Radio" &&
        path.node.name.property.name === "Group",
    )
    .forEach((path) => {
      const attr = findAttr(path.node, "onValueChange");
      if (attr) {
        attr.name = j.jsxIdentifier("onChange");
        attr.comments = [j.commentLine(REVIEW_COMMENT_RADIO_ONCHANGE, true, false)];
      }
    });

  // Switch, Select, Slider: onValueChange -> onChange — safe, unflagged. Each of these AntD
  // components' onChange receives the new value as its first argument (Switch: (checked,
  // event); Select: (value, option); Slider: (value)), so the rename alone is compatible —
  // unlike Checkbox/Radio above, where the whole first argument shape differs.
  for (const name of ["Switch", "Select", "Slider"]) {
    root
      .find(j.JSXOpeningElement)
      .filter((path) => path.node.name.type === "JSXIdentifier" && path.node.name.name === name)
      .forEach((path) => {
        const attr = findAttr(path.node, "onValueChange");
        if (attr) {
          attr.name = j.jsxIdentifier("onChange");
        }
      });
  }

  // Tooltip: content -> title (AntD's prop name for the same thing).
  root
    .find(j.JSXOpeningElement)
    .filter((path) => path.node.name.type === "JSXIdentifier" && path.node.name.name === "Tooltip")
    .forEach((path) => {
      const attr = findAttr(path.node, "content");
      if (attr) {
        attr.name = j.jsxIdentifier("title");
      }
    });

  return root.toSource({ quote: "double" });
}

transform.parser = "tsx";

export = transform;
