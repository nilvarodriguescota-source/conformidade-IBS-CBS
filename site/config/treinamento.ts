/**
 * Treinamento em vídeo (aba "Treinamento" da área do cliente).
 *
 * Para adicionar, tirar ou reordenar aulas, edite a lista `videos`: cole o link do YouTube
 * (youtu.be/... ou youtube.com/watch?v=...) e, se quiser, o título. Sem título, a tela busca o
 * nome do vídeo no próprio YouTube e, se não conseguir, mostra "Aula 1", "Aula 2"...
 */
export interface AulaTreinamento {
  link: string;
  titulo?: string | null;
  /** Uma frase sobre o que a aula mostra (opcional). */
  descricao?: string | null;
}

export const treinamento = {
  titulo: "Treinamento em vídeo",
  descricao: "O passo a passo do sistema, do envio dos XMLs ao relatório final. Assista na ordem ou vá direto à aula que precisa.",
  /** Link da playlist no YouTube (opcional): aparece o botão "Abrir no YouTube". */
  playlist: null as string | null,
  videos: [
    { link: "https://youtu.be/PaIuvfnKQzI" },
    { link: "https://youtu.be/tZPK66V9SqQ" },
    { link: "https://youtu.be/CwAljIJzdIA" },
    { link: "https://youtu.be/Di4qiVACHE4" },
    { link: "https://youtu.be/yYEQo6jqxAM" },
    { link: "https://youtu.be/rTyv7cO9iiQ" },
  ] as AulaTreinamento[],
};

/** Código do vídeo a partir de qualquer link comum do YouTube (null se não reconhecer). */
export function codigoDoVideo(link: string): string | null {
  const m = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/.exec(link.trim());
  return m ? m[1]! : /^[\w-]{11}$/.test(link.trim()) ? link.trim() : null;
}
