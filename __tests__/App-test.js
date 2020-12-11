import React from 'react';
import { shallow, mount } from 'enzyme';

import App from '../App';

describe('Testes da tela de configurações', () => {

    beforeEach(() => {
        jest.useFakeTimers();
    });

    test('Deve montar a tela inicial corretamente', async () => {
        const app = shallow(<App />);
        const rodape = app.find('Rodape').dive();
        expect(rodape.find({ testID: 'tirar-foto' })).toExist();
        expect(rodape.find({ testID: 'iniciar-gravacao' })).toExist();
        expect(rodape.find({ testID: 'parar-gravacao' })).not.toExist();

    });

    test('Deve apresentar corretamente a tela durante gravacao', async () => {
        const app = shallow(<App />);
        const rodape = app.find('Rodape').dive();
        rodape.setProps({ emGravacao: true });

        expect(rodape.find({ testID: 'tirar-foto' })).toExist();
        expect(rodape.find({ testID: 'iniciar-gravacao' })).not.toExist();
        expect(rodape.find({ testID: 'parar-gravacao' })).toExist();
    });

    test('Deve executar a funcao que inicia a gravacao ao pressionar o respectivo botao', async () => {
        const app = mount(<App />);

        const appInstance = app.instance();
        appInstance.camera.recordAsync = jest.fn(() => {
            appInstance.onRecordingStart();
        });
        const spyFalar = jest.spyOn(appInstance, 'falar');

        app.find({ testID: 'iniciar-gravacao' }).first().props().onPress();

        expect(app.state().emGravacao).toBeTruthy();
        expect(appInstance.camera.recordAsync).toHaveBeenCalledTimes(1);
        expect(appInstance.falar).toHaveBeenCalledTimes(1);

        appInstance.camera.stopRecording();//usado para controlar a fim da gravacao no teste
        expect(app.state().emGravacao).toBeFalsy();

        expect(spyFalar).toHaveBeenCalledTimes(2);
        expect(spyFalar).toHaveBeenNthCalledWith(1, 'Gravando vídeo');
        expect(spyFalar).toHaveBeenNthCalledWith(2, 'Gravação de vídeo encerrada');


    });

    test('Deve executar a funcao que para a gravacao ao pressionar o respectivo botao durante uma gravação', async () => {
        const app = mount(<App />);
        const appInstance = app.instance();

        const spyStopRecording = jest.spyOn(appInstance.camera, 'stopRecording');

        expect(app.find({ testID: 'parar-gravacao' })).not.toExist();

        appInstance.camera.recordAsync = jest.fn(() => {
            appInstance.onRecordingStart();
        });

        app.find({ testID: 'iniciar-gravacao' }).first().props().onPress();
        app.update();
        app.find({ testID: 'parar-gravacao' }).first().props().onPress();

        expect(app.state().emGravacao).toBeFalsy();
        expect(spyStopRecording).toHaveBeenCalledTimes(1);
    });

    test('Deve executar a funcao que tira foto ao pressionar o respectivo botao sem estar em uma gravação', async () => {
        const app = mount(<App />);
        const appInstance = app.instance();

        const spyTakePictureAsync = jest.spyOn(appInstance.camera, 'takePictureAsync');
        const spyFalar = jest.spyOn(appInstance, 'falar');
        app.find({ testID: 'tirar-foto' }).first().props().onPress();

        expect(spyTakePictureAsync).toHaveBeenCalledTimes(1);

        expect(spyFalar).toHaveBeenCalledTimes(1);
        expect(spyFalar).toHaveBeenCalledWith('foto tirada');
    });

    test('Deve executar a funcao que tira foto ao pressionar o respectivo botao durante uma gravação', async () => {
        const app = mount(<App />);
        const appInstance = app.instance();
        appInstance.falar = jest.fn();
        appInstance.onRecordingStart();

        const spyTakePictureAsync = jest.spyOn(appInstance.camera, 'takePictureAsync');

        app.find({ testID: 'tirar-foto' }).first().props().onPress();

        expect(spyTakePictureAsync).toHaveBeenCalledTimes(1);
    });

    test('Deve mostrar e/ou esconder os botoes ao tocar na tela', async () => {
        const app = mount(<App />);
        const appInstance = app.instance();

        appInstance.onTap();
        app.update();
        expect(app.find('Rodape')).not.toExist();
        expect(app.find({ testID: 'botao-configuracoes' })).not.toExist();

        appInstance.onTap();
        app.update();
        expect(app.find({ testID: 'botao-configuracoes' })).toExist();
        expect(app.find('Rodape')).toExist();
    });

    test('Deve chamar que mostra as configurações ao pressionar o respectivo botao', async () => {
        const app = mount(<App />);

        app.find({ testID: 'botao-configuracoes' }).first().props().onPress();

        expect(app.state().mostrarConfiguracoes).toBeTruthy();
    });

});