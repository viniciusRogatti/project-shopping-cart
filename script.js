const ulItems = document.querySelector('.cart__items');

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

const cartItemClickListener = (event) => {
  // coloque seu código aqui
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const addItemCard = async (element) => {
  const getItemId = getSkuFromProductItem(element);  
  const response = await fetchItem(getItemId);
  const { id: sku, title: name, price: salePrice } = response;
  const cart = createCartItemElement({ sku, name, salePrice });
  ulItems.appendChild(cart);
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
  const sectionItems = document.querySelector('.items');
  const allComputers = await fetchProducts('computador');
  allComputers.results.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    const element = createProductItemElement({ sku, name, image });
    sectionItems.appendChild(element);
  });
};

window.onload = () => {
  getItemsComputers();
};