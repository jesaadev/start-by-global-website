/**
 * Texto de un titular con una frase destacada en color y un subrayado que se
 * dibuja al cargar (CSS puro: visible en SSR, sin JS). Si la frase no aparece
 * en el texto, se pinta el texto tal cual.
 */
export function HighlightTitle({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight || !text.includes(highlight)) return <>{text}</>
  const i = text.indexOf(highlight)
  return (
    <>
      {text.slice(0, i)}
      <span className="text-primary bg-gradient-to-r from-primary/45 to-primary/45 bg-no-repeat bg-left-bottom [background-size:0%_0.14em] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] animate-underline-grow motion-reduce:animate-none motion-reduce:[background-size:100%_0.14em]">
        {highlight}
      </span>
      {text.slice(i + highlight.length)}
    </>
  )
}
