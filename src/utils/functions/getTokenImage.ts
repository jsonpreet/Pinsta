

/**
 *
 * @param symbol - Token symbol
 * @returns token image url
 */
const getTokenImage = (symbol: string): string => `/tokens/${symbol?.toLowerCase()}.svg`;

export default getTokenImage;