import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Rodape from '../Rodape';

describe('Testes da tela de configurações', () => {

    test('Deve montar o componente corretamente quando está em gravação', async () => {
        const props = {
            emGravacao: true,
            pararGravacaoDeVideo: jest.fn(),
            iniciarGravacaoDeVideo: jest.fn(),
            mostrarBotoes: jest.fn(),
        }
        const rodape = shallow(<Rodape {...props} />);

        expect(rodape.find({ testID: 'iniciar-gravacao' })).not.toExist();
        expect(rodape.find({ testID: 'parar-gravacao' })).toExist();
        expect(rodape.find({ testID: 'tirar-foto' })).toExist();
        expect(toJson(rodape)).toMatchSnapshot();
    });

    test('Deve montar o componente corretamente quando não está em gravação', async () => {
        const props = {
            emGravacao: false,
            pararGravacaoDeVideo: jest.fn(),
            iniciarGravacaoDeVideo: jest.fn(),
            mostrarBotoes: jest.fn(),
        }
        const rodape = shallow(<Rodape {...props} />);

        expect(rodape.find({ testID: 'iniciar-gravacao' })).toExist();
        expect(rodape.find({ testID: 'parar-gravacao' })).not.toExist();
        expect(rodape.find({ testID: 'tirar-foto' })).toExist();
        expect(toJson(rodape)).toMatchSnapshot();
    });

    test('Deve chamar a função que para a gravação de vídeo ao pressionar o respectivo botão quando estiver em uma gravação', async () => {
        const props = {
            emGravacao: true,
            pararGravacaoDeVideo: jest.fn(),
            iniciarGravacaoDeVideo: jest.fn(),
            tirarFoto: jest.fn(),
            mostrarBotoes: true,
        }
        const rodape = shallow(<Rodape {...props} />);

        rodape.find({ testID: 'parar-gravacao' }).props().onPress();

        expect(props.pararGravacaoDeVideo).toHaveBeenCalledTimes(1);
    });

    test('Deve chamar a função que inicia a gravação de vídeo ao pressionar o respectivo botão quando não estiver em uma gravação', async () => {
        const props = {
            emGravacao: false,
            pararGravacaoDeVideo: jest.fn(),
            iniciarGravacaoDeVideo: jest.fn(),
            tirarFoto: jest.fn(),
            mostrarBotoes: true,
        }
        const rodape = shallow(<Rodape {...props} />);

        rodape.find({ testID: 'iniciar-gravacao' }).props().onPress();

        expect(props.iniciarGravacaoDeVideo).toHaveBeenCalledTimes(1);
    });


    test('Deve chamar a função que tira foto estando em gravação ou não', async () => {
        const props = {
            emGravacao: true,
            pararGravacaoDeVideo: jest.fn(),
            iniciarGravacaoDeVideo: jest.fn(),
            tirarFoto: jest.fn(),
            mostrarBotoes: true,
        }
        const rodape = shallow(<Rodape {...props} />);

        rodape.find({ testID: 'tirar-foto' }).props().onPress();

        expect(props.tirarFoto).toHaveBeenCalledTimes(1);

        rodape.setProps({ emGravacao: false });
        rodape.update();

        rodape.find({ testID: 'tirar-foto' }).props().onPress();

        expect(props.tirarFoto).toHaveBeenCalledTimes(2);
    });

});