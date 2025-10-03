import { SearchResponse } from '../types/coin';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export async function searchCoins(query: string): Promise<SearchResponse> {
  if (!query.trim()) {
    return { coins: [] };
  }

  try {
    const response = await fetch(
      `${COINGECKO_API}/search?query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data); // Para depuración
    return data;
  } catch (error) {
    console.error('Error en searchCoins:', error);
    throw new Error('Error al buscar criptomonedas. Por favor, intenta de nuevo.');
  }
}