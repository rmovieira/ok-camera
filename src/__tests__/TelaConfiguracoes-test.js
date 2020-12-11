import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import TelaConfiguracoes from '../TelaConfiguracoes';

describe('Testes da tela de configurações', () => {

    beforeEach(() => {
        jest.useFakeTimers();
    });

    test('Deve montar a tela corretamente', async () => {
        const props = {
            visivel: true,
            habilitarVoz: false,
            fechar: () => { },
        }
        const tela = shallow(<TelaConfiguracoes {...props} />);

        expect(toJson(tela)).toMatchSnapshot();
    });

    test('Deve alterar os dados corretamente', async () => {
        const props = {
            visivel: true,
            habilitarVoz: true,
            fechar: () => { },
        }
        const tela = shallow(<TelaConfiguracoes {...props} />);

        expect(tela.find({ value: 'Ok camera, tirar foto' })).toExist();

        expect(tela.find({ value: 'Ok camera, iniciar gravação' })).toExist();

        expect(tela.find({ value: 'Ok camera, parar gravação' })).toExist();

        expect(tela.find({ testID: 'habilitar-voz' }).prop('value')).toBeTruthy();

        tela.find({ testID: 'comando-foto' }).simulate('changeText', 'texto do campo foto');
        expect(tela.find({ testID: 'comando-foto' }).prop('value')).toBe('texto do campo foto');

        tela.find({ testID: 'comando-iniciar-gravacao' }).simulate('changeText', 'texto do inicio de gravação');
        expect(tela.find({ testID: 'comando-iniciar-gravacao' }).prop('value')).toBe('texto do inicio de gravação');

        tela.find({ testID: 'comando-parar-gravacao' }).simulate('changeText', 'texto do fim da gravação');
        expect(tela.find({ testID: 'comando-parar-gravacao' }).prop('value')).toBe('texto do fim da gravação');

        tela.find({ testID: 'habilitar-voz' }).simulate('valueChange', false);

        expect(tela.find({ testID: 'habilitar-voz' }).prop('value')).toBeFalsy();
        expect(tela.find({ testID: 'comando-foto' }).prop('editable')).toBeFalsy();
        expect(tela.find({ testID: 'comando-iniciar-gravacao' }).prop('editable')).toBeFalsy();
        expect(tela.find({ testID: 'comando-parar-gravacao' }).prop('editable')).toBeFalsy();
    });

    test('Deve retornar os valores ao fechar a tela de configurações', async () => {
        const props = {
            visivel: true,
            habilitarVoz: false,
            fechar: jest.fn(),
        }
        const tela = shallow(<TelaConfiguracoes {...props} />);

        tela.find({ testID: 'comando-foto' }).simulate('changeText', 'texto do campo foto');
        expect(tela.find({ testID: 'comando-foto' }).prop('value')).toBe('texto do campo foto');

        tela.find({ testID: 'comando-iniciar-gravacao' }).simulate('changeText', 'texto do inicio de gravação');
        expect(tela.find({ testID: 'comando-iniciar-gravacao' }).prop('value')).toBe('texto do inicio de gravação');

        tela.find({ testID: 'comando-parar-gravacao' }).simulate('changeText', 'texto do fim da gravação');
        expect(tela.find({ testID: 'comando-parar-gravacao' }).prop('value')).toBe('texto do fim da gravação');

        tela.find({ testID: 'habilitar-voz' }).simulate('valueChange', true);

        tela.find({ testID: 'botao-fechar' }).props().onPress();

        const resultadoEsperado = {
            comandoFoto: 'texto do campo foto',
            comandoIniciarGravacao: 'texto do inicio de gravação',
            comandoPararGravacao: 'texto do fim da gravação',
            habilitarVoz: true,
        }
        expect(props.fechar).toHaveBeenCalledWith(resultadoEsperado);
    });

});