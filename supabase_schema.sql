-- ============================================================
-- SCHEMA — Chá de Panela — Gustavo & Rebeca
-- Execute no SQL Editor do Supabase (supabase.com/dashboard)
-- ============================================================

-- 1. Tabela de convidados (RSVP)
CREATE TABLE IF NOT EXISTS convidados (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome                TEXT NOT NULL,
  telefone            TEXT,
  confirmou           BOOLEAN NOT NULL DEFAULT true,
  qtd_acompanhantes   INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de presentes
CREATE TABLE IF NOT EXISTS presentes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome              TEXT NOT NULL,
  descricao         TEXT,
  valor_sugerido    NUMERIC(10, 2),
  icone             TEXT DEFAULT '🎁',
  status            TEXT NOT NULL DEFAULT 'disponivel'
                      CHECK (status IN ('disponivel', 'reservado', 'pago')),
  reservado_por     TEXT,
  tipo_entrega      TEXT CHECK (tipo_entrega IN ('fisico', 'pix') OR tipo_entrega IS NULL),
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE convidados ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentes  ENABLE ROW LEVEL SECURITY;

-- Convidados: visitantes podem inserir e ler
CREATE POLICY "public_insert_convidados" ON convidados
  FOR INSERT WITH CHECK (true);

CREATE POLICY "public_select_convidados" ON convidados
  FOR SELECT USING (true);

-- Presentes: visitantes podem ler e atualizar (para reservar)
CREATE POLICY "public_select_presentes" ON presentes
  FOR SELECT USING (true);

CREATE POLICY "public_update_presentes" ON presentes
  FOR UPDATE USING (true) WITH CHECK (true);

-- Admin (autenticado) pode tudo
CREATE POLICY "admin_all_convidados" ON convidados
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_presentes" ON presentes
  FOR ALL USING (auth.role() = 'authenticated');
