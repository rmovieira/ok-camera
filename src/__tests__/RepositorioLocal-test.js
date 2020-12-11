import * as RepositorioLocal from '../RepositorioLocal';

describe('Armazenamento de dados', () => {
    test('Deve guardar e recuperar os dados corretamente', async () => {
        const dados = {
            comandoFoto: 'Ok camera, tirar foto',
            comandoIniciarGravacao: 'Ok camera, iniciar gravação',
            comandoPararGravacao: 'Ok camera, parar gravação',
            habilitarVoz: true,
        }
        await RepositorioLocal.salvarConfiguracoes(dados);
        const dadosRecuperados = await RepositorioLocal.recuperarConfiguracoes();
        expect(dados).toEqual(dadosRecuperados);
    });
});
