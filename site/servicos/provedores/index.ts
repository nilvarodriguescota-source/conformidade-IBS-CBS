/**
 * Provedores em uso: login pelo Supabase e assinatura vendida pela Kiwify.
 * Enquanto o endereço e a chave pública do Supabase não forem preenchidos em config/integracoes.ts,
 * as telas usam os provedores "pendente", que avisam que a integração falta em vez de simular.
 */
import { supabaseConfigurado } from "../../config/integracoes.js";
import { autenticacaoPendente, pagamentoPendente } from "./pendente.js";
import { autenticacaoSupabase, pagamentoKiwify } from "./supabase-kiwify.js";

export const provedorAutenticacao = supabaseConfigurado() ? autenticacaoSupabase : autenticacaoPendente;
export const provedorPagamento = supabaseConfigurado() ? pagamentoKiwify : pagamentoPendente;
