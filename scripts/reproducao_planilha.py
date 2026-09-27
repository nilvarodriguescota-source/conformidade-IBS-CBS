"""
Reprodução independente da lógica da planilha "Conformidade por XML V4.1".
Reimplementa, fielmente (inclusive defeitos), as consultas Power Query
Base_CBS -> Saidas_tratadas -> Validacao_Beneficios e as fórmulas da aba oculta
Conformidade que alimentam o DASHBOARD. Compara com os valores gravados na planilha.

Uso: python3 reproducao_planilha.py planilha.xlsm
"""
import sys
import pandas as pd

ARQ = sys.argv[1] if len(sys.argv) > 1 else "planilha.xlsm"
K = "NCM completo (8 dígitos)"


def trim0(x):
    s = str(x).lstrip("0")
    return s if s else "0"


def vazio(x):
    return x is None or (isinstance(x, float) and pd.isna(x)) or str(x).strip() == ""


# ---------- Consulta Base_CBS (Power Query) ----------
def pq_base_cbs(base_dados: pd.DataFrame) -> pd.DataFrame:
    b = base_dados[[K, "Descrição legal do benefício", "CST IBS/CBS correto",
                    "cClassTrib correto", "Tratamento tributário", "Observação",
                    "Fonte TIPI/NCM", "Coluna1", "Coluna2", "Coluna3"]].copy()
    # Regra original: comparação sensível a maiúsculas/minúsculas
    b["Percentual Economia CBS"] = b["Tratamento tributário"].map(
        lambda t: 0.054 if t == "Redução de 60%" else (0.09 if t == "Alíquota zero" else 0.0))
    return b


# ---------- Consulta Saidas_tratadas (Power Query) ----------
def pq_saidas_tratadas(saidas: pd.DataFrame, base: pd.DataFrame) -> pd.DataFrame:
    s = saidas[["Produto", "NCM", "cClasstrib IBS/CBS", "CST IBS/CBS",
                "Valor do produto", "Valor Ajuste do CBS"]].copy()
    s["Valor do produto"] = pd.to_numeric(s["Valor do produto"])
    s["NCM"] = s["NCM"].map(lambda x: None if vazio(x) else str(x).strip().zfill(8))
    # LEFT JOIN por NCM -> duplica linhas quando a base tem NCM repetido
    m = s.merge(base[[K, "CST IBS/CBS correto", "cClassTrib correto", "Percentual Economia CBS"]],
                how="left", left_on="NCM", right_on=K)
    m = m.rename(columns={K: "Base_CBS." + K, "CST IBS/CBS correto": "CST correto"})

    def cst_esp(r):
        if vazio(r["NCM"]):
            return None
        return "000" if vazio(r["CST correto"]) else str(r["CST correto"]).zfill(3)

    def ccl_esp(r):
        if vazio(r["NCM"]):
            return None
        return "000001" if vazio(r["cClassTrib correto"]) else str(r["cClassTrib correto"]).zfill(6)

    m["CST esperado"] = m.apply(cst_esp, axis=1)
    m["cClassTrib esperado"] = m.apply(ccl_esp, axis=1)

    def resultado(r):
        if vazio(r["NCM"]):
            return None
        if vazio(r["CST IBS/CBS"]) or vazio(r["cClasstrib IBS/CBS"]):
            return "NÃO INFORMADO"
        ok = (trim0(r["CST IBS/CBS"]) == trim0(r["CST esperado"]) and
              trim0(r["cClasstrib IBS/CBS"]) == trim0(r["cClassTrib esperado"]))
        return "CORRETO" if ok else "INCORRETO"

    m["Resultado"] = m.apply(resultado, axis=1)

    def economia(r):
        if vazio(r["NCM"]):
            return None
        if r["Resultado"] == "INCORRETO":
            p = r["Percentual Economia CBS"]
            return None if pd.isna(p) else r["Valor do produto"] * p   # null * x = null no M
        return 0.0

    m["Economia Potencial CBS"] = m.apply(economia, axis=1)
    return m


# ---------- Consulta Validacao_Beneficios ----------
def pq_validacao(st: pd.DataFrame, base: pd.DataFrame) -> pd.DataFrame:
    f = st[st["Resultado"] == "INCORRETO"][["Produto", "Base_CBS." + K, "cClassTrib esperado",
                                             "CST esperado", "Resultado"]].drop_duplicates()
    j = f.merge(base[[K, "Descrição legal do benefício"]], how="inner",
                left_on="Base_CBS." + K, right_on=K)
    g = (j.groupby(["Produto", "Base_CBS." + K, "cClassTrib esperado", "Resultado", "CST esperado"],
                   dropna=False)["Descrição legal do benefício"]
         .agg(lambda x: " | ".join(dict.fromkeys(v for v in x if not vazio(v)))).reset_index())
    g = g.rename(columns={"Base_CBS." + K: "NCM"})
    g["É possível utilizar o benefício?"] = None
    return g[["NCM", "Produto", "cClassTrib esperado", "CST esperado",
              "Descrição legal do benefício", "É possível utilizar o benefício?"]]


# ---------- Aba Conformidade (fórmulas do DASHBOARD) ----------
def conformidade(st: pd.DataFrame, val: pd.DataFrame) -> dict:
    def marcado(resp):
        chaves = set(zip(val.loc[val["É possível utilizar o benefício?"] == resp, "NCM"],
                         val.loc[val["É possível utilizar o benefício?"] == resp, "Produto"]))
        return st.apply(lambda r: (r["NCM"], r["Produto"]) in chaves, axis=1)

    sim, nao = marcado("SIM"), marcado("NÃO")
    res, v, pct = st["Resultado"], st["Valor do produto"], st["Percentual Economia CBS"].fillna(0)
    c3 = res.notna().sum()
    c4 = (res == "CORRETO").sum() + ((res == "INCORRETO") & nao).sum()
    c5 = (res == "INCORRETO").sum() - ((res == "INCORRETO") & nao).sum()
    c6 = (res == "NÃO INFORMADO").sum()
    benef = (((res == "CORRETO") & (pct > 0)) | sim)
    c10 = v[benef].sum()
    c11 = v.sum() - c10
    c7 = c4 / c3 if c3 else 0
    c28 = ("EXCELENTE" if c7 >= .98 else "MUITO BOA" if c7 >= .95 else
           "BOA" if c7 >= .90 else "ATENÇÃO" if c7 >= .80 else "CRÍTICA")
    return {
        "C3 Resultados Totais": int(c3), "C4 Corretos": int(c4), "C5 Incorretos": int(c5),
        "C6 Não informados": int(c6), "C7 % Conformidade": c7,
        "D3 NCMs": int(st["NCM"].dropna().nunique()),
        "D6 NCMs não informados": int(st.loc[res == "NÃO INFORMADO", "NCM"].nunique()),
        "C10 Fat. beneficiado": round(c10, 2), "C11 Fat. não beneficiado": round(c11, 2),
        "C12 Fat. total": round(c10 + c11, 2),
        "C17 Benef. 60%": round(v[(pct == 0.054) & ((res == "CORRETO") | sim)].sum(), 2),
        "C20 Benef. zero": round(v[(pct == 0.09) & ((res == "CORRETO") | sim)].sum(), 2),
        "C28 Situação": c28,
        "C30 Economia estimada": round(st.loc[sim, "Economia Potencial CBS"].fillna(0).sum(), 2),
    }


if __name__ == "__main__":
    bd = pd.read_excel(ARQ, sheet_name="Base de dados", dtype=str)
    sai = pd.read_excel(ARQ, sheet_name="Saídas", dtype=str)
    res_xl = pd.read_excel(ARQ, sheet_name="Resultado", dtype=str)

    base = pq_base_cbs(bd)
    st = pq_saidas_tratadas(sai, base)
    val = pq_validacao(st, base)
    kpi = conformidade(st, val)

    # Regressão linha a linha contra a aba Resultado (ordem pode diferir: compara multiconjuntos)
    cols = ["Produto", "NCM", "Valor do produto", "CST esperado", "cClassTrib esperado", "Resultado"]
    a = st[cols].astype(str).assign(**{"Valor do produto": st["Valor do produto"].round(2).astype(str)})
    b = res_xl[cols].astype(str).assign(**{"Valor do produto": pd.to_numeric(res_xl["Valor do produto"]).round(2).astype(str)})
    diff = pd.concat([a.value_counts(), b.value_counts()], axis=1).fillna(0)
    diverg = diff[diff.iloc[:, 0] != diff.iloc[:, 1]]

    print(f"Linhas Saídas: {len(sai)} | reproduzidas: {len(st)} | aba Resultado: {len(res_xl)}")
    print(f"Divergências de conteúdo reprodução x Resultado: {len(diverg)}")
    print(f"Validacao_Beneficios reproduzida: {len(val)} linhas (planilha: 0 linhas, pois nenhum item INCORRETO)")
    for k_, v_ in kpi.items():
        print(f"  {k_}: {v_}")
    print(f"Faturamento real (sem duplicação): {pd.to_numeric(sai['Valor do produto']).sum():,.2f}")
