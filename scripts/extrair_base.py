"""
Extrai a aba "Base de dados" da planilha e gera a base normativa saneada
(data/base-normativa.json), corrigindo os defeitos D10 a D13 do diagnóstico e
registrando cada problema encontrado em data/base-normativa-relatorio.json.

Uso: python3 scripts/extrair_base.py ../planilha.xlsm
"""
import sys
import json
import re
from datetime import date
import pandas as pd

ARQ = sys.argv[1] if len(sys.argv) > 1 else "../planilha.xlsm"
K = "NCM completo (8 dígitos)"

# cClassTrib -> (anexo esperado, artigo, percentual de redução da alíquota)
# Fonte: tabela oficial de classificação tributária (CST/cClassTrib) e LC 214/2025.
CATALOGO = {
    "200003": {"anexo": "I", "artigo": "Art. 125", "reducao": 1.00, "rotulo": "Cesta Básica Nacional de Alimentos"},
    "200004": {"anexo": "XII", "artigo": "Art. 144", "reducao": 1.00, "rotulo": "Dispositivos médicos - Anexo XII"},
    "200007": {"anexo": "XIII", "artigo": "Art. 145", "reducao": 1.00, "rotulo": "Dispositivos de acessibilidade - Anexo XIII"},
    "200014": {"anexo": "XV", "artigo": "Art. 148", "reducao": 1.00, "rotulo": "Hortícolas, frutas e ovos"},
    "200030": {"anexo": "IV", "artigo": "Art. 131", "reducao": 0.60, "rotulo": "Dispositivos médicos - Anexo IV"},
    "200031": {"anexo": "V", "artigo": "Art. 132", "reducao": 0.60, "rotulo": "Dispositivos de acessibilidade - Anexo V"},
    "200033": {"anexo": "VI", "artigo": "Art. 133", "reducao": 0.60, "rotulo": "Composições nutricionais - Anexo VI"},
    "200034": {"anexo": "VII", "artigo": "Art. 135", "reducao": 0.60, "rotulo": "Alimentos para consumo humano - Anexo VII"},
    "200035": {"anexo": "VIII", "artigo": "Art. 136", "reducao": 0.60, "rotulo": "Higiene pessoal e limpeza - Anexo VIII"},
    "200038": {"anexo": "IX", "artigo": "Art. 138", "reducao": 0.60, "rotulo": "Insumos agropecuários e aquícolas - Anexo IX"},
    "200039": {"anexo": "X", "artigo": "Art. 139", "reducao": 0.60, "rotulo": "Produções artísticas nacionais - Anexo X"},
    "200043": {"anexo": "XI", "artigo": "Art. 142", "reducao": 0.60, "rotulo": "Soberania e segurança nacional - Anexo XI"},
}


def norm_ncm(v, desc_legal):
    """NCM com 8 dígitos. Zero à esquerda perdido pelo Excel é reposto (D11)."""
    s = re.sub(r"\D", "", str(v or ""))
    if len(s) == 8:
        return s, None
    if len(s) == 7:
        return "0" + s, f"NCM com 7 dígitos ajustado para 0{s}"
    return None, f"NCM inválido: {v!r} ({desc_legal[:40]})"


def main():
    bd = pd.read_excel(ARQ, sheet_name="Base de dados", dtype=str).fillna("")
    regras, problemas = [], []

    for i, r in bd.iterrows():
        linha = i + 2
        desc = r["Descrição legal do benefício"].strip()
        ncm, aviso = norm_ncm(r[K], desc)
        if aviso:
            problemas.append({"linha": linha, "tipo": "ncm", "detalhe": aviso})
        if not ncm:
            continue

        ccl = re.sub(r"\D", "", r["cClassTrib correto"])
        tratamento = r["Tratamento tributário"].strip()
        # D12: linhas com colunas deslocadas guardam o código em Coluna1..3
        if not ccl and re.fullmatch(r"\d{6}", re.sub(r"\D", "", r.get("Coluna1", ""))):
            ccl = re.sub(r"\D", "", r["Coluna1"])
            tratamento = r.get("Coluna3", "").strip() or tratamento
            problemas.append({"linha": linha, "tipo": "colunas_deslocadas",
                              "detalhe": f"NCM {ncm}: código recuperado de Coluna1"})
        if not ccl:
            problemas.append({"linha": linha, "tipo": "sem_codigo", "detalhe": f"NCM {ncm} sem cClassTrib"})
            continue

        cat = CATALOGO.get(ccl)
        if not cat:
            problemas.append({"linha": linha, "tipo": "codigo_desconhecido",
                              "detalhe": f"cClassTrib {ccl} fora do catálogo"})
            continue

        anexo = r["Anexo"].strip()
        if anexo and anexo != cat["anexo"]:
            problemas.append({"linha": linha, "tipo": "anexo_divergente",
                              "detalhe": f"NCM {ncm}: anexo {anexo} com código {ccl} (esperado {cat['anexo']})"})

        # D10: tratamento é derivado do código, não de texto livre
        trat_esperado = "aliquota_zero" if cat["reducao"] == 1.0 else "reducao_60"
        if tratamento and tratamento.lower().replace("í", "i") not in (
                "aliquota zero", "redução de 60%", "reducao de 60%"):
            problemas.append({"linha": linha, "tipo": "tratamento_livre", "detalhe": tratamento})

        item = r["Item"].strip()
        fundamento = r["Fundamento legal"].strip()
        # D13: fundamento preenchido com código NCM em vez de artigo
        if fundamento and not fundamento.lower().startswith("art"):
            problemas.append({"linha": linha, "tipo": "fundamento_invalido",
                              "detalhe": f"NCM {ncm}: fundamento '{fundamento}'"})
            fundamento = ""

        regras.append({
            "id": f"{ncm}-{ccl}-{anexo or '?'}-{item or '?'}",
            "ncm": ncm,
            "cst": re.sub(r"\D", "", r["CST IBS/CBS correto"]).zfill(3),
            "cClassTrib": ccl,
            "tratamento": trat_esperado,
            "reducaoAliquota": cat["reducao"],
            "anexo": anexo or cat["anexo"],
            "item": item,
            "fundamentoLegal": fundamento or cat["artigo"],
            "rotulo": cat["rotulo"],
            "descricaoLegal": desc,
            "descricaoNcmTipi": r["Descrição oficial NCM (TIPI)"].strip(),
            "ncmCitadoNaLei": r["NCM citado na LC 214"].strip(),
            "origemRegistro": r["Origem do registro"].strip() or "não informado",
            "observacao": r["Observação"].strip(),
            "vigenciaInicio": "2026-01-01",
            "vigenciaFim": None,
            "fonte": "LC 214/2025; planilha Base de dados V4.1",
        })

    # Duplicatas exatas (mesmo NCM e mesmo código) são redundância, não conflito.
    vistos, unicas = set(), []
    for g in regras:
        chave = (g["ncm"], g["cClassTrib"], g["descricaoLegal"])
        if chave in vistos:
            problemas.append({"tipo": "duplicata_exata", "detalhe": f"{g['ncm']} / {g['cClassTrib']}"})
            continue
        vistos.add(chave)
        unicas.append(g)

    por_ncm = {}
    for g in unicas:
        por_ncm.setdefault(g["ncm"], []).append(g)
    conflitos = {n: sorted({x["cClassTrib"] for x in v}) for n, v in por_ncm.items()
                 if len({x["cClassTrib"] for x in v}) > 1}

    base = {
        "versao": date.today().isoformat(),
        "origem": "Base de dados (BaseCBSExpandida3) da planilha V4.1, saneada",
        "catalogoCodigos": CATALOGO,
        "regras": unicas,
    }
    relatorio = {
        "linhasLidas": len(bd),
        "regrasGeradas": len(unicas),
        "ncmsDistintos": len(por_ncm),
        "ncmsComMaisDeUmaRegra": len(conflitos),
        "ncmsComCodigosConflitantes": len(conflitos),
        "conflitos": conflitos,
        "problemas": problemas,
    }
    with open("data/base-normativa.json", "w", encoding="utf8") as f:
        json.dump(base, f, ensure_ascii=False, indent=1)
    with open("data/base-normativa-relatorio.json", "w", encoding="utf8") as f:
        json.dump(relatorio, f, ensure_ascii=False, indent=1)

    print(f"regras: {len(unicas)} | NCMs: {len(por_ncm)} | NCMs com códigos conflitantes: {len(conflitos)}")
    tipos = {}
    for p in problemas:
        tipos[p["tipo"]] = tipos.get(p["tipo"], 0) + 1
    print("problemas:", tipos)


if __name__ == "__main__":
    main()
