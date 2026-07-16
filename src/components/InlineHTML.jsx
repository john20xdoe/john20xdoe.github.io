export function InlineHTML({ html }) {
  if (!html) return null;

  // Split on <b> and </b> tags (case-insensitive), keeping the tags in the result
  const tokens = html.split(/(<\/?b>)/i);
  let bold = false;
  const children = [];

  tokens.forEach((token, index) => {
    if (/^<b>$/i.test(token)) {
      bold = true;
      return;
    }
    if (/^<\/b>$/i.test(token)) {
      bold = false;
      return;
    }
    if (!token) {
      return;
    }
    if (bold) {
      children.push(
        <b key={index}>{token}</b>
      );
    } else {
      children.push(token);
    }
  });

  return <span>{children}</span>;
}
