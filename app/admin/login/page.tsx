"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const params = useSearchParams();
  const [pending, setPending] = useState(false);
  const reason = params.get("reason");
  const error = params.get("error");

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <h1>XiaoHongRongPin Admin</h1>
        <p>Sign in to manage products, news, inquiries, and site settings.</p>
        {reason === "unauthorized" ? <p className="login-notice">Please sign in to access the admin console.</p> : null}
        {error ? <p className="login-error">{error}</p> : null}
        <form action="/api/auth/login" method="post" onSubmit={() => setPending(true)}>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required defaultValue="info@xhrpaluminum.com" />
          </label>
          <label>
            Password
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <button className="primary-button" type="submit" disabled={pending}>
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="admin-login-page">Loading...</main>}>
      <LoginForm />
    </Suspense>
  );
}
