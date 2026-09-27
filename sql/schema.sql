-- Esquema PostgreSQL. Cada veredito guarda a regra e a versão da base usadas,
-- para que um resultado antigo continue explicável depois que a norma mudar.

CREATE TABLE empresa (
  id                BIGSERIAL PRIMARY KEY,
  cnpj              CHAR(14) NOT NULL UNIQUE,
  nome              TEXT,
  regime            TEXT NOT NULL CHECK (regime IN ('normal','simples','mei')),
  bar_ou_restaurante BOOLEAN NOT NULL DEFAULT FALSE,
  uf                CHAR(2),
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE documento (
  id             BIGSERIAL PRIMARY KEY,
  empresa_id     BIGINT NOT NULL REFERENCES empresa(id),
  chave          CHAR(44) UNIQUE,              -- deduplicação por chave de acesso
  modelo         CHAR(2),
  numero         TEXT,
  serie          TEXT,
  data_emissao   TIMESTAMPTZ,
  tipo_operacao  TEXT CHECK (tipo_operacao IN ('entrada','saida')),
  finalidade     CHAR(1),
  situacao       TEXT,
  cancelado      BOOLEAN NOT NULL DEFAULT FALSE,
  crt_emitente   CHAR(1),
  uf_emitente    CHAR(2),
  uf_destino     CHAR(2),
  arquivo        TEXT,
  avisos         JSONB NOT NULL DEFAULT '[]',
  importado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX documento_empresa_data ON documento (empresa_id, data_emissao);

CREATE TABLE item_documento (
  id            BIGSERIAL PRIMARY KEY,
  documento_id  BIGINT NOT NULL REFERENCES documento(id) ON DELETE CASCADE,
  n_item        INT NOT NULL,
  c_prod        TEXT,
  x_prod        TEXT,
  ncm           CHAR(8),
  cfop          CHAR(4),
  quantidade    NUMERIC(15,4),
  valor_produto NUMERIC(15,2) NOT NULL,
  desconto      NUMERIC(15,2) NOT NULL DEFAULT 0,
  base_calculo  NUMERIC(15,2),
  cst           CHAR(3),
  c_class_trib  CHAR(6),
  aliquotas     JSONB NOT NULL DEFAULT '{}',
  natureza      TEXT CHECK (natureza IN ('mercadoria','preparado_no_local','bebida_alcoolica','servico')),
  UNIQUE (documento_id, n_item)
);
CREATE INDEX item_ncm ON item_documento (ncm);

-- Base normativa versionada -------------------------------------------------

CREATE TABLE versao_base (
  id          BIGSERIAL PRIMARY KEY,
  versao      TEXT NOT NULL UNIQUE,
  origem      TEXT NOT NULL,
  extraida_em DATE NOT NULL,
  aprovada_por TEXT,
  aprovada_em TIMESTAMPTZ
);

CREATE TABLE regra_classificacao (
  id                BIGSERIAL PRIMARY KEY,
  versao_base_id    BIGINT NOT NULL REFERENCES versao_base(id),
  chave_regra       TEXT NOT NULL,             -- ncm-codigo-anexo-item
  ncm               CHAR(8) NOT NULL,
  cst               CHAR(3) NOT NULL,
  c_class_trib      CHAR(6) NOT NULL,
  tratamento        TEXT NOT NULL CHECK (tratamento IN ('aliquota_zero','reducao_60','reducao_40')),
  reducao_aliquota  NUMERIC(4,3) NOT NULL,
  anexo             TEXT NOT NULL,
  item              TEXT,
  fundamento_legal  TEXT NOT NULL,
  rotulo            TEXT NOT NULL,
  descricao_legal   TEXT NOT NULL,
  vedacoes          TEXT,                       -- exceções do anexo, do portal da conformidade
  descricao_ncm_tipi TEXT,
  origem_registro   TEXT,
  vigencia_inicio   DATE NOT NULL,
  vigencia_fim      DATE,
  fonte             TEXT NOT NULL,
  UNIQUE (versao_base_id, chave_regra)
);
CREATE INDEX regra_ncm_vigencia ON regra_classificacao (ncm, vigencia_inicio, vigencia_fim);

CREATE TABLE parametro_aliquota (
  id        BIGSERIAL PRIMARY KEY,
  tributo   TEXT NOT NULL CHECK (tributo IN ('CBS','IBS')),
  inicio    DATE NOT NULL,
  fim       DATE,
  aliquota  NUMERIC(6,5) NOT NULL,
  tipo      TEXT NOT NULL CHECK (tipo IN ('vigente','projecao')),
  fonte     TEXT NOT NULL,
  UNIQUE (tributo, inicio, tipo)
);

-- Vereditos e validação humana ---------------------------------------------

CREATE TABLE veredito (
  id                 BIGSERIAL PRIMARY KEY,
  item_id            BIGINT NOT NULL REFERENCES item_documento(id) ON DELETE CASCADE,
  versao_base_id     BIGINT NOT NULL REFERENCES versao_base(id),
  estado             TEXT NOT NULL CHECK (estado IN
                       ('CORRETO','INCORRETO_ECONOMIA','INCORRETO_RISCO',
                        'REQUER_VALIDACAO','NAO_OBRIGATORIO','INDETERMINADO')),
  motivo             TEXT NOT NULL,
  cst_esperado       CHAR(3),
  c_class_trib_esperado CHAR(6),
  regra_aplicada_id  BIGINT REFERENCES regra_classificacao(id),
  regras_candidatas  JSONB NOT NULL DEFAULT '[]',
  base_calculo       NUMERIC(15,2) NOT NULL,
  economia_potencial NUMERIC(15,2),
  exposicao          NUMERIC(15,2),
  aliquotas_usadas   JSONB NOT NULL DEFAULT '[]',
  dados_faltantes    JSONB NOT NULL DEFAULT '[]',
  calculado_em       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX veredito_estado ON veredito (estado);

-- Resposta humana sobre o enquadramento na descrição legal. Fica fora do
-- processamento: reprocessar nunca apaga o que foi respondido.
CREATE TABLE validacao_beneficio (
  id             BIGSERIAL PRIMARY KEY,
  empresa_id     BIGINT NOT NULL REFERENCES empresa(id),
  ncm            CHAR(8) NOT NULL,
  c_prod         TEXT NOT NULL,
  regra_id       BIGINT NOT NULL REFERENCES regra_classificacao(id),
  resposta       TEXT NOT NULL CHECK (resposta IN ('SIM','NAO')),
  justificativa  TEXT,
  autor          TEXT NOT NULL,
  respondido_em  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (empresa_id, ncm, c_prod, regra_id)
);

-- Histórico de alterações da resposta, para auditoria.
CREATE TABLE validacao_historico (
  id            BIGSERIAL PRIMARY KEY,
  validacao_id  BIGINT NOT NULL REFERENCES validacao_beneficio(id) ON DELETE CASCADE,
  resposta      TEXT NOT NULL,
  justificativa TEXT,
  autor         TEXT NOT NULL,
  registrado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
