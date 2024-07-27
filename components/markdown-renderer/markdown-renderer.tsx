import {useCallback, useEffect, useState} from 'react'
import remark from 'remark'
import html from 'remark-html'
import PropTypes from 'prop-types'

export default function MarkdownRenderer({ content }) {
  const [data, setData] = useState('')

  const fetchAndSetContent = useCallback(async () => {
    const response = await fetch(content);
    const text = await response.text();
    const vFile = await remark().use(html).process(text)
    setData(vFile.toString());
  }, []);

  useEffect(() => {
    fetchAndSetContent();
  }, [content]);

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
