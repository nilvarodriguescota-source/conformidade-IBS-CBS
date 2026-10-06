/** Cadastro: escolhe o plano, cria a conta e segue para o pagamento. */
import { configuracaoPlanos, equivalenteMensal, planoDestaque, planoPorId, type Plano } from "../config/planos.js";
import { autenticacao, pagamento } from "../servicos/conta.js";
import { cicloDaUrl, parametro, rotas } from "../servicos/rotas.js";
import type { CicloCobranca } from "../servicos/tipos.js";
import { $, $$, aguardar, alternarSenhas, esc, faixaDemonstracao, formatarMoeda, icone, iniciarPagina, mensagemDeErro, segmentado } from "../ui/comum.js";
import {
  aplicarMascaras,
  cnpjValido,
  emailValido,
  erroNoCampo,
  limparErros,
  marcarEtapas,
  medidorDeSenha,
  mostrarAlerta,
} from "../ui/formularios.js";

iniciarPagina();
faixaDemonstracao();
alternarSenhas();
aplicarMascaras();
marcarEtapas("conta");

let plano: Plano = planoPorId(parametro("plano")) ?? planoDestaque();
let ciclo: CicloCobranca = cicloDaUrl() ?? configuracaoPlanos.cicloPadrao;

const opcoes = $("[data-opcoes-plano]")!;
const linkEntrar = $<HTMLAnchorElement>("[data-link-entrar-cadastro]");

function sincronizarUrl(): void {
  history.replaceState(null, "", rotas.cadastro(plano.id, ciclo));
  if (linkEntrar) linkEntrar.href = rotas.entrar(rotas.checkout(plano.id, ciclo));
}

function precoCurto(p: Plano): string {
  const mensal = equivalenteMensal(p, ciclo);
  return mensal == null ? "Sob consulta" : `${formatarMoeda(mensal)}<small>/mês</small>`;
}

function desenharOpcoes(): void {
  opcoes.innerHTML = configuracaoPlanos.planos
    .map(
      (p) => `<button type="button" class="opcao-plano" role="radio" aria-checked="${p.id === plano.id}" data-id="${esc(p.id)}">
        ${p.destaque && p.seloDestaque ? `<span class="opcao-selo">${esc(p.seloDestaque)}</span>` : ""}
        <b>${esc(p.nome)}</b>
        <span class="opcao-preco">${precoCurto(p)}</span>
        <span class="opcao-limite">${p.limites.map((l) => `<span>${esc(l.rotulo)}: <b>${esc(l.valor)}</b></span>`).join("")}</span>
      </button>`,
    )
    .join("");
}

opcoes.addEventListener("click", (e) => {
  const botao = (e.target as HTMLElement).closest<HTMLButtonElement>(".opcao-plano");
  if (!botao) return;
  plano = planoPorId(botao.dataset.id) ?? plano;
  $$(".opcao-plano", opcoes).forEach((b) => b.setAttribute("aria-checked", String(b === botao)));
  sincronizarUrl();
});
// Setas do teclado no grupo de opções
opcoes.addEventListener("keydown", (e) => {
  if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(e.key)) return;
  e.preventDefault();
  const botoes = $$<HTMLButtonElement>(".opcao-plano", opcoes);
  const i = botoes.findIndex((b) => b.getAttribute("aria-checked") === "true");
  const proximo = botoes[(i + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) + botoes.length) % botoes.length]!;
  proximo.click();
  proximo.focus();
});

const vantagem = $("[data-vantagem-anual]");
if (vantagem) vantagem.textContent = configuracaoPlanos.vantagemAnual;
const seletorCiclo = $("[data-ciclo]");
if (seletorCiclo) {
  segmentado(seletorCiclo, (valor) => {
    ciclo = valor === "anual" ? "anual" : "mensal";
    desenharOpcoes();
    sincronizarUrl();
  })(ciclo);
}
desenharOpcoes();
sincronizarUrl();

const form = $<HTMLFormElement>("[data-form-cadastro]")!;
const erro = $("[data-erro]");
medidorDeSenha(form.elements.namedItem("senha") as HTMLInputElement, $("[data-forca]"), $("[data-forca-texto]"));

// Quem já está logado não precisa de outra conta: segue direto para o pagamento
autenticacao
  .sessaoAtual()
  .then((sessao) => {
    if (!sessao) return;
    const aviso = $("[data-ja-logado]")!;
    aviso.innerHTML = `${icone("info")}<div><strong>Você já está conectado como ${esc(sessao.usuario.email)}.</strong><br>Continue para o pagamento do plano escolhido ou vá para a sua conta.
      <div class="acoes-alerta"><a class="btn btn-verde btn-pequeno" data-continuar href="#">Continuar para o pagamento ${icone("seta", "i-seta")}</a>
      <a class="btn btn-contorno btn-pequeno" href="${rotas.conta}">Minha conta</a></div></div>`;
    aviso.hidden = false;
    form.hidden = true;
    $("[data-continuar]", aviso)!.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await pagamento.registrarEscolhaDePlano(sessao.usuario, plano.id, ciclo);
        location.href = rotas.checkout(plano.id, ciclo);
      } catch (err) {
        mostrarAlerta(erro, mensagemDeErro(err));
      }
    });
  })
  .catch(() => undefined);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  limparErros(form);
  mostrarAlerta(erro, "");
  const campo = (nome: string) => form.elements.namedItem(nome) as HTMLInputElement;
  const nome = campo("nome");
  const email = campo("email");
  const cnpj = campo("cnpj");
  const senha = campo("senha");
  const termos = campo("termos");

  const problemas: Array<[HTMLInputElement, string]> = [];
  if (nome.value.trim().length < 2) problemas.push([nome, "Informe seu nome."]);
  if (!emailValido(email.value)) problemas.push([email, "Informe um e-mail válido."]);
  if (cnpj.value.trim() && !cnpjValido(cnpj.value)) problemas.push([cnpj, "CNPJ inválido. Confira os números ou deixe em branco."]);
  if (senha.value.length < 8) problemas.push([senha, "A senha precisa ter pelo menos 8 caracteres."]);
  problemas.forEach(([input, msg]) => erroNoCampo(input, msg));
  if (!termos.checked) {
    mostrarAlerta(erro, "Para continuar, aceite os Termos de uso e a Política de privacidade.");
    if (!problemas.length) return termos.focus();
  }
  if (problemas.length) return problemas[0]![0].focus();
  if (!termos.checked) return;

  const botao = $<HTMLButtonElement>("[data-enviar]", form)!;
  aguardar(botao, true, "Criando sua conta...");
  try {
    const sessao = await autenticacao.cadastrar({
      nome: nome.value,
      email: email.value,
      senha: senha.value,
      empresa: campo("empresa").value || null,
      cnpj: cnpj.value || null,
      telefone: campo("telefone").value || null,
    });
    await pagamento.registrarEscolhaDePlano(sessao.usuario, plano.id, ciclo);
    location.href = rotas.checkout(plano.id, ciclo);
  } catch (err) {
    aguardar(botao, false);
    mostrarAlerta(erro, mensagemDeErro(err));
  }
});
