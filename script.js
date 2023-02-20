const ulItems = document.querySelector('.cart__items');
const exibValue = document.querySelector('.total-price');
const btnEmptyCart = document.querySelector('.empty-cart');
const container = document.getElementsByClassName('container');
const spanAwaitElement = document.getElementsByClassName('loading');
let sumValue = 0;

const awaitApi = () => {
  const spanAwait = document.createElement('span');
  spanAwait.innerText = 'carregando...';
  spanAwait.classList.add('loading');
  return spanAwait;
};

const saveItemsList = () => {
  if (ulItems.children.length === 0) return saveCartItems(JSON.stringify(''));
  const itemsCart = [];
  for (let i = 0; i < ulItems.children.length; i += 1) {
    const obj = {
      content: ulItems.children[i].innerText,
      price: ulItems.children[i].id,
    }; itemsCart.push(obj);
  } console.log('atualizou o localStorage');
  saveCartItems(JSON.stringify(itemsCart));
};

const calculateValue = (obj, operation) => {
  if (operation === 'sub') {
    const number = sumValue - Number(obj);
    sumValue = parseFloat(number);
    exibValue.innerText = sumValue;
    return;
  } 
  const number = sumValue + Number(obj);
  sumValue = parseFloat(number);
  exibValue.innerText = sumValue;
};

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const cartItemClickListener = (e) => {
  calculateValue(e.target.id, 'sub');
  ulItems.removeChild(e.target);
  saveItemsList();
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.id = salePrice;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const addItemCard = async (element) => {
  container[0].appendChild(awaitApi());
  const getItemId = getSkuFromProductItem(element);
  const response = await fetchItem(getItemId);
  const { id: sku, title: name, price: salePrice } = response;
  const cart = createCartItemElement({ sku, name, salePrice });
  ulItems.appendChild(cart);
  calculateValue(salePrice, 'sum');
  saveItemsList();
  spanAwaitElement[0].remove();
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', () => addItemCard(section));
  section.appendChild(button);
  return section;
};

const getItemsComputers = async () => {
  container[0].appendChild(awaitApi());
  const sectionItems = document.querySelector('.items');
  const allComputers = await fetchProducts('computador');
  allComputers.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const element = createProductItemElement({ sku, name, image });
    sectionItems.appendChild(element);
  });
  spanAwaitElement[0].remove();
};

const getListCard = () => {
  const carts = JSON.parse(getSavedCartItems('cartItems'));
  if (!carts) return;
  let sumPrices = 0;
  if (carts) {
    for (let i = 0; i < carts.length; i += 1) {
      const newLi = document.createElement('li');
      newLi.innerText = carts[i].content;
      newLi.id = carts[i].price;
      ulItems.appendChild(newLi);
      sumPrices += Number(carts[i].price);
      newLi.addEventListener('click', cartItemClickListener);
    }
    sumValue += sumPrices;
    exibValue.innerText = sumPrices;
  }
};

btnEmptyCart.addEventListener('click', () => {
  Array.from(ulItems.children).forEach((e) => e.remove());
  exibValue.innerText = '';
  saveItemsList();
});

window.onload = () => {
  getListCard();
  getItemsComputers();
};