import AsyncStorage from '@react-native-async-storage/async-storage';

const CONFIGURACOES = 'CONFIGURACOES';

export const salvarConfiguracoes = async (configuracoes) => {
    try {
        const valorFormatado = JSON.stringify(configuracoes);
        await AsyncStorage.setItem(CONFIGURACOES, valorFormatado);
    } catch (e) {
        // que erro pode aparecer aqui?
    }
}


export const recuperarConfiguracoes = async () => {
    try {
        let valor = await AsyncStorage.getItem(CONFIGURACOES);
        if (!valor) {
            return {
                comandoFoto: 'tirar foto',
                comandoIniciarGravacao: 'iniciar gravação',
                comandoPararGravacao: 'parar gravação',
                habilitarVoz: true,
            }
        }
        return JSON.parse(valor);
    } catch (e) {
        // que erro pode aparecer aqui?
    }
}

