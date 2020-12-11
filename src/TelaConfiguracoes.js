import React, { PureComponent } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    TextInput,
    Dimensions,
    Switch,
} from "react-native";
import Icon from 'react-native-vector-icons/Feather';



export default class TelaConfiguracoes extends PureComponent {

    state = {
        comandoFoto: 'Ok camera, tirar foto',
        comandoIniciarGravacao: 'Ok camera, iniciar gravação',
        comandoPararGravacao: 'Ok camera, parar gravação',
        habilitarVoz: this.props.habilitarVoz,
    }

    mudarComandoFoto = texto => {
        this.setState({ comandoFoto: texto });
    }

    mudarComandoIniciarGravacao = texto => {
        this.setState({ comandoIniciarGravacao: texto });
    }

    mudarComandoPararGravacao = texto => {
        this.setState({ comandoPararGravacao: texto });
    }

    fechar = () => {
        const valores = { ...this.state }
        this.props.fechar(valores);
    }

    habilitarVoz = valor => {
        this.setState({ habilitarVoz: valor });
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.visivel}
                testID={'tela-configuracoes'}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text testID={'titulo'} style={styles.titlo}>Configurações</Text>
                        <View style={styles.comandosVozContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.tituloComandosVoz}>Comandos de voz</Text>
                                <Switch
                                    testID={'habilitar-voz'}
                                    trackColor={{ false: "#767577", true: "rgba(153,0,0, 0.2)" }}
                                    thumbColor={this.state.habilitarVoz ? "#900" : "#f4f3f4"}
                                    onValueChange={this.habilitarVoz}
                                    value={this.state.habilitarVoz}
                                />
                            </View>
                            <View>
                                <View style={styles.comando}>
                                    <View style={styles.containerCaixaTexto}>
                                        <Icon name="camera" size={20} color="#900" style={styles.icone} />
                                        <TextInput
                                            testID={'comando-foto'}
                                            placeholder={'Exemplo: Tirar foto'}
                                            underlineColorAndroid={'black'}
                                            style={styles.caixaTexto}
                                            value={this.state.comandoFoto}
                                            maxLength={40}
                                            onChangeText={this.mudarComandoFoto}
                                            editable={this.state.habilitarVoz}
                                        />
                                    </View>
                                    <Text style={styles.contadorCaracteres} >  {`${this.state.comandoFoto.length}/40`}</Text>
                                </View>
                                <View style={styles.comando}>
                                    <View style={styles.containerCaixaTexto}>
                                        <Icon name="video" size={20} color="#900" style={styles.icone} />
                                        <TextInput
                                            testID={'comando-iniciar-gravacao'}
                                            placeholder={'Exemplo: Iniciar gravação'}
                                            underlineColorAndroid={'black'}
                                            style={styles.caixaTexto}
                                            value={this.state.comandoIniciarGravacao}
                                            maxLength={40}
                                            onChangeText={this.mudarComandoIniciarGravacao}
                                            editable={this.state.habilitarVoz}
                                        />
                                    </View>
                                    <Text style={styles.contadorCaracteres} >  {`${this.state.comandoIniciarGravacao.length}/40`}</Text>
                                </View>
                                <View style={styles.comando}>
                                    <View style={styles.containerCaixaTexto}>
                                        <Icon name="video-off" size={20} color="#900" style={styles.icone} />
                                        <TextInput
                                            testID={'comando-parar-gravacao'}
                                            placeholder={'Exemplo: Parar gravação'}
                                            underlineColorAndroid={'black'}
                                            style={styles.caixaTexto}
                                            value={this.state.comandoPararGravacao}
                                            maxLength={40}
                                            onChangeText={this.mudarComandoPararGravacao}
                                            editable={this.state.habilitarVoz}
                                        />
                                    </View>
                                    <Text style={styles.contadorCaracteres} > {`${this.state.comandoPararGravacao.length}/40`}</Text>
                                </View>
                                <View>
                                    <Text testID={'texto-explicativo'} style={styles.textoExplicativo}>Mesmo com o comando de voz habilitado, você pode realizar gravações e tirar fotos usando os botões que aparecem ao tocar na tela.</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableHighlight
                            testID={'botao-fechar'}
                            style={styles.botaoFechar}
                            onPress={this.fechar}
                            underlayColor={'rgba(153,0,0, 0.2)'}
                            activeOpacity={.2}
                        >
                            <Text style={styles.textStyle}>Fechar</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    comandosVozContainer: { width: '100%', height: Dimensions.get('window').height - 200 },
    tituloComandosVoz: { fontSize: 20 },
    contadorCaracteres: { alignSelf: 'flex-end', color: 'gray', marginRight: 5 },
    icone: { alignSelf: 'center', marginRight: 10 },
    comando: { borderWidth: 0, width: '100%', },
    containerCaixaTexto: { width: '100%', flexDirection: 'row', height: 50 },
    caixaTexto: { flex: 1, fontSize: 20 },
    textoExplicativo: { color: '#505050', fontSize: 16, fontWeight: 'bold' },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flex: 1,
        height: '95%',
        width: '95%'
    },
    botaoFechar: {
        borderRadius: 20,
        padding: 10,
        backgroundColor: "#900",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    titlo: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 25,

    }
});