"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast, ToastContainer } from "@/components/Toast";

export default function LoginForm() {
  const supabase = createClient();
  const router = useRouter();
  const { toasts, showToast } = useToast();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !senha) { showToast("Preencha email e senha.", "error"); return; }
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setLoading(false);

    if (error) { showToast("❌ Credenciais inválidas.", "error"); return; }
    router.push("/admin");
    router.refresh();
  }

  return (
    <>
      <ToastContainer toasts={toasts} />
      <div className="rounded-2xl border border-[#ead9ce] bg-card p-7 shadow-sm">
        <div className="mb-4">
          <label className="mb-1.5 block text-[0.72rem] font-medium uppercase tracking-wider text-muted">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@exemplo.com"
            className="w-full rounded-xl border-2 border-[#ead9ce] bg-cream px-4 py-2.5 text-sm outline-none focus:border-rose"
          />
        </div>
        <div className="mb-6">
          <label className="mb-1.5 block text-[0.72rem] font-medium uppercase tracking-wider text-muted">Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border-2 border-[#ead9ce] bg-cream px-4 py-2.5 text-sm outline-none focus:border-rose"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-full bg-deep py-3 text-sm font-medium text-cream transition-all hover:bg-rose disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar →"}
        </button>
      </div>
    </>
  );
}
