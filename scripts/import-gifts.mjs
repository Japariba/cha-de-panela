import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function loadDotEnvLocal() {
  const envPath = path.join(rootDir, '.env.local');
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function normalizeName(name) {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

const gifts = [
  { nome: 'Abridor de Vinho (inox)', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Abridor de latas', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Afiador de facas', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Assadeira de vidro retangular (grande)', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Assadeira de vidro redonda', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Batedor de claras (fouet)', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Conjunto de facas de cozinha', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Boleira de vidro ou acrílico com tampa', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Chaleira elétrica (220v)', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Colher de sorvete (modelo profissional)', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Copo de medidas', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Conjunto de espátulas de silicone (pão duro)', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Concha', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Conjunto de potes herméticos de vidro', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Conjunto de potes herméticos de plástico', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Cortador de pizza', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Escorredor de macarrão (inox)', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Espremedor de batatas (inox)', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Pegador de massa', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Pegador de salada', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Leiteira', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Frigideira funda (tipo Wok)', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Jogo de facas para churrasco', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Luva térmica de silicone e descanso de panela', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Conjunto de Peneiras', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Petisqueira', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Pilão com batedor', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Porta-condimentos magnético ou de suporte', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Tábua de corte', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Ralador multiuso de quatro faces (inox)', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Tesoura de cozinha multiuso', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Bowl de vidro', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Lixeira de bancada cozinha', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Escumadeira', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Colher grande', descricao: 'Categoria: Cozinha (Utensílios e Preparo)', icone: '🍳' },
  { nome: 'Conjunto de copos para água (6 unidades)', descricao: 'Categoria: Mesa e Servir', icone: '🍽️' },
  { nome: 'Faqueiro básico/Jogo de talheres (24 peças)', descricao: 'Categoria: Mesa e Servir', icone: '🍽️' },
  { nome: 'Jarra de vidro para suco (1,5L ou 2L)', descricao: 'Categoria: Mesa e Servir', icone: '🍽️' },
  { nome: 'Jogo de pratos rasos', descricao: 'Categoria: Mesa e Servir', icone: '🍽️' },
  { nome: 'Jogo de pratos fundos', descricao: 'Categoria: Mesa e Servir', icone: '🍽️' },
  { nome: 'Jogo de pratos de sobremesa', descricao: 'Categoria: Mesa e Servir', icone: '🍽️' },
  { nome: 'Jogo de bowls pequenos para sobremesa', descricao: 'Categoria: Mesa e Servir', icone: '🍽️' },
  { nome: 'Travessa de servir em inox', descricao: 'Categoria: Mesa e Servir', icone: '🍽️' },
  { nome: 'Forma redonda com furo/pudim aluminio', descricao: 'Categoria: Mesa e Servir', icone: '🍽️' },
  { nome: 'Forma de bolo retangular aluminio', descricao: 'Categoria: Mesa e Servir', icone: '🍽️' },
  { nome: 'Jogo de xícaras', descricao: 'Categoria: Mesa e Servir', icone: '🍽️' },
  { nome: 'Espremedor de limão', descricao: 'Categoria: Mesa e Servir', icone: '🍽️' },
  { nome: 'Assadeira de pizza', descricao: 'Categoria: Mesa e Servir', icone: '🍽️' },
  { nome: 'Espatula de bolo', descricao: 'Categoria: Mesa e Servir', icone: '🍽️' },
  { nome: 'Jogo de panela', descricao: 'Categoria: Mesa e Servir', icone: '🍽️' },
  { nome: 'Colher grande para cozinhar', descricao: 'Categoria: Mesa e Servir', icone: '🍽️' },
  { nome: 'Porta frios', descricao: 'Categoria: Mesa e Servir', icone: '🍽️' },
  { nome: 'Conjunto de panos de prato', descricao: 'Categoria: Lavanderia, Organização, Banheiro e Cama', icone: '🧺' },
  { nome: 'Tapete de banheiro', descricao: 'Categoria: Lavanderia, Organização, Banheiro e Cama', icone: '🧺' },
  { nome: 'Tapete entrada', descricao: 'Categoria: Lavanderia, Organização, Banheiro e Cama', icone: '🧺' },
  { nome: 'Cestas organizadoras', descricao: 'Categoria: Lavanderia, Organização, Banheiro e Cama', icone: '🧺' },
  { nome: 'Toalhas de banho e rosto', descricao: 'Categoria: Lavanderia, Organização, Banheiro e Cama', icone: '🧺' },
  { nome: 'Pregador de roupa', descricao: 'Categoria: Lavanderia, Organização, Banheiro e Cama', icone: '🧺' },
  { nome: 'Jogo de lençol cama Queen', descricao: 'Categoria: Lavanderia, Organização, Banheiro e Cama', icone: '🧺' },
  { nome: 'Panos de chão', descricao: 'Categoria: Lavanderia, Organização, Banheiro e Cama', icone: '🧺' },
  { nome: 'Porta retrato', descricao: 'Categoria: Lavanderia, Organização, Banheiro e Cama', icone: '🧺' },
  { nome: 'Balde', descricao: 'Categoria: Lavanderia, Organização, Banheiro e Cama', icone: '🧺' },
  { nome: 'Escova de limpeza', descricao: 'Categoria: Lavanderia, Organização, Banheiro e Cama', icone: '🧺' },
  { nome: 'Cabides', descricao: 'Categoria: Lavanderia, Organização, Banheiro e Cama', icone: '🧺' },
  { nome: 'Batedeira comum', descricao: 'Categoria: Pequenos Eletrodomésticos (Até R$ 300)', icone: '⚡' },
  { nome: 'Sanduicheira (220v ou bivolt)', descricao: 'Categoria: Pequenos Eletrodomésticos (Até R$ 300)', icone: '⚡' },
  { nome: 'Ferro de passar roupas a vapor (220v ou bivolt)', descricao: 'Categoria: Pequenos Eletrodomésticos (Até R$ 300)', icone: '⚡' },
  { nome: 'Air fryer (220v ou bivolt)', descricao: 'Categoria: Pequenos Eletrodomésticos (Até R$ 300)', icone: '⚡' },
];

async function main() {
  loadDotEnvLocal();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Variável NEXT_PUBLIC_SUPABASE_URL não encontrada.');
  }
  if (!serviceRoleKey) {
    throw new Error('Variável SUPABASE_SERVICE_ROLE_KEY não encontrada. Defina a chave de service role para inserir em lote.');
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: existingRows, error: fetchError } = await supabase.from('presentes').select('nome');
  if (fetchError) {
    throw new Error(`Erro ao consultar presentes existentes: ${fetchError.message}`);
  }

  const existing = new Set((existingRows || []).map((row) => normalizeName(row.nome)));
  const seenInPayload = new Set();
  const toInsert = [];
  const skipped = [];

  for (const gift of gifts) {
    const normalized = normalizeName(gift.nome);
    if (existing.has(normalized) || seenInPayload.has(normalized)) {
      skipped.push(gift.nome);
      continue;
    }
    seenInPayload.add(normalized);
    toInsert.push({
      ...gift,
      status: 'disponivel',
      reservado_por: null,
      tipo_entrega: null,
      valor_sugerido: null,
    });
  }

  if (!toInsert.length) {
    console.log('Nenhum novo presente para inserir. Tudo já existe na tabela.');
    return;
  }

  const { data: insertedRows, error: insertError } = await supabase
    .from('presentes')
    .insert(toInsert)
    .select('id, nome');

  if (insertError) {
    throw new Error(`Erro ao inserir presentes: ${insertError.message}`);
  }

  console.log(`Inseridos: ${insertedRows?.length || 0}`);
  console.log(`Ignorados (já existentes/duplicados): ${skipped.length}`);
  if (skipped.length) {
    console.log('\nItens ignorados:');
    for (const name of skipped) console.log(`- ${name}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
