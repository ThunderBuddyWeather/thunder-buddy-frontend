import { jest } from '@jest/globals';

const paperMock = {
  Button: ({ children, mode, onPress, style, testID, contentStyle }) => {
    return {
      type: 'Button',
      props: {
        mode,
        onPress,
        testID,
        children,
        style,
        contentStyle: contentStyle || style || {},
      },
    };
  },
  TextInput: ({ value, onChangeText, style }) => ({
    type: 'TextInput',
    props: {
      value,
      onChangeText,
      style,
    },
  }),
  HelperText: ({ children, type }) => ({
    type: 'HelperText',
    props: {
      type,
      children,
    },
  }),
  Title: ({ children, style }) => ({
    type: 'Title',
    props: {
      style,
      children,
    },
  }),
};

module.exports = paperMock;
