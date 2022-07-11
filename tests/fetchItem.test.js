require('../mocks/fetchSimulator');
const { fetchItem } = require('../helpers/fetchItem');
const item = require('../mocks/item');

describe('2 - Teste a função fetchItem', () => {
  it('Deve ser uma função', () => {
    expect.assertions(1);
    expect(typeof fetchItem).toBe('function');
  });
  it('Ao chamar a função passando um produto com parâmetro "fetch" deve ser chamado 1 vez', () => {
    expect.assertions(1);
    fetchItem('MLB1615760527');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('Teste se, ao chamar a função fetchItem com o argumento "MLB1615760527", a função fetch utiliza o endpoin correto', () => {
    expect.assertions(1);
    const url =  "https://api.mercadolibre.com/items/MLB1615760527";
    fetchItem('MLB1615760527');
    expect(fetch).toHaveBeenCalledWith(url);
  });
  it('Teste se o retorno da função fetchItem com o argumento "MLB1615760527" é uma estrutura de dados igual ao objeto item', async () => {
    const expected = await fetchItem('MLB1615760527');
    expect(expected).toEqual(item);
  });
  it('Teste se, ao chamar a função fetchItem sem argumento, retorna um erro com a mensagem: "You must provide an url"', async () => {
    const error = 'You must provide an url';
    expect(await fetchItem()).toEqual(new Error(error))
  });
});
