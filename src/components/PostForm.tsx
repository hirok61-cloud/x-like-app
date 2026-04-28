"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const MAX_LENGTH = 280;

export default function PostForm({ onPosted }: { onPosted: () => void }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError("");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("ログインが必要です");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("posts").insert({
      user_id: session.user.id,
      author_email: session.user.email,
      content: content.trim(),
    });

    if (error) {
      setError("投稿に失敗しました: " + error.message);
    } else {
      setContent("");
      onPosted();
    }
    setLoading(false);
  }

  const remaining = MAX_LENGTH - content.length;

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="いまどうしてる？"
        maxLength={MAX_LENGTH}
        style={styles.textarea}
      />
      <div style={styles.footer}>
        <span style={{ ...styles.counter, color: remaining < 20 ? "#e0245e" : "#666" }}>
          {remaining}
        </span>
        {error && <span style={styles.error}>{error}</span>}
        <button
          type="submit"
          disabled={loading || !content.trim()}
          style={styles.button}
        >
          {loading ? "投稿中..." : "投稿する"}
        </button>
      </div>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    border: "1px solid #e1e8ed",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    background: "#fff",
  },
  textarea: {
    width: "100%",
    minHeight: 80,
    border: "none",
    outline: "none",
    resize: "vertical",
    fontSize: 16,
    fontFamily: "inherit",
    lineHeight: 1.5,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
    borderTop: "1px solid #e1e8ed",
    paddingTop: 8,
  },
  counter: {
    fontSize: 14,
  },
  error: {
    color: "#e0245e",
    fontSize: 14,
  },
  button: {
    background: "#1da1f2",
    color: "#fff",
    border: "none",
    borderRadius: 20,
    padding: "8px 20px",
    fontSize: 15,
    fontWeight: "bold",
    cursor: "pointer",
  },
};
