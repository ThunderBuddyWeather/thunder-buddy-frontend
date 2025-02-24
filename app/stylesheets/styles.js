import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/COLORS';

const Styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        elevation: 0, // Avoid shadow issues
        justifyContent: 'center',
        marginTop: 20,
        minHeight: 50,
        paddingHorizontal: 20,
        paddingVertical: 10,
        zIndex: 1, // Ensures it's clickable
    },
    buttonText: {
        color: COLORS.white,
        fontFamily: 'Arial',
        fontSize: 16,
        textAlign: 'center',
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default Styles;
