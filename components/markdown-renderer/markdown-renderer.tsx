"use client";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Image from "next/image";

export default function MarkdownRenderer({ content }: { content: string }) {
  const [markdown, setMarkdown] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(content)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch markdown");
        return res.text();
      })
      .then((text) => {
        setMarkdown(text);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [content]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Failed to load content.</div>;

  return (
    <div className="markdown-body text-tertiary-900 dark:text-white">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          img: ({...props}) => (
            <span className="block my-4">
              <Image
                src={props.src || ""}
                alt={props.alt || ""}
                width={800}
                height={400}
                className="rounded max-w-full h-auto"
              />
            </span>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
