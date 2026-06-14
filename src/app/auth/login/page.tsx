"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = (await response.json()) as { message?: string; redirectTo?: string };

      if (!response.ok || !data.redirectTo) {
        setError(data.message ?? "Kirish amalga oshmadi");
        return;
      }

      router.push(data.redirectTo as Route);
      router.refresh();
    } catch {
      setError("Tarmoq xatosi. Keyinroq qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <style jsx global>{`
        .footer { display: none; }
      `}</style>
      <section className="card auth-card" style={{ maxWidth: 560, margin: "0 auto" }}>
        <h1>Kirish</h1>
        <p className="muted">Ro&#39;yxatdan o&#39;tgan profilingizga email va parol orqali kiring.</p>

        <form className="grid" style={{ gap: 10 }} onSubmit={onSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="talaba@example.uz"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Parol</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <p className="field-hint">Parol kamida 8 ta belgidan iborat bo&#39;lishi kerak.</p>
          </div>
          {error ? <p className="register-error">{error}</p> : null}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Tekshirilmoqda..." : "Kirish"}
          </button>
        </form>
      </section>
    </main>
  );
}
