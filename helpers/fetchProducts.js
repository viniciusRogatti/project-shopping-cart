const fetchProducts = async (products) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${products}`;
  try {
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (err) {
    return err;
  }
};
if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
