/** Login: depois de entrar, volta para a página pedida (?voltar=) ou para a área do cliente. */
import { autenticacao } from "../servicos/conta.js";
import { destinoSeguro, parametro } from "../servicos/rotas.js";
import { $, aguardar, alternarSenhas, iniciarPagina, mensagemDeErro } from "../ui/comum.js";
import { emailValido, erroNoCampo, limparErros, mostrarAlerta } from "../ui/formularios.js";

iniciarPagina();
alternarSenhas();

const destino = destinoSeguro(parametro("voltar"));

autenticacao
  .sessaoAtual()
  .then((sessao) => {
    if (sessao) location.replace(destino);
  })
  .catch(() => undefined);

const form = $<HTMLFormElement>("[data-form-entrar]")!;
const erro = $("[data-erro]");
const campoEmail = form.elements.namedItem("email") as HTMLInputElement;

// Volta da Kiwify depois da compra (página de obrigado configurada na Kiwify: entrar.html?compra=ok)
if (parametro("compra")) $("[data-compra-ok]")!.hidden = false;

// Link do e-mail vencido ou já usado: o Supabase devolve o erro no endereço (#error_code=otp_expired)
const erroNoLink = new URLSearchParams(location.hash.slice(1)).get("error_code");
if (erroNoLink) {
  mostrarAlerta(erro, erroNoLink === "otp_expired" ? "Este link de acesso venceu ou já foi usado. Peça um novo abaixo." : "Não foi possível entrar pelo link. Peça um novo abaixo.", "aviso");
  history.replaceState(null, "", location.pathname + location.search);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  limparErros(form);
  mostrarAlerta(erro, "");
  const senha = form.elements.namedItem("senha") as HTMLInputElement;
  let ok = true;
  if (!emailValido(campoEmail.value)) {
    erroNoCampo(campoEmail, "Informe um e-mail válido.");
    ok = false;
  }
  if (!senha.value) {
    erroNoCampo(senha, "Informe sua senha.");
    ok = false;
  }
  if (!ok) return (form.querySelector("[aria-invalid=true]") as HTMLElement | null)?.focus();

  const botao = form.querySelector<HTMLButtonElement>("button[type=submit]")!;
  aguardar(botao, true, "Entrando...");
  try {
    await autenticacao.entrar(campoEmail.value, senha.value);
    location.href = destino;
  } catch (err) {
    aguardar(botao, false);
    mostrarAlerta(erro, mensagemDeErro(err));
  }
});

// Login sem senha (só quando o provedor oferece): link por e-mail que já entra na conta
const enviarLink = autenticacao.enviarLinkDeAcesso?.bind(autenticacao);
if (enviarLink) {
  $("[data-link-acesso]")!.hidden = false;
  const retorno = $("[data-retorno-link]");
  const botao = $<HTMLButtonElement>("[data-enviar-link]")!;
  botao.addEventListener("click", async () => {
    limparErros(form);
    mostrarAlerta(erro, "");
    mostrarAlerta(retorno, "");
    if (!emailValido(campoEmail.value)) {
      erroNoCampo(campoEmail, "Informe o e-mail da compra para receber o link.");
      return campoEmail.focus();
    }
    aguardar(botao, true, "Enviando...");
    try {
      await enviarLink(campoEmail.value, destino);
      // Mesma resposta para qualquer e-mail, para não revelar quem é cliente
      mostrarAlerta(retorno, "Se este e-mail tiver uma compra confirmada, o link de acesso chega em alguns minutos. Confira também a caixa de spam.", "sucesso");
    } catch (err) {
      mostrarAlerta(retorno, mensagemDeErro(err));
    } finally {
      aguardar(botao, false);
    }
  });
}
