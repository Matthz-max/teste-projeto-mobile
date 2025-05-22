import axios from 'axios';

export const fetchCarImage = async (carName: string): Promise<string | null> => {
  try {
    console.log(`[fetchCarImage] Buscando imagem para: "${carName}"`);
    const response = await axios.get('https://www.carimagery.com/api.asmx/GetImageUrl', {
      params: { searchTerm: carName },
    });

    const regex = /<string xmlns="http:\/\/carimagery.com\/">(.+)<\/string>/;
    const match = regex.exec(response.data);

    console.log(`[fetchCarImage] URL da imagem encontrada: ${match ? match[1] : 'nenhuma'}`);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Erro ao buscar imagem do Car Imagery:', error);
    return null;
  }
};

export const fetchCarInfo = async (carName: string): Promise<{ Make_Name: string; Model_Name: string } | null> => {
  try {
    console.log(`[fetchCarInfo] Buscando info para: "${carName}"`);
    const [make, ...modelParts] = carName.trim().split(' ');
    if (!make) {
      console.log('[fetchCarInfo] Make não fornecido');
      return null;
    }

    let model = modelParts.join(' ');

    const response = await axios.get(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${make}?format=json`
    );

    if (!response.data || !response.data.Results) return null;

    if (!model) {
      console.log(`[fetchCarInfo] Modelo não fornecido. Usando o primeiro modelo disponível da marca ${make}`);
      model = response.data.Results[0]?.Model_Name || '(modelo desconhecido)';
    }

    // Procura o modelo exato (case insensitive)
    const matchedModels = response.data.Results.filter(
      (item: any) => item.Model_Name.toLowerCase() === model.toLowerCase()
    );

    if (matchedModels.length === 0) {
      console.log('[fetchCarInfo] Modelo não encontrado para:', model);
      return null;
    }

    const modelInfo = matchedModels[0];

    return {
      Make_Name: modelInfo.Make_Name || make,
      Model_Name: modelInfo.Model_Name || model,
    };
  } catch (error) {
    console.error('Erro ao buscar informações do carro na NHTSA API:', error);
    return null;
  }
};

export const fetchCarData = async (
  carName: string
): Promise<{ image: string | null; info: { Make_Name: string; Model_Name: string } | null } | null> => {
  try {
    console.log(`[fetchCarData] Iniciando busca combinada para: "${carName}"`);
    const [image, info] = await Promise.all([fetchCarImage(carName), fetchCarInfo(carName)]);

    if (!image && !info) {
      console.log('[fetchCarData] Nenhum dado encontrado (imagem e info são null)');
      return null;
    }

    console.log(`[fetchCarData] Resultado imagem: ${image}`);
    console.log(`[fetchCarData] Resultado info:`, info);

    return {
      image,
      info: info || { Make_Name: '', Model_Name: '' },
    };
  } catch (error) {
    console.error('Erro ao buscar dados do carro:', error);
    return null;
  }
};
