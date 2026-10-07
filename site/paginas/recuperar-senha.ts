/** Recuperação de senha: pede ao provedor de autenticação o e-mail de redefinição. */
import { autenticacao } from "../servicos/conta.js";
import { ErroServico } from "../servicos/tipos.js";
import { $, aguardar, faixaDemonstracao, iniciarPagina, mensagemDeErro } from "../ui/comum.js";
import { emailValido, erroNoCampo, mostrarAlerta } from "../ui/formularios.js";

iniciarPagina();
faixaDemonstracao();

const form = $<HTMLFormElement>("[data-form-recuperar]")!;
const retorno = $("[data-retorno]");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = form.elements.namedItem("email") as HTMLInputElement;
  erroNoCampo(email, "");
  mostrarAlerta(retorno, "");
  if (!emailValido(email.value)) {
    erroNoCampo(email, "Informe um e-mail válido.");
    return email.focus();
  }
  const botao = form.querySelector<HTMLButtonElement>("button[type=submit]")!;
  aguardar(botao, true, "Enviando...");
  try {
    await autenticacao.solicitarRedefinicaoSenha(email.value);
    // Mesma resposta exista ou não a conta, para não revelar quais e-mails estão cadastrados
    mostrarAlerta(retorno, "Se houver uma conta com este e-mail, você vai receber um link para criar uma nova senha em alguns minutos. Confira também a caixa de spam.", "sucesso");
    form.hidden = true;
  } catch (err) {
    const aviso = err instanceof ErroServico && (err.codigo === "indisponivel_demonstracao" || err.codigo === "integracao_pendente");
    mostrarAlerta(retorno, mensagemDeErro(err), aviso ? "aviso" : "erro");
  } finally {
    aguardar(botao, false);
  }
});
