/** Login: depois de entrar, volta para a página pedida (?voltar=) ou para a área do cliente. */
import { autenticacao } from "../servicos/conta.js";
import { destinoSeguro, parametro } from "../servicos/rotas.js";
import { $, aguardar, alternarSenhas, faixaDemonstracao, iniciarPagina, mensagemDeErro } from "../ui/comum.js";
import { emailValido, erroNoCampo, limparErros, mostrarAlerta } from "../ui/formularios.js";

iniciarPagina();
faixaDemonstracao();
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

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  limparErros(form);
  mostrarAlerta(erro, "");
  const email = form.elements.namedItem("email") as HTMLInputElement;
  const senha = form.elements.namedItem("senha") as HTMLInputElement;
  let ok = true;
  if (!emailValido(email.value)) {
    erroNoCampo(email, "Informe um e-mail válido.");
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
    await autenticacao.entrar(email.value, senha.value);
    location.href = destino;
  } catch (err) {
    aguardar(botao, false);
    mostrarAlerta(erro, mensagemDeErro(err));
  }
});
