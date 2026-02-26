export type GiftStatus = 'disponivel' | 'reservado' | 'pago'
export type DeliveryType = 'fisico' | 'pix' | null

export interface Gift {
  id: string
  nome: string
  descricao: string | null
  valor_sugerido: number | null
  status: GiftStatus
  reservado_por: string | null
  tipo_entrega: DeliveryType
  icone: string | null
  created_at: string
}

export interface Guest {
  id: string
  nome: string
  telefone: string | null
  confirmou: boolean
  qtd_acompanhantes: number
  created_at: string
}

export interface EventInfo {
  nome: string
  data: string
  horario: string
  local: string
  maps_url: string
  chave_pix: string
}

export const EVENT_INFO: EventInfo = {
  nome: 'Chá de Panela do Gustavo e Rebeca',
  data: '29 de Março de 2026',
  horario: '16h00',
  local: 'Condomínio Jardim de Monaco — Salão de Festas\nAv. Olívio Franceschini, 2505 - Parque Ortolândia, Hortolândia - SP',
  maps_url: 'https://maps.google.com/?q=Av.+Ol%C3%ADvio+Franceschini,+2505,+Hortol%C3%A2ndia,+SP',
  chave_pix: 'a76647ec-c07b-4aa0-9d15-f29b80a091b6',
}
