import * as removeAccents from 'remove-accents';

export const encontrarTermos = (comandoConfigurado, comandoDoUsuario) => {
    comandoDoUsuario = limparComando(comandoDoUsuario);
    comandoConfigurado = limparComando(comandoConfigurado);
    let comandosEncontrados = 0;
    comandoConfigurado.forEach(elementoConfigurado => {
        if (comandoDoUsuario.includes(elementoConfigurado)) {
            comandosEncontrados++;
        }
    });
    return comandosEncontrados === comandoConfigurado.length;
};

export const limparComando = texto => {
    let comandoFotoFormatado = removeAccents.remove(texto.trim().toLowerCase());
    comandoFotoFormatado = comandoFotoFormatado.replace(/[^(\w|\s)]/gm, ' ').split(' ').filter(elemento => !!elemento);
    return comandoFotoFormatado;
};
