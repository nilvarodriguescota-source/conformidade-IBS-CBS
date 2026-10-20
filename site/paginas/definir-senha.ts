/**
 * Criar senha: destino do convite enviado depois da compra e do link de "Esqueci minha senha".
 * O próprio link já abre a sessão; aqui o cliente só grava a senha e segue para a área do cliente.
 */
import { autenticacao } from "../servicos/conta.js";
import { rotas } from "../servicos/rotas.js";
import { $, aguardar, alternarSenhas, icone, iniciarPagina, mensagemDeErro } from "../ui/comum.js";
import { erroNoCampo, limparErros, medidorDeSenha, mostrarAlerta } from "../ui/formularios.js";

iniciarPagina();
alternarSenhas();

const form = $<HTMLFormElement>("[data-form-senha]")!;
const retorno = $("[data-retorno]");
const sub = $("[data-sub]")!;
const campo = (nome: string) => form.elements.namedItem(nome) as HTMLInputElement;
medidorDeSenha(campo("senha"), $("[data-forca]"), $("[data-forca-texto]"));

// Link vencido ou já usado: o Supabase devolve o erro no endereço
const erroNoLink = new URLSearchParams(location.hash.slice(1)).get("error_code");

async function iniciar(): Promise<void> {
  const sessao = erroNoLink ? null : await autenticacao.sessaoAtual();
  if (!sessao || !autenticacao.definirSenha) {
    $("[data-titulo]")!.textContent = "Link vencido";
    sub.textContent = "";
    retorno!.className = "alerta alerta-aviso";
    retorno!.innerHTML = `${icone("info")}<span>Este link venceu ou já foi usado. Peça um novo em <a class="auth-link" href="${rotas.recuperarSenha}">Esqueci minha senha</a> ou entre com um link de acesso em <a class="auth-link" href="${rotas.entrar()}">Entrar</a>.</span>`;
    retorno!.hidden = false;
    return;
  }
  sub.textContent = `Conta ${sessao.usuario.email}. Crie uma senha para entrar das próximas vezes.`;
  form.hidden = false;
  $("[data-pular]")!.hidden = false;
  campo("senha").focus();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    limparErros(form);
    mostrarAlerta(retorno, "");
    const senha = campo("senha");
    const confirmar = campo("confirmar");
    if (senha.value.length < 8) {
      erroNoCampo(senha, "A senha precisa ter pelo menos 8 caracteres.");
      return senha.focus();
    }
    if (senha.value !== confirmar.value) {
      erroNoCampo(confirmar, "As duas senhas não são iguais.");
      return confirmar.focus();
    }
    const botao = form.querySelector<HTMLButtonElement>("button[type=submit]")!;
    aguardar(botao, true, "Salvando...");
    try {
      await autenticacao.definirSenha!(senha.value);
      location.href = rotas.conta;
    } catch (err) {
      aguardar(botao, false);
      mostrarAlerta(retorno, mensagemDeErro(err));
    }
  });
}

iniciar().catch((err) => mostrarAlerta(retorno, mensagemDeErro(err)));
