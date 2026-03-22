-- ============================================================
-- UPDATE PATCH - Cha de Panela - 2026-03-22
-- Rode este arquivo no SQL Editor do Supabase em um projeto ja existente.
-- Ele aplica apenas as atualizacoes necessarias no banco atual.
-- ============================================================

BEGIN;

ALTER TABLE convidados ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentes ENABLE ROW LEVEL SECURITY;

-- Remove policies antigas para recriar o conjunto correto de permissoes
DROP POLICY IF EXISTS "public_insert_convidados" ON convidados;
DROP POLICY IF EXISTS "public_select_convidados" ON convidados;
DROP POLICY IF EXISTS "public_select_presentes" ON presentes;
DROP POLICY IF EXISTS "public_update_presentes" ON presentes;
DROP POLICY IF EXISTS "admin_all_convidados" ON convidados;
DROP POLICY IF EXISTS "admin_all_presentes" ON presentes;

-- Visitantes podem apenas enviar RSVP, sem ler a lista de convidados
CREATE POLICY "public_insert_convidados" ON convidados
  FOR INSERT TO anon WITH CHECK (true);

-- Visitantes podem ver a lista de presentes
CREATE POLICY "public_select_presentes" ON presentes
  FOR SELECT TO anon USING (true);

-- Visitantes podem atualizar apenas presentes ainda disponiveis
CREATE POLICY "public_update_presentes" ON presentes
  FOR UPDATE TO anon USING (status = 'disponivel') WITH CHECK (true);

-- Usuarios autenticados continuam com acesso administrativo completo
CREATE POLICY "admin_all_convidados" ON convidados
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_presentes" ON presentes
  FOR ALL USING (auth.role() = 'authenticated');

-- Valida e restringe o que um visitante anonimo pode alterar em presentes
CREATE OR REPLACE FUNCTION guard_public_presentes_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF auth.role() IN ('authenticated', 'service_role') THEN
    RETURN NEW;
  END IF;

  IF OLD.status <> 'disponivel' THEN
    RAISE EXCEPTION 'Somente presentes disponiveis podem ser reservados publicamente.';
  END IF;

  IF NEW.nome IS DISTINCT FROM OLD.nome
     OR NEW.descricao IS DISTINCT FROM OLD.descricao
     OR NEW.valor_sugerido IS DISTINCT FROM OLD.valor_sugerido
     OR NEW.icone IS DISTINCT FROM OLD.icone
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Visitantes nao podem editar os dados do presente.';
  END IF;

  IF NEW.status <> 'reservado' THEN
    RAISE EXCEPTION 'Status invalido para reserva publica.';
  END IF;

  IF NEW.reservado_por IS NULL OR btrim(NEW.reservado_por) = '' THEN
    RAISE EXCEPTION 'Informe quem reservou o presente.';
  END IF;

  IF NEW.tipo_entrega IS DISTINCT FROM 'fisico' THEN
    RAISE EXCEPTION 'Tipo de entrega incompativel com o status.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_public_presentes_update ON presentes;
CREATE TRIGGER guard_public_presentes_update
  BEFORE UPDATE ON presentes
  FOR EACH ROW
  EXECUTE FUNCTION guard_public_presentes_update();

COMMIT;
