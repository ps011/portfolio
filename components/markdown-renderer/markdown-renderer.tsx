import {useCallback, useEffect, useState} from "react";
import remark from "remark";
import html from "remark-html";

export default function MarkdownRenderer({ content }: {content: string}) {
  const [data, setData] = useState("");

  const fetchAndSetContent = useCallback(async () => {
    const response = await fetch(content);
    const text = await response.text();
    const vFile = await remark().use(html).process(text);
    setData(vFile.toString());
  }, [content]);

  useEffect(() => {
    fetchAndSetContent();
  }, [content, fetchAndSetContent]);

  return (
    <div className="container">
      <div
        dangerouslySetInnerHTML={{ __html: data }}
      />
    </div>
  );
}
