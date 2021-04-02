import { useEffect, useState } from 'react'
import remark from 'remark'
import html from 'remark-html'
import PropTypes from 'prop-types'

export default function MarkdownRenderer({ content }) {
  const [data, setData] = useState('')
  useEffect(async () => {
    let text = await fetch(content);
    text = await text.text();
    text = await remark().use(html).process(text)
    text = text.toString()
    setData(text);
  }, [content])
  return (
    <div className="container">
      <div
        dangerouslySetInnerHTML={{ __html: data }}
      />
    </div>
  )
}

MarkdownRenderer.propTypes = {
  content: PropTypes.string.isRequired,
}
