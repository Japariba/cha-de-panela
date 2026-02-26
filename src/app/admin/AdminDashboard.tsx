"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Gift, Guest } from "@/lib/types";
import { useToast, ToastContainer } from "@/components/Toast";
import Link from "next/link";

interface Props {
  guests: Guest[];
  gifts: Gift[];
  userEmail: string;
}

export default function AdminDashboard({ guests, gifts: initialGifts, userEmail }: Props) {
  const supabase = createClient();
  const router = useRouter();
  const { toasts, showToast } = useToast();
  const [gifts, setGifts] = useState<Gift[]>(initialGifts);
  const [tab, setTab] = useState<"rsvp" | "presentes">("rsvp");

  // Gift form state
  const [showForm, setShowForm] = useState(false);
  const [giftNome, setGiftNome] = useState("");
  const [giftDesc, setGiftDesc] = useState("");
  const [giftValor, setGiftValor] = useState("");
  const [savingGift, setSavingGift] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Stats
  const confirmed = guests.filter((g) => g.confirmou);
  const totalPessoas = confirmed.reduce((s, g) => s + 1 + g.qtd_acompanhantes, 0);
  const reserved = gifts.filter((g) => g.status !== "disponivel").length;
  const paid = gifts.filter((g) => g.status === "pago").length;

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  function openNewForm() {
    setEditingId(null);
    setGiftNome(""); setGiftDesc(""); setGiftValor("");
    setShowForm(true);
  }

  function openEditForm(g: Gift) {
    setEditingId(g.id);
    setGiftNome(g.nome);
    setGiftDesc(g.descricao ?? "");
    setGiftValor(g.valor_sugerido ? String(g.valor_sugerido) : "");
    setShowForm(true);
  }

  async function saveGift() {
    if (!giftNome.trim()) { showToast("⚠️ Nome do presente é obrigatório.", "error"); return; }
    setSavingGift(true);

    const payload = {
      nome: giftNome.trim(),
      descricao: giftDesc.trim() || null,
      valor_sugerido: giftValor ? parseFloat(giftValor) : null,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      const { error } = await supabase.from("presentes").update(payload).eq("id", editingId);
      setSavingGift(false);
      if (error) { showToast("❌ Erro ao atualizar.", "error"); return; }
      setGifts((prev) => prev.map((g) => g.id === editingId ? { ...g, ...payload } : g));
      showToast("✅ Presente atualizado!");
    } else {
      const { data, error } = await supabase
        .from("presentes")
        .insert({ ...payload, status: "disponivel" })
        .select()
        .single();
      setSavingGift(false);
      if (error || !data) { showToast("❌ Erro ao adicionar.", "error"); return; }
      setGifts((prev) => [...prev, data]);
      showToast("✅ Presente adicionado!");
    }
    setShowForm(false);
  }

  async function deleteGift(id: string) {
    if (!confirm("Remover este presente da lista?")) return;
    const { error } = await supabase.from("presentes").delete().eq("id", id);
    if (error) { showToast("❌ Erro ao remover.", "error"); return; }
    setGifts((prev) => prev.filter((g) => g.id !== id));
    showToast("🗑️ Presente removido.");
  }

  async function resetGift(id: string) {
    if (!confirm("Liberar este presente novamente?")) return;
    const { error } = await supabase
      .from("presentes")
      .update({ status: "disponivel", reservado_por: null, tipo_entrega: null, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) { showToast("❌ Erro ao liberar.", "error"); return; }
    setGifts((prev) => prev.map((g) => g.id === id ? { ...g, status: "disponivel", reservado_por: null, tipo_entrega: null } : g));
    showToast("🔓 Presente liberado.");
  }

  return (
    <>
      <ToastContainer toasts={toasts} />

      {/* Header */}
      <nav className="sticky top-0 z-50 border-b border-[#ead9ce] bg-[#fdf6ee]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <span className="font-serif text-lg font-semibold text-deep">🔐 Admin — Gustavo &amp; Rebeca</span>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted sm:block">{userEmail}</span>
            <Link href="/" className="text-xs text-rose hover:underline">← Site</Link>
            <button onClick={logout} className="rounded-full border border-[#ead9ce] px-4 py-1.5 text-xs text-muted hover:border-deep hover:text-deep transition-all">
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-5 py-10">
        <h1 className="font-serif mb-2 text-3xl font-light text-deep">Painel de Controle</h1>
        <p className="mb-8 text-sm text-muted">Visão geral em tempo real do evento.</p>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { num: guests.length, lbl: "Respostas RSVP" },
            { num: totalPessoas, lbl: "Pessoas confirmadas" },
            { num: reserved, lbl: "Presentes reservados" },
            { num: paid, lbl: "Pagos via Pix" },
          ].map((s) => (
            <div key={s.lbl} className="rounded-2xl border border-[#ead9ce] bg-card px-5 py-4 text-center">
              <div className="font-serif text-3xl font-light text-deep">{s.num}</div>
              <div className="mt-0.5 text-[0.72rem] text-muted">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          {(["rsvp", "presentes"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                tab === t ? "bg-deep text-cream" : "border border-[#ead9ce] text-muted hover:border-deep hover:text-deep"
              }`}
            >
              {t === "rsvp" ? "📋 Confirmações" : "🎁 Presentes"}
            </button>
          ))}
        </div>

        {/* RSVP Table */}
        {tab === "rsvp" && (
          <div className="overflow-x-auto rounded-2xl border border-[#ead9ce] bg-card">
            {guests.length === 0 ? (
              <p className="py-12 text-center text-sm italic text-muted">Nenhuma confirmação ainda.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#ead9ce]">
                    {["Nome", "WhatsApp", "Status", "+Acomp."].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[0.7rem] font-medium uppercase tracking-wider text-muted">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guests.map((g) => (
                    <tr key={g.id} className="border-b border-[#f0e8e0] last:border-0">
                      <td className="px-4 py-3 font-medium text-deep">{g.nome}</td>
                      <td className="px-4 py-3 text-muted">{g.telefone || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-3 py-0.5 text-[0.7rem] font-medium ${g.confirmou ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                          {g.confirmou ? "✅ Confirmado" : "❌ Não vai"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted">{g.confirmou ? `+${g.qtd_acompanhantes}` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Gifts Table */}
        {tab === "presentes" && (
          <>
            <div className="mb-4 flex justify-end">
              <button
                onClick={openNewForm}
                className="rounded-full bg-deep px-5 py-2.5 text-sm font-medium text-cream transition-all hover:bg-rose"
              >
                + Adicionar presente
              </button>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-[#ead9ce] bg-card">
              {gifts.length === 0 ? (
                <p className="py-12 text-center text-sm italic text-muted">Nenhum presente cadastrado ainda.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#ead9ce]">
                      {["Presente", "Valor", "Status", "Quem", "Forma", "Ações"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-[0.7rem] font-medium uppercase tracking-wider text-muted">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {gifts.map((g) => (
                      <tr key={g.id} className="border-b border-[#f0e8e0] last:border-0">
                        <td className="px-4 py-3">
                          <div className="font-medium text-deep">{g.nome}</div>
                          {g.descricao && <div className="text-xs text-muted">{g.descricao}</div>}
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {g.valor_sugerido ? `R$ ${g.valor_sugerido.toFixed(2).replace(".", ",")}` : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-[0.68rem] font-medium ${
                            g.status === "disponivel" ? "bg-green-50 text-green-700" :
                            g.status === "reservado" ? "bg-amber-50 text-amber-700" :
                            "bg-purple-50 text-purple-700"
                          }`}>
                            {g.status === "disponivel" ? "Disponível" : g.status === "reservado" ? "Reservado" : "Pago"}
                          </span>
                        </td>
                        <td className="px-4 py-3 italic text-muted">{g.reservado_por || "—"}</td>
                        <td className="px-4 py-3 text-muted">
                          {g.tipo_entrega === "pix" ? "💳 Pix" : g.tipo_entrega === "fisico" ? "🛍️ Físico" : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openEditForm(g)} className="text-xs text-rose hover:underline">Editar</button>
                            {g.status !== "disponivel" && (
                              <button onClick={() => resetGift(g.id)} className="text-xs text-amber-600 hover:underline">Liberar</button>
                            )}
                            <button onClick={() => deleteGift(g.id)} className="text-xs text-red-500 hover:underline">Excluir</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>

      {/* Gift form modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-deep/40 backdrop-blur-sm p-6"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <div className="animate-slide-up w-full max-w-sm rounded-2xl border border-[#ead9ce] bg-card p-7">
            <h3 className="font-serif mb-5 text-2xl text-deep">
              {editingId ? "✏️ Editar presente" : "➕ Novo presente"}
            </h3>
            <div className="mb-4">
              <label className="mb-1.5 block text-[0.72rem] font-medium uppercase tracking-wider text-muted">Nome *</label>
              <input type="text" value={giftNome} onChange={(e) => setGiftNome(e.target.value)} placeholder="Ex: Panela de Pressão Tramontina" className={inputCls} />
            </div>
            <div className="mb-4">
              <label className="mb-1.5 block text-[0.72rem] font-medium uppercase tracking-wider text-muted">Descrição</label>
              <input type="text" value={giftDesc} onChange={(e) => setGiftDesc(e.target.value)} placeholder="Ex: 6 litros, alumínio" className={inputCls} />
            </div>
            <div className="mb-6">
              <label className="mb-1.5 block text-[0.72rem] font-medium uppercase tracking-wider text-muted">Valor sugerido (R$)</label>
              <input type="number" value={giftValor} onChange={(e) => setGiftValor(e.target.value)} placeholder="120.00" min="0" step="0.01" className={inputCls} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 rounded-full border-2 border-deep py-2.5 text-sm font-medium text-deep hover:bg-deep hover:text-cream transition-all">
                Cancelar
              </button>
              <button onClick={saveGift} disabled={savingGift} className="flex-1 rounded-full bg-deep py-2.5 text-sm font-medium text-cream hover:bg-rose transition-all disabled:opacity-60">
                {savingGift ? "Salvando..." : editingId ? "Salvar alterações" : "Adicionar →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const inputCls = "w-full rounded-xl border-2 border-[#ead9ce] bg-cream px-4 py-2.5 text-sm outline-none focus:border-rose";
