const ulItems = document.querySelector('.cart__items');
const exibValue = document.querySelector('.total-price');
const spanAwaitElement = document.getElementsByClassName('loading');
const container = document.getElementsByClassName('container');
const btnEmptyCart = document.querySelector('.empty-cart');
let sumValue = 0;

const awaitApi = () => {
  const spanAwait = document.createElement('span');
  spanAwait.innerText = 'carregando...';
  spanAwait.classList.add('loading');
  return spanAwait;
};

const formatedCurrency = (num) => {
  exibValue.innerText = num
    .toLocaleString('pt-br', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
};

const saveItemsList = async () => {
  if (ulItems.children.length === 0) return saveCartItems(JSON.stringify(''));
  const itemsCart = [];
  for (let i = 0; i < ulItems.children.length; i += 1) {
    const neWobj = {
      content: ulItems.children[i].children[1].innerText,
      price: ulItems.children[i].children[2].id,
      thumbnail: ulItems.children[i].children[0].src,
    }; itemsCart.push(neWobj);
  }
  await saveCartItems(JSON.stringify(itemsCart));
};

const calculateValue = (obj, operation) => {
  if (operation === 'sub') {
    const number = sumValue - Number(obj);
    sumValue = Math.round(number);
    return formatedCurrency(number);
  } 
  const number = sumValue + Number(obj);
  sumValue = Math.round(number);
  return formatedCurrency(number);
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
  e.target.parentNode.remove();
  saveItemsList();
  calculateValue(e.target.id, 'sub');
};

const createCartItemElement = (obj, param) => {
  const { id, title, price, thumbnail } = obj;
  let innerText = `SKU: ${id} | NAME: ${title}`;
  if (param === 'listaStorage') innerText = obj.content;
  const div = ulItems.appendChild(createCustomElement('div', 'divList', ''));
  div.appendChild(createProductImageElement(thumbnail));
  const li = div.appendChild(createCustomElement('li', 'cart__item', innerText));
  li.addEventListener('click', cartItemClickListener);
  const button = div.appendChild(createCustomElement('button', 'btnCart', 'X'));
  button.addEventListener('click', cartItemClickListener);
  li.id = price;
};

const addItemCard = async (element) => {
  container[0].appendChild(awaitApi());
  const getItemId = getSkuFromProductItem(element);
  const response = await fetchItem(getItemId);
  createCartItemElement(response, 'addCarrinho');
  calculateValue(response.price, 'sum');
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
      console.log(carts[i].price);
      createCartItemElement(carts[i], 'listaStorage');
      sumPrices += Number(carts[i].price);
    } sumValue += sumPrices;
  } formatedCurrency(sumPrices);
};

btnEmptyCart.addEventListener('click', () => {
  Array.from(ulItems.children).forEach((e) => e.remove());
  exibValue.innerHTML = '';
  saveItemsList();
});

window.onload = () => {
  getListCard();
  getItemsComputers();
};
