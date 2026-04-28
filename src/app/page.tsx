"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, Post } from "@/lib/supabase";
import AuthGuard from "@/components/AuthGuard";
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList";

export default function Home() {
  return (
    <AuthGuard>
      <HomePage />
    </AuthGuard>
  );
}

function HomePage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.email) setUserEmail(session.user.email);
    });
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPosts(data as Post[]);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <h1 style={styles.logo}>𝕏 風サイト</h1>
        <div style={styles.headerRight}>
          <span style={styles.email}>{userEmail}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            ログアウト
          </button>
        </div>
      </header>
      <main style={styles.main}>
        <PostForm onPosted={fetchPosts} />
        <PostList posts={posts} />
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    background: "#f5f8fa",
  },
  header: {
    position: "sticky",
    top: 0,
    background: "#fff",
    borderBottom: "1px solid #e1e8ed",
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1da1f2",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  email: {
    fontSize: 14,
    color: "#555",
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid #1da1f2",
    color: "#1da1f2",
    borderRadius: 20,
    padding: "6px 16px",
    fontSize: 14,
    cursor: "pointer",
  },
  main: {
    maxWidth: 600,
    margin: "0 auto",
    padding: "20px 16px",
  },
};
