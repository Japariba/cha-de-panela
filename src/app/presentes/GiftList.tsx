"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Gift } from "@/lib/types";
import { useToast, ToastContainer } from "@/components/Toast";

const PIX_CHAVE = process.env.NEXT_PUBLIC_CHAVE_PIX ?? "";

export default function GiftList({ initialGifts }: { initialGifts: Gift[] }) {
  const supabase = createClient();
  const { toasts, showToast } = useToast();
  const [gifts, setGifts] = useState<Gift[]>(initialGifts);
  const [modal, setModal] = useState<{ gift: Gift; tipo: "pix" | "fisico" } | null>(null);
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function openModal(gift: Gift, tipo: "pix" | "fisico") {
    setNome("");
    setModal({ gift, tipo });
  }
  function closeModal() { setModal(null); }

  async function confirm() {
    if (!nome.trim()) { showToast("⚠️ Informe seu nome.", "error"); return; }
    if (!modal) return;
    setLoading(true);

    const { error } = await supabase
      .from("presentes")
      .update({
        status: modal.tipo === "pix" ? "pago" : "reservado",
        reservado_por: nome.trim(),
        tipo_entrega: modal.tipo,
        updated_at: new Date().toISOString(),
      })
      .eq("id", modal.gift.id)
      .eq("status", "disponivel"); // evita race condition

    setLoading(false);

    if (error) {
      showToast("❌ Erro ao reservar. Tente novamente.", "error");
      return;
    }

    // Atualiza localmente
    setGifts((prev) =>
      prev.map((g) =>
        g.id === modal.gift.id
          ? { ...g, status: modal.tipo === "pix" ? "pago" : "reservado", reservado_por: nome.trim(), tipo_entrega: modal.tipo }
          : g
      )
    );
    closeModal();
    showToast(
      modal.tipo === "pix"
        ? `🎉 Obrigada, ${nome}! Pagamento registrado.`
        : `✅ Reservado para ${nome}! Obrigada 🛍️`
    );
  }

  function copyPix() {
    navigator.clipboard.writeText(PIX_CHAVE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <>
      <ToastContainer toasts={toasts} />

      <div className="mx-auto max-w-2xl space-y-3 px-6 pb-16">
        {gifts.map((g) => (
          <GiftCard key={g.id} gift={g} onPix={() => openModal(g, "pix")} onFisico={() => openModal(g, "fisico")} />
        ))}
      </div>

      {/* MODAL */}
      {modal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-deep/40 backdrop-blur-sm p-6"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="animate-slide-up w-full max-w-sm rounded-2xl border border-[#ead9ce] bg-card p-7">
            {modal.tipo === "pix" ? (
              <>
                <h3 className="font-serif mb-1 text-2xl text-deep">💳 Presentear via Pix</h3>
                <p className="mb-4 text-sm text-muted">
                  Você escolheu: <strong>{modal.gift.nome}</strong>. Realize o pagamento e confirme seu nome.
                </p>
                <div className="mb-4 rounded-xl border border-dashed border-blush bg-cream p-4 text-center">
                  <div className="text-sm font-semibold text-deep break-all">{PIX_CHAVE}</div>
                  {modal.gift.valor_sugerido && (
                    <div className="mt-1 text-xs text-muted">
                      Valor sugerido: R$ {modal.gift.valor_sugerido.toFixed(2).replace(".", ",")}
                    </div>
                  )}
                  <button onClick={copyPix} className="mt-2 text-xs font-medium text-rose hover:underline">
                    {copied ? "✅ Copiado!" : "📋 Copiar chave"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-serif mb-1 text-2xl text-deep">🛍️ Vou comprar e levar!</h3>
                <p className="mb-4 text-sm text-muted">
                  Você escolheu: <strong>{modal.gift.nome}</strong>. Reservaremos o item no seu nome.
                </p>
              </>
            )}

            <label className="mb-1.5 block text-[0.72rem] font-medium uppercase tracking-wider text-muted">
              Seu nome (para registro)
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Fernanda Costa"
              className="mb-5 w-full rounded-xl border-2 border-[#ead9ce] bg-cream px-4 py-2.5 text-sm outline-none focus:border-rose"
              onKeyDown={(e) => e.key === "Enter" && confirm()}
            />

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 rounded-full border-2 border-deep py-2.5 text-sm font-medium text-deep hover:bg-deep hover:text-cream transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={confirm}
                disabled={loading}
                className={`flex-1 rounded-full py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 ${
                  modal.tipo === "pix" ? "bg-gold" : "bg-sage"
                }`}
              >
                {loading ? "Salvando..." : modal.tipo === "pix" ? "Confirmar pagamento ✓" : "Reservar presente ✓"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function statusLabel(s: string) {
  if (s === "reservado") return { text: "🟡 Reservado", cls: "bg-amber-50 text-amber-700" };
  if (s === "pago")      return { text: "🟣 Pago via Pix", cls: "bg-purple-50 text-purple-700" };
  return { text: "✅ Disponível", cls: "bg-green-50 text-green-700" };
}

function GiftCard({ gift, onPix, onFisico }: { gift: Gift; onPix: () => void; onFisico: () => void }) {
  const available = gift.status === "disponivel";
  const { text, cls } = statusLabel(gift.status);

  return (
    <div className={`flex items-center gap-4 rounded-2xl border border-[#ead9ce] bg-card p-5 transition-shadow hover:shadow-md ${!available ? "opacity-60" : ""}`}>
      <div className="min-w-0 flex-1">
        <p className="font-serif text-lg font-semibold text-deep">{gift.nome}</p>
        {gift.descricao && <p className="mt-0.5 text-xs text-muted">{gift.descricao}</p>}
        {gift.valor_sugerido && (
          <p className="mt-1 text-sm font-medium text-rose">
            R$ {gift.valor_sugerido.toFixed(2).replace(".", ",")}
          </p>
        )}
        <span className={`mt-2 inline-block rounded-full px-3 py-0.5 text-[0.7rem] font-medium ${cls}`}>
          {text}
        </span>
        {gift.reservado_por && (
          <p className="mt-1 text-[0.72rem] italic text-muted">por {gift.reservado_por}</p>
        )}
      </div>

      {available && (
        <div className="flex flex-col gap-2">
          <button
            onClick={onPix}
            className="rounded-full bg-gold px-4 py-2 text-xs font-medium text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
          >
            💳 Pix
          </button>
          <button
            onClick={onFisico}
            className="rounded-full bg-sage px-4 py-2 text-xs font-medium text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
          >
            🛍️ Levar
          </button>
        </div>
      )}
    </div>
  );
}
