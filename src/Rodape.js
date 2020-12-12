import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Feather';

export default class Rodape extends PureComponent {
    static propTypes = {
        mostrarBotoes: PropTypes.bool.isRequired,
        emGravacao: PropTypes.bool.isRequired,
        tirarFoto: PropTypes.func.isRequired,
        pararGravacaoDeVideo: PropTypes.func.isRequired,
        iniciarGravacaoDeVideo: PropTypes.func.isRequired,
    }
    render() {
        let botoes;
        if (this.props.emGravacao) {
            botoes = (
                <TouchableOpacity testID={'parar-gravacao'} onPress={this.props.pararGravacaoDeVideo} style={styles.capture}>
                    <Icon name="video-off" size={40} color="#900" />
                </TouchableOpacity>
            );
        } else {
            botoes = (
                <TouchableOpacity testID={'iniciar-gravacao'} onPress={this.props.iniciarGravacaoDeVideo} style={styles.capture}>
                    <Icon name="video" size={40} color="#900" />
                </TouchableOpacity>
            );
        }
        return (
            <View testID={'rodape'} onAnimationEnd={this.onAnimationEnd} animation={this.props.mostrarBotoes ? 'fadeIn' : 'fadeOut'} style={styles.painelBotoes} >
                <TouchableOpacity testID={'tirar-foto'} onPress={this.props.tirarFoto} style={styles.capture}>
                    <Icon name="camera" size={40} color="#900" />
                </TouchableOpacity>
                {botoes}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        alignSelf: 'center',
        padding: 10,
        margin: 20,
    },
    painelBotoes: { flex: 0, flexDirection: 'row', justifyContent: 'center' },
});