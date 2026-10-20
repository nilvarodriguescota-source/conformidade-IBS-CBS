/**
 * Regras do sistema de XML publicado (sistema.html), usadas por web/navegador.ts:
 * quem pode abrir o sistema e o limite de XMLs por mês do plano.
 *
 * O sistema roda no navegador e o site é estático (Hostinger), então a conferência é feita aqui,
 * com a sessão do Supabase. A contagem de XMLs fica no banco (função registrar_uso_xmls): é lá
 * que o limite é decidido, não no navegador.
 */
import { carregarConta, pagamento } from "./conta.js";
import { rotas } from "./rotas.js";
import type { ResultadoUsoXmls } from "./tipos.js";

/** Para onde mandar quem não pode abrir o sistema (null = pode abrir). */
export async function destinoSemAcesso(): Promise<string | null> {
  const conta = await carregarConta();
  if (!conta.sessao) return rotas.entrar(rotas.sistema);
  if (!conta.acesso.liberado) return rotas.contaSecao("assinatura");
  return null;
}

const milhar = (n: number) => n.toLocaleString("pt-BR");

/** Texto para a tela quando a análise passa do limite (ou não pode ser contada). */
export function mensagemDeLimite(r: ResultadoUsoXmls): string {
  if (r.motivo === "sem_sessao") return "Sua sessão terminou. Entre novamente na sua conta para processar a análise.";
  if (r.motivo === "sem_assinatura") return "Sua assinatura não está ativa. Confira a situação em Minha conta → Assinatura.";
  if (r.motivo === "lista_invalida") return "Não foi possível contar as notas desta análise. Inicie uma nova análise e envie os XMLs de novo.";
  const limite = r.limite ?? 0;
  const restam = Math.max(0, limite - r.usados);
  return (
    `Limite do plano: até ${milhar(limite)} XMLs de venda por mês. ` +
    `Neste mês você já analisou ${milhar(r.usados)} ${r.usados === 1 ? "nota" : "notas"}, e esta análise tem ${milhar(r.novos)} ${r.novos === 1 ? "nota nova" : "notas novas"}` +
    (restam > 0 ? ` (cabem mais ${milhar(restam)}). ` : ". ") +
    "Clique em \"Nova análise\" e envie menos XMLs, ou fale com a gente para mudar de plano. O limite renova no dia 1º de cada mês. " +
    "Notas já analisadas no mês não contam de novo."
  );
}

/**
 * Conta as notas da análise no mês antes de processar. Devolve null quando pode seguir,
 * ou a mensagem para a tela quando o banco recusou.
 */
export async function conferirLimiteDeXmls(notas: string[]): Promise<string | null> {
  if (!notas.length) return null;
  const r = await pagamento.registrarUsoDeXmls(notas);
  return r.permitido ? null : mensagemDeLimite(r);
}
