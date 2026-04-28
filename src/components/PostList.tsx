"use client";

import { Post } from "@/lib/supabase";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div style={styles.empty}>まだ投稿がありません。最初の投稿をしてみましょう！</div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} style={styles.post}>
          <div style={styles.header}>
            <span style={styles.email}>{post.author_email}</span>
            <span style={styles.date}>{formatDate(post.created_at)}</span>
          </div>
          <p style={styles.content}>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  empty: {
    textAlign: "center",
    color: "#666",
    padding: "40px 0",
    fontSize: 15,
  },
  post: {
    border: "1px solid #e1e8ed",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    background: "#fff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  email: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  date: {
    fontSize: 13,
    color: "#888",
  },
  content: {
    fontSize: 16,
    lineHeight: 1.6,
    color: "#14171a",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
};
