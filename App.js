import React, { PureComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Platform } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Voice from '@react-native-community/voice';
import CameraRoll from '@react-native-community/cameraroll';
import Tts from 'react-native-tts';

import Icon from 'react-native-vector-icons/Feather';

import TelaConfiguracoes from './src/TelaConfiguracoes';

import * as RepositorioLocal from './src/RepositorioLocal';

import * as interpretadorVozTexto from './src/InterpretadorVozTexto';

import Rodape from './src/Rodape';

export default class ExampleApp extends PureComponent {

  constructor(props) {
    super(props);
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;

    this.state = {
      emGravacao: false,
      mostrarBotoes: true,
      mostrarConfiguracoes: false,
      carregandoConfiguracoes: false,
      habilitarVoz: false,
    }
  }

  async componentDidMount() {
    this.configuracoes = await RepositorioLocal.recuperarConfiguracoes();
    this.aplicarConfiguracoes();
    this.setState({ carregandoConfiguracoes: false });
  }

  falar = texto => {
    Tts.setDefaultLanguage('pt-BR');
    Tts.speak(texto, {
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 0.9,
        KEY_PARAM_STREAM: 'STREAM_ALARM',
      },
    });
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  _startRecognizing = async () => {
    this.setState({
      results: [],
      partialResults: [],
    });
    try {
      await Voice.start('pt-BR', {
        "RECOGNIZER_ENGINE": "GOOGLE",
        "EXTRA_PARTIAL_RESULTS": true
      });
    } catch (e) {
      console.error(e);
    }
  }

  onSpeechResults = async (e) => {
    const results = e.value;
    const texto = interpretadorVozTexto.limparComando(results.join(' '));
    const { comandoFoto, comandoIniciarGravacao, comandoPararGravacao } = configuracoes;
    let comandoFotoFormatado = interpretadorVozTexto.limparComando(comandoFoto);
    let comandoIniciarGravacaoFormatado = interpretadorVozTexto.limparComando(comandoIniciarGravacao);
    let comandoPararGravacaoFormatado = interpretadorVozTexto.limparComando(comandoPararGravacao);
    if (interpretadorVozTexto.encontrarTermos(comandoFotoFormatado, texto)) {
      await this.tirarFoto();
    } else if (interpretadorVozTexto.encontrarTermos(comandoIniciarGravacaoFormatado, texto)) {
      await this.iniciarGravacaoDeVideo();
    } else if (interpretadorVozTexto.encontrarTermos(comandoPararGravacaoFormatado, texto)) {
      this.pararGravacaoDeVideo();
    }

    this._startRecognizing();
  }

  onSpeechPartialResults = (e) => {
    this.setState({
      partialResults: e.value,
    });
  }

  salvarNaGaleria = async (data, tipo) => {
    try {
      if (Platform.OS === "android" && !(await this.temPermissaoDeUso())) {
        return;
      }
      await CameraRoll.save(data.uri, { type: tipo })
    } catch (e) {
      console.log('falha ao salvar foto na galeria', e);
    }
  }

  tirarFoto = async () => {
    if (!this.camera) {
      return;
    }
    const estavaGravando = this.situacaoDaGravacaoDeVideo === 'GRAVANDO';
    if (estavaGravando) {
      this.situacaoDaGravacaoDeVideo = 'PAUSA';
      this.pararGravacaoDeVideo();
      const options = { quality: 0.5, base64: false, skipProcessing: true, };
      const data = await this.camera.takePictureAsync(options);
      this.salvarNaGaleria(data, 'photo');
      this.iniciarGravacaoDeVideo();
    } else {
      const options = { quality: 0.5, base64: false, skipProcessing: true, };
      const data = await this.camera.takePictureAsync(options);
      this.salvarNaGaleria(data, 'photo');
    }
  }

  aposTirarFoto = () => {
    this.falar('foto tirada');
  }

  temPermissaoDeUso = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  iniciarGravacaoDeVideo = async () => {
    if (!this.camera) {
      return;
    }
    try {
      this.promise = this.camera.recordAsync();
      if (this.promise) {
        const data = await this.promise;
        this.salvarNaGaleria(data, 'video');
      }
    } catch (e) {
      console.error(e);
      this.promise = null;
      this.situacaoDaGravacaoDeVideo = 'PARADA';
    }
  };

  onRecordingStart = () => {
    const estavaEmPausa = this.situacaoDaGravacaoDeVideo === 'PAUSA';
    if (!estavaEmPausa) {
      this.falar('Gravando vídeo');
    }
    this.situacaoDaGravacaoDeVideo = 'GRAVANDO';
    this.setState({ emGravacao: true });
  }

  onRecordingEnd = () => {
    const estavaEmPausa = this.situacaoDaGravacaoDeVideo === 'PAUSA';
    if (!estavaEmPausa) {
      this.falar('Gravação de vídeo encerrada');
    }
    this.situacaoDaGravacaoDeVideo = 'PARADA';
    this.promise = null;
    this.setState({ emGravacao: false });
  }

  pararGravacaoDeVideo = () => {
    if (this.camera) {
      this.camera.stopRecording();
    }
  };

  onTap = async () => {
    this.setState({ mostrarBotoes: !this.state.mostrarBotoes });
  }

  montarRodape = () => {
    if (!this.state.mostrarBotoes) {
      return;
    }
    return <Rodape
      emGravacao={this.state.emGravacao}
      pararGravacaoDeVideo={this.pararGravacaoDeVideo}
      iniciarGravacaoDeVideo={this.iniciarGravacaoDeVideo}
      mostrarBotoes={this.state.mostrarBotoes}
      tirarFoto={this.tirarFoto}
    />
  }

  abrirConfiguracoes = () => {
    this.setState({ mostrarConfiguracoes: true });
  }

  montarBotaoConfiguracoes = () => {
    if (!this.state.mostrarBotoes) {
      return;
    }
    return (
      <View style={styles.containerBotaoConfiguracao}>
        <TouchableOpacity testID={"botao-configuracoes"} onPress={this.abrirConfiguracoes} style={styles.botaoConfiguracao}>
          <Icon name="settings" size={20} color="#900" />
        </TouchableOpacity>
      </View>
    );
  }

  fecharConfiguracoes = async (configuracoes) => {
    this.configuracoes = configuracoes;
    await RepositorioLocal.salvarConfiguracoes(configuracoes);
    await this.aplicarConfiguracoes();
    this.setState({ mostrarConfiguracoes: false, habilitarVoz: configuracoes.habilitarVoz });
  }

  aplicarConfiguracoes = async () => {

    if (this.configuracoes.habilitarVoz === this.state.habilitarVoz) {
      return;
    }

    if (this.configuracoes.habilitarVoz) {
      this._startRecognizing();
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.interval = setInterval(async () => {
        const ouvindo = await Voice.isRecognizing();
        if (!ouvindo) {
          this._startRecognizing();
        }
      }, 1000);
    } else {
      if (this.interval) {
        clearInterval(this.interval);
      }
      await Voice.destroy();
      Voice.removeAllListeners();
    }
  }

  montarIndicadorGravacao = () => {
    if (!this.state.emGravacao) {
      return;
    }
    return (
      <View testID={'gravando'} style={styles.indicadorGravacao}>
        <View style={styles.circuloGravando} />
        <Text style={styles.textoGravando}>Gravando</Text>
      </View>
    )
  }

  onCameraReady = () => {
    console.log('onCameraReady');
  }

  render() {
    return (
      <View testID={'app'} style={styles.container}>
        {this.montarIndicadorGravacao()}
        {this.montarBotaoConfiguracoes()}
        <RNCamera
          testID={'camera'}
          captureAudio={false}
          ref={ref => {
            this.camera = ref;
          }}
          onTap={this.onTap}
          onCameraReady={this.onCameraReady}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permissão para usar a camera',
            message: 'Você precisa permitir o acesso à camera.',
            buttonPositive: 'Permitir',
            buttonNegative: 'Negar',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permissão para gravar o áudio',
            message: 'Você precisa permitir o acesso à gravação de áudio.',
            buttonPositive: 'Permitir',
            buttonNegative: 'Negar',
          }}
          onPictureTaken={this.aposTirarFoto}
          onRecordingStart={this.onRecordingStart}
          onRecordingEnd={this.onRecordingEnd}
        >
          {this.montarRodape()}
        </RNCamera>
        {
          this.state.mostrarConfiguracoes &&
          <TelaConfiguracoes habilitarVoz={this.state.habilitarVoz} visivel={this.state.mostrarConfiguracoes} fechar={this.fecharConfiguracoes} />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  botaoConfiguracao: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignSelf: 'center',
    padding: 10,
    margin: 20,
  },
  containerBotaoConfiguracao: { zIndex: 1, position: 'absolute', top: 10, left: 10, flex: 1, flexDirection: 'row' },
  indicadorGravacao: { zIndex: 1, position: 'absolute', top: 10, right: 10, flex: 1, flexDirection: 'row' },
  circuloGravando: { backgroundColor: 'red', height: 10, width: 10, borderRadius: 10, alignSelf: 'center', marginRight: 10 },
  textoGravando: { fontSize: 18, fontWeight: 'bold', color: 'white' },
});