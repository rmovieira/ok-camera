import * as interpretadorVozTexto from '../InterpretadorVozTexto';

test('Deve remover todos os acentos e retornar em formato de array', () => {
    const comando = 'não sim, pois é, à esquerda, vovô vovó';
    const comandoLimpo = ['nao', 'sim', 'pois', 'e', 'a', 'esquerda', 'vovo', 'vovo'];
    const textoLimpo = interpretadorVozTexto.limparComando(comando);
    expect(textoLimpo).toStrictEqual(comandoLimpo);
});

test('Deve reconhecer como um comando', () => {
    const comandoDoUsuario = 'Ok camera, você deve iniciar gravação de vídeo.';
    const comandoConfigurado = 'Ok camera, iniciar gravação de vídeo.';
    const comandoEncontrado = interpretadorVozTexto.encontrarTermos(comandoConfigurado, comandoDoUsuario);
    expect(comandoEncontrado).toBeTruthy();
});

test('Nao deve reconhecer como um comando', () => {
    const comandoDoUsuario = 'Ok iniciar gravação.';
    const comandoConfigurado = 'Ok camera, iniciar gravação de vídeo.';
    const comandoEncontrado = interpretadorVozTexto.encontrarTermos(comandoConfigurado, comandoDoUsuario);
    expect(comandoEncontrado).toBeFalsy();
});
