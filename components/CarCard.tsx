import React from 'react';
import { Box, Image, Text, VStack, useColorModeValue } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';

export type CarData = {
  imageUrl: string;
  name: string;
  brand?: string;
  year?: number;
};

type Props = {
  carData: CarData | null;
};

const CarCard: React.FC<Props> = ({ carData }) => {
  if (!carData) return null;

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColorPrimary = useColorModeValue('coolGray.800', 'warmGray.50');
  const textColorSecondary = useColorModeValue('coolGray.600', 'warmGray.300');

  return (
    <Box
      bg={bgColor}
      borderRadius="2xl"
      shadow={8}
      overflow="hidden"
      marginY={4}
      mx="auto"
      width="100%"
      maxWidth={350}
    >
      <Box position="relative">
        <Image
          source={{ uri: carData.imageUrl }}
          alt={`Imagem do ${carData.name}`}
          width="100%"
          resizeMode="cover"
          style={{ aspectRatio: 16 / 9 }}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
          }}
        />
      </Box>

      <VStack px={4} py={3} space={1}>
        <Text fontSize="lg" fontWeight="bold" color={textColorPrimary}>
          {carData.name}
        </Text>
        {carData.brand && (
          <Text fontSize="md" color={textColorSecondary}>
            Marca: {carData.brand}
          </Text>
        )}
        {carData.year && (
          <Text fontSize="md" color={textColorSecondary}>
            Ano: {carData.year}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default CarCard;
