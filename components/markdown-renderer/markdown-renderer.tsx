"use client";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function MarkdownRenderer({ content }: { content: string }) {
  const [markdown, setMarkdown] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isUrl = content.startsWith("http") || content.startsWith("/");

  useEffect(() => {
    if (!isUrl) {
      setMarkdown(content);
      setLoading(false);
      return;
    }
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
  }, [content, isUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="size-8 animate-spin rounded-full border-4 border-border border-t-transparent" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-base border-3 border-border bg-secondary-background p-6 text-center text-foreground shadow-shadow">
        Failed to load content.
      </div>
    );
  }

  return (
    <div className="markdown-body">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              {...props}
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={typeof src === "string" ? src : ""}
              alt={alt || ""}
              loading="lazy"
            />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
