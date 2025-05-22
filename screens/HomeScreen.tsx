import { Ionicons } from '@expo/vector-icons';
import {
  Actionsheet,
  Box,
  Button,
  Center,
  HStack,
  Image,
  Input,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  useDisclose,
  useColorMode,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import CarCard, { CarData } from '../components/CarCard';
import { fetchCarData } from '../services/api';

export default function HomeScreen() {
  const [carNameInput, setCarNameInput] = useState('');
  const [carData, setCarData] = useState<CarData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<CarData | null>(null);

  const { isOpen, onOpen, onClose } = useDisclose();
  const { colorMode, toggleColorMode } = useColorMode();

  // Cores dinâmicas para light/dark
  const colors = {
    background: colorMode === 'dark' ? '#121212' : '#f9f9f9',
    card: colorMode === 'dark' ? '#1f1f1f' : '#ffffff',
    header: colorMode === 'dark' ? '#000000' : '#FF6B00',
    textPrimary: colorMode === 'dark' ? '#ffffff' : '#1a1a1a',
    textSecondary: colorMode === 'dark' ? '#aaaaaa' : '#666666',
    accent: '#FF6B00',
    inputBg: colorMode === 'dark' ? '#2c2c2c' : '#e6e6e6',
  };

  // Formata os dados brutos para CarData
  const formatCarData = (data: { image: string | null; info: any }): CarData => {
    const info = data.info || {};

    // A NHTSA não retorna ano, então deixamos undefined
    return {
      imageUrl: data.image || 'https://via.placeholder.com/350x196.png?text=Sem+imagem',
      name: info.Make_Name && info.Model_Name ? `${info.Make_Name} ${info.Model_Name}` : 'Nome desconhecido',
      brand: info.Make_Name,
      year: undefined,
    };
  };

  // Preview ao digitar (debounce de 300ms)
  useEffect(() => {
    if (carNameInput.trim().length < 3) {
      setPreviewData(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const data = await fetchCarData(carNameInput);
        if (!data) {
          setPreviewData(null);
          return;
        }
        setPreviewData(formatCarData(data));
      } catch {
        setPreviewData(null);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [carNameInput]);

  // Busca final ao clicar no botão
  const handleSearch = async () => {
    setError(null);
    if (!carNameInput.trim()) {
      setError('Digite a marca e o modelo do carro');
      return;
    }

    setLoading(true);
    setCarData(null);

    try {
      const data = await fetchCarData(carNameInput);
      if (!data) {
        setError('Carro não encontrado');
        setLoading(false);
        return;
      }

      setCarData(formatCarData(data));
    } catch (e) {
      setError('Erro ao buscar dados do carro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HEADER */}
      <Box
        bg={colors.header}
        safeAreaTop
        px={4}
        py={3}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        shadow={2}
      >
        {/* MENU HAMBÚRGUER */}
        <Pressable onPress={onOpen}>
          <Ionicons name="menu" size={28} color="white" />
        </Pressable>

        {/* LOGO */}
        <Image
          source={require('../assets/logo-removebg-preview 1.svg')}
          alt="Logo"
          size="xs"
          resizeMode="contain"
        />
      </Box>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content bg={colors.card} style={{ maxHeight: '75%' }}>
          <ScrollView style={{ width: '100%' }} nestedScrollEnabled>
          

            {/* Aqui você pode adicionar mais Actionsheet.Item conforme precisar */}
            <Actionsheet.Item
              onPress={() => {
                toggleColorMode();
                onClose();
              }}
              _text={{ color: colors.textPrimary, fontWeight: 'bold' }}
            >
              Alternar Modo {colorMode === 'light' ? 'Escuro' : 'Claro'}
            </Actionsheet.Item>
            <Actionsheet.Item _text={{ color: colors.textPrimary, fontWeight: 'bold' }}>
              Home
            </Actionsheet.Item> 
             
            <Actionsheet.Item _text={{ color: colors.textPrimary, fontWeight: 'bold' }}>
              Favoritos
            </Actionsheet.Item>

            {/* etc */}
          </ScrollView>
        </Actionsheet.Content>
      </Actionsheet>

      {/* CONTEÚDO */}
      <ScrollView
        flex={1}
        px={4}
        pt={4}
        bg={colors.background}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          placeholder="Digite marca e modelo do carro (ex: Toyota Corolla)"
          value={carNameInput}
          onChangeText={setCarNameInput}
          bg={colors.inputBg}
          borderRadius="md"
          fontSize="md"
          InputLeftElement={<Ionicons name="search" size={20} color={colors.accent} style={{ marginLeft: 10 }} />}
          mb={3}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />

        {/* Preview enquanto digita */}
        {previewData && (
          <>
            <Text mb={2} fontSize="md" fontWeight="bold" color={colors.textPrimary}>
              Visualização rápida:
            </Text>
            <CarCard carData={previewData} />
          </>
        )}

        {/* Botão Buscar */}
        <Button
          onPress={handleSearch}
          isDisabled={loading || carNameInput.trim().length < 3}
          mb={4}
          bg={colors.accent}
          _pressed={{ bg: '#e05e00' }}
        >
          {loading ? <Spinner color="white" /> : 'Buscar'}
        </Button>

        {/* Erro */}
        {error && (
          <Text color="red.500" fontWeight="bold" mb={4}>
            {error}
          </Text>
        )}

        {/* Resultado final */}
        {carData && (
          <>
            <Text mb={2} fontSize="md" fontWeight="bold" color={colors.textPrimary}>
              Resultado:
            </Text>
            <CarCard carData={carData} />
          </>
        )}
      </ScrollView>
    </>
  );
}
