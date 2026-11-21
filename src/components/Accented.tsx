// A heading line with its one accent word: [lead, accent, trail].
export function Accented({ parts }: { parts: readonly [string, string, string] }) {
  const [lead, accent, trail] = parts;
  return (
    <>
      {lead}
      <span className="accent">{accent}</span>
      {trail}
    </>
  );
}
