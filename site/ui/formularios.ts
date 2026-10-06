/** Validação, máscaras e mensagens dos formulários de conta. */
import { $, $$, esc, icone } from "./comum.js";

export const emailValido = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

export function cnpjValido(cnpj: string): boolean {
  const d = cnpj.replace(/\D/g, "");
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
  const digito = (base: string) => {
    const pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = pesos.reduce((s, p, i) => s + p * Number(base[i]), 0);
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return digito(d.slice(0, 12)) === Number(d[12]) && digito(d.slice(0, 13)) === Number(d[13]);
}

/** Marca o campo como inválido e mostra a mensagem abaixo dele (ou limpa, com mensagem vazia). */
export function erroNoCampo(input: HTMLInputElement, mensagem: string): void {
  const campo = input.closest(".campo");
  if (!campo) return;
  campo.classList.toggle("invalido", !!mensagem);
  input.setAttribute("aria-invalid", String(!!mensagem));
  let el = $(".erro-campo", campo);
  if (!mensagem) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("span");
    el.className = "erro-campo";
    el.id = `${input.id}-erro`;
    input.setAttribute("aria-describedby", el.id);
    campo.append(el);
  }
  el.textContent = mensagem;
}

export function limparErros(form: HTMLFormElement): void {
  for (const input of $$<HTMLInputElement>("input", form)) erroNoCampo(input, "");
}

export function mostrarAlerta(el: HTMLElement | null, mensagem: string, tipo: "erro" | "aviso" | "sucesso" | "" = "erro", rolar = true): void {
  if (!el) return;
  if (!mensagem) {
    el.hidden = true;
    return;
  }
  el.className = `alerta${tipo ? ` alerta-${tipo}` : ""}`;
  const simbolo = tipo === "sucesso" ? "check-circulo" : tipo === "erro" ? "alerta" : "info";
  el.innerHTML = `${icone(simbolo)}<span>${esc(mensagem)}</span>`;
  el.hidden = false;
  if (rolar) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function mascarar(valor: string, tipo: string): string {
  const d = valor.replace(/\D/g, "");
  if (tipo === "cnpj") {
    return d
      .slice(0, 14)
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  if (tipo === "telefone") {
    const n = d.slice(0, 11);
    if (n.length <= 10) return n.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
    return n.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
  }
  return valor;
}

export function aplicarMascaras(raiz: ParentNode = document): void {
  for (const input of $$<HTMLInputElement>("[data-mascara]", raiz)) {
    input.addEventListener("input", () => {
      input.value = mascarar(input.value, input.dataset.mascara!);
    });
  }
}

/** 0 (vazia) a 4 (forte). */
export function forcaDaSenha(senha: string): number {
  if (!senha) return 0;
  let pontos = 0;
  if (senha.length >= 8) pontos++;
  if (senha.length >= 12) pontos++;
  if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) pontos++;
  if (/\d/.test(senha)) pontos++;
  if (/[^A-Za-z0-9]/.test(senha)) pontos++;
  return Math.max(1, Math.min(4, pontos - (senha.length < 8 ? 1 : 0)));
}

export function medidorDeSenha(input: HTMLInputElement, barra: HTMLElement | null, texto: HTMLElement | null): void {
  const rotulos = ["Use letras, números e um símbolo para uma senha forte.", "Senha fraca", "Senha razoável", "Senha boa", "Senha forte"];
  input.addEventListener("input", () => {
    const nivel = forcaDaSenha(input.value);
    barra?.setAttribute("data-nivel", String(nivel));
    if (texto) texto.textContent = input.value.length && input.value.length < 8 ? "Mínimo de 8 caracteres." : rotulos[nivel]!;
  });
}

/** Indicador de etapas da contratação: marca as anteriores como feitas e a atual. */
export function marcarEtapas(atual: string, feitasExtras: string[] = []): void {
  const ordem = ["plano", "conta", "pagamento", "acesso"];
  const posicao = ordem.indexOf(atual);
  for (const li of $$("[data-etapa]")) {
    const i = ordem.indexOf(li.dataset.etapa!);
    const feita = i < posicao || feitasExtras.includes(li.dataset.etapa!);
    li.classList.toggle("feita", feita);
    li.classList.toggle("atual", i === posicao && !feita);
    if (i === posicao && !feita) li.setAttribute("aria-current", "step");
    else li.removeAttribute("aria-current");
  }
}
