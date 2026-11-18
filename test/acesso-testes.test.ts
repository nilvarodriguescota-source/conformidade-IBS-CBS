import { test } from "node:test";
import assert from "node:assert/strict";
import { acessoLivreParaTestes } from "../site/config/ambiente.js";

test("acesso sem login só em Deploy Preview do Netlify", () => {
  assert.equal(acessoLivreParaTestes("deploy-preview-23--conformidadeibscbs.netlify.app", "1"), true);
  // Produção do Netlify, Hostinger, branch deploy e build que não é de prévia: login obrigatório
  assert.equal(acessoLivreParaTestes("conformidadeibscbs.netlify.app", "1"), false);
  assert.equal(acessoLivreParaTestes("saboresestrategicos.com.br", "1"), false);
  assert.equal(acessoLivreParaTestes("claude-teste--conformidadeibscbs.netlify.app", "1"), false);
  assert.equal(acessoLivreParaTestes("deploy-preview-23--conformidadeibscbs.netlify.app", ""), false);
  assert.equal(acessoLivreParaTestes("deploy-preview-23--conformidadeibscbs.netlify.app.exemplo.com", "1"), false);
});
