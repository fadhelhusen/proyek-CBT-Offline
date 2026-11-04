import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

type TokenCodeInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  length?: number;
  disabled?: boolean;
  error?: string;
};

export default function TokenCodeInput({
  value,
  onChangeText,
  length = 6,
  disabled = false,
  error = '',
}: TokenCodeInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const characters = Array.from(
    { length },
    (_, index) => value[index] ?? '',
  );

  const handleChange = (text: string) => {
    const cleanText = text
      .replace(/\D/g, '')
      .slice(0, length);

    onChangeText(cleanText);
  };

  return (
    <View style={styles.wrapper}>
      {/* Kotak visual: hanya menampilkan titik */}
      <View
        pointerEvents="none"
        style={styles.container}
      >
        {characters.map((character, index) => {
          const active =
            isFocused &&
            index === Math.min(value.length, length - 1);

          return (
            <View
              key={index}
              style={[
                styles.box,
                active && !error && styles.activeBox,
                Boolean(error) && styles.errorBox,
              ]}
            >
              {character !== '' && (
                <View style={styles.dot} />
              )}
            </View>
          );
        })}
      </View>

      {/* Input transparan yang menerima ketikan */}
      <TextInput
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        inputMode="numeric"
        enterKeyHint="done"
        maxLength={length}
        editable={!disabled}
        showSoftInputOnFocus
        caretHidden
        contextMenuHidden
        autoCorrect={false}
        autoCapitalize="none"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.input}
        accessibilityLabel="Masukkan 6 angka token ujian"
        accessibilityHint="Masukkan angka token menggunakan keyboard"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    width: '100%',
    minHeight: 52,
    justifyContent: 'center',
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },

  box: {
    flex: 1,
    maxWidth: 48,
    height: 50,
    borderWidth: 1,
    borderColor: '#D6E4FF',
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeBox: {
    borderColor: '#2477FF',
    borderWidth: 2,
  },

  errorBox: {
    borderColor: '#DC2626',
    borderWidth: 1.5,
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#2477FF',
  },

  input: {
  ...StyleSheet.absoluteFill,
  zIndex: 10,
  width: '100%',
  height: '100%',
  opacity: 0.02,
  color: 'transparent',
  backgroundColor: 'transparent',
  fontSize: 16,
  padding: 0,
  margin: 0,
  borderWidth: 0,
},
});