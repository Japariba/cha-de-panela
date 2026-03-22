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

DROP POLICY IF EXISTS "public_insert_convidados" ON convidados;
DROP POLICY IF EXISTS "public_select_convidados" ON convidados;
DROP POLICY IF EXISTS "public_select_presentes" ON presentes;
DROP POLICY IF EXISTS "public_update_presentes" ON presentes;
DROP POLICY IF EXISTS "admin_all_convidados" ON convidados;
DROP POLICY IF EXISTS "admin_all_presentes" ON presentes;

-- Convidados: visitantes podem apenas inserir RSVP
CREATE POLICY "public_insert_convidados" ON convidados
  FOR INSERT TO anon WITH CHECK (true);

-- Presentes: visitantes podem ler e reservar apenas itens disponíveis
CREATE POLICY "public_select_presentes" ON presentes
  FOR SELECT TO anon USING (true);

CREATE POLICY "public_update_presentes" ON presentes
  FOR UPDATE TO anon USING (status = 'disponivel') WITH CHECK (true);

CREATE OR REPLACE FUNCTION guard_public_presentes_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF auth.role() IN ('authenticated', 'service_role') THEN
    RETURN NEW;
  END IF;

  IF OLD.status <> 'disponivel' THEN
    RAISE EXCEPTION 'Somente presentes disponíveis podem ser reservados publicamente.';
  END IF;

  IF NEW.nome IS DISTINCT FROM OLD.nome
     OR NEW.descricao IS DISTINCT FROM OLD.descricao
     OR NEW.valor_sugerido IS DISTINCT FROM OLD.valor_sugerido
     OR NEW.icone IS DISTINCT FROM OLD.icone
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Visitantes não podem editar os dados do presente.';
  END IF;

  IF NEW.status <> 'reservado' THEN
    RAISE EXCEPTION 'Status inválido para reserva pública.';
  END IF;

  IF NEW.reservado_por IS NULL OR btrim(NEW.reservado_por) = '' THEN
    RAISE EXCEPTION 'Informe quem reservou o presente.';
  END IF;

  IF NEW.tipo_entrega IS DISTINCT FROM 'fisico' THEN
    RAISE EXCEPTION 'Tipo de entrega incompatível com o status.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_public_presentes_update ON presentes;
CREATE TRIGGER guard_public_presentes_update
  BEFORE UPDATE ON presentes
  FOR EACH ROW
  EXECUTE FUNCTION guard_public_presentes_update();

-- Admin (autenticado) pode tudo
CREATE POLICY "admin_all_convidados" ON convidados
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_presentes" ON presentes
  FOR ALL USING (auth.role() = 'authenticated');
