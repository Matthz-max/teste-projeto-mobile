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

export default function CarCard({
  carData,
  onPress,
  isFavorited,
  onToggleFavorite,
  bgColor = 'white',
}: CarCardProps) {
  const favorited = isFavorited(carData);

  return (
    <Pressable onPress={onPress}>
      <Box
        bg={bgColor}
        rounded="xl"
        shadow={3}
        p={4}
        w="90%"
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
          <Text fontWeight="bold" fontSize="lg" color={bgColor === 'white' ? 'black' : 'white'}>
            {carData.name}
          </Text>
          <IconButton
            icon={
              <Ionicons
                name={favorited ? 'heart' : 'heart-outline'}
                size={24}
                color={favorited ? 'red' : bgColor === 'white' ? 'black' : 'white'}
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
