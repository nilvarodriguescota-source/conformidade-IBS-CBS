/**
 * Controle de acesso: decide, a partir da sessão e da assinatura, se o cliente pode
 * abrir o sistema e quais recursos o plano dele libera.
 *
 * Hoje esta decisão roda no navegador e serve para a experiência (o que mostrar,
 * para onde mandar). Proteção de verdade exige que o servidor faça a mesma
 * verificação antes de entregar o sistema: ver "Controle de acesso" em site/README.md.
 */
import { catalogoRecursos, planoPorId, type Plano, type RecursoId } from "../config/planos.js";
import type { Assinatura, Sessao } from "./tipos.js";
import { rotas } from "./rotas.js";

export type MotivoAcesso =
  | "sem_sessao"
  | "sem_assinatura"
  | "pagamento_pendente"
  | "em_atraso"
  | "cancelada_vigente"
  | "cancelada_encerrada"
  | "ativa";

export interface SituacaoAcesso {
  liberado: boolean;
  motivo: MotivoAcesso;
  titulo: string;
  mensagem: string;
  acao: { rotulo: string; href: string } | null;
}

export function situacaoDeAcesso(sessao: Sessao | null, assinatura: Assinatura | null, agora = new Date()): SituacaoAcesso {
  if (!sessao) {
    return { liberado: false, motivo: "sem_sessao", titulo: "Entre na sua conta", mensagem: "Faça login para acessar o sistema.", acao: { rotulo: "Entrar", href: rotas.entrar(rotas.conta) } };
  }
  if (!assinatura) {
    return {
      liberado: false,
      motivo: "sem_assinatura",
      titulo: "Escolha um plano para liberar o acesso",
      mensagem: "Sua conta está criada. Falta só escolher o plano e concluir a assinatura.",
      acao: { rotulo: "Ver planos", href: rotas.planos },
    };
  }
  const continuar = { rotulo: "Concluir pagamento", href: rotas.checkout(assinatura.planoId, assinatura.ciclo) };
  switch (assinatura.status) {
    case "ativa":
      return { liberado: true, motivo: "ativa", titulo: "Assinatura ativa", mensagem: "Seu acesso ao sistema está liberado.", acao: null };
    case "pendente_pagamento":
      return {
        liberado: false,
        motivo: "pagamento_pendente",
        titulo: "Pagamento pendente",
        mensagem: "Assim que o pagamento for confirmado, o acesso ao sistema é liberado automaticamente.",
        acao: continuar,
      };
    case "em_atraso":
      return {
        liberado: true,
        motivo: "em_atraso",
        titulo: "Pagamento em atraso",
        mensagem: "Não conseguimos confirmar a última cobrança. Atualize o pagamento para não perder o acesso.",
        acao: { rotulo: "Atualizar pagamento", href: rotas.contaSecao("assinatura") },
      };
    case "cancelada": {
      const vigente = assinatura.fimPeriodo != null && new Date(assinatura.fimPeriodo) > agora;
      return vigente
        ? {
            liberado: true,
            motivo: "cancelada_vigente",
            titulo: "Assinatura cancelada",
            mensagem: "Você continua com acesso até o fim do período já pago.",
            acao: { rotulo: "Reativar assinatura", href: rotas.checkout(assinatura.planoId, assinatura.ciclo) },
          }
        : {
            liberado: false,
            motivo: "cancelada_encerrada",
            titulo: "Assinatura encerrada",
            mensagem: "O período pago terminou. Reative a assinatura para voltar a usar o sistema.",
            acao: { rotulo: "Reativar assinatura", href: rotas.checkout(assinatura.planoId, assinatura.ciclo) },
          };
    }
  }
}

export function planoDaAssinatura(assinatura: Assinatura | null): Plano | undefined {
  return planoPorId(assinatura?.planoId);
}

/** Recursos liberados pelo plano da assinatura (vazio sem acesso). */
export function recursosLiberados(sessao: Sessao | null, assinatura: Assinatura | null): Set<RecursoId> {
  if (!situacaoDeAcesso(sessao, assinatura).liberado) return new Set();
  return new Set(planoDaAssinatura(assinatura)?.recursos ?? []);
}

/**
 * PONTO DE INTEGRAÇÃO com o sistema de XML: hoje o sistema não limita recursos por
 * plano. Quando passar a limitar, ele deve consultar esta mesma regra (no servidor).
 */
export function podeUsar(recurso: RecursoId, sessao: Sessao | null, assinatura: Assinatura | null): boolean {
  return recursosLiberados(sessao, assinatura).has(recurso);
}

export function nomeDoRecurso(recurso: RecursoId): string {
  return catalogoRecursos[recurso].nome;
}
