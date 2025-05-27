import React from 'react';
import { Box, Text, Pressable, Image, HStack, IconButton } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

export interface CarData {
  name: string;
  brand?: string;
  imageUrl: string;
}

interface CarCardProps {
  carData: CarData;
  onPress: () => void;
  isFavorited: (car: CarData | null) => boolean;
  onToggleFavorite: (car: CarData) => void;
  bgColor?: string;
}

// Função simples para detectar se a cor é clara (baseado no brilho do hex)
// Recebe cor em formato #RRGGBB
function isColorLight(color: string) {
  if (!color.startsWith('#') || (color.length !== 7 && color.length !== 4)) {
    return false; // fallback
  }
  let r, g, b;

  if (color.length === 7) {
    r = parseInt(color.slice(1, 3), 16);
    g = parseInt(color.slice(3, 5), 16);
    b = parseInt(color.slice(5, 7), 16);
  } else {
    // formato curto #rgb
    r = parseInt(color[1] + color[1], 16);
    g = parseInt(color[2] + color[2], 16);
    b = parseInt(color[3] + color[3], 16);
  }

  // cálculo de luminância perceptiva
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 150; // valor arbitrário para decidir claro/escuro
}

export default function CarCard({
  carData,
  onPress,
  isFavorited,
  onToggleFavorite,
  bgColor = '#2a2a2a', // default para modo escuro
}: CarCardProps) {
  const favorited = isFavorited(carData);

  const lightBg = isColorLight(bgColor);
  const textColor = lightBg ? 'black' : 'white';
  const iconColor = favorited ? 'red' : textColor;

  return (
    <Pressable onPress={onPress}>
      <Box
        bg={bgColor}
        rounded="xl"
        shadow={3}
        p={4}
        w="90%"
        alignSelf="center"
      >
        <Image
          source={{ uri: carData.imageUrl }}
          alt={carData.name}
          height={150}
          resizeMode="contain"
          rounded="md"
          mb={3}
        />
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontWeight="bold" fontSize="lg" color={textColor}>
            {carData.name}
          </Text>
          <IconButton
            icon={
              <Ionicons
                name={favorited ? 'heart' : 'heart-outline'}
                size={24}
                color={iconColor}
              />
            }
            onPress={() => onToggleFavorite(carData)}
            _pressed={{ bg: 'transparent' }}
          />
        </HStack>
      </Box>
    </Pressable>
  );
}
