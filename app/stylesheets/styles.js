import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/COLORS';

const Styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    elevation: 0,
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 1,
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: 'Arial',
    fontSize: 16,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    maxWidth: '100%',
    minWidth: '100%',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Styles;
