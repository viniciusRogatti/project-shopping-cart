const ulItems = document.querySelector('.cart__items');
const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText, id) => {
  const e = document.createElement(element);
  if (element === 'button') {
    e.id = id;
  }
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));

  return section;
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

const getItemsComputers = async () => {
  const sectionItems = document.querySelector('.items');
  const allComputers = await fetchProducts('computador');
  allComputers.results.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    const element = createProductItemElement({ sku, name, image });
    sectionItems.appendChild(element);
  });
};

window.addEventListener('click', async (e) => {
  if (e.target.className === 'item__add') {
    const idTarget = await fetchItem(e.target.id);
    const { id: sku, title: name, price: salePrice } = idTarget;
    const cart = createCartItemElement({ sku, name, salePrice });
    ulItems.appendChild(cart);
  }
});
window.onload = () => {
  getItemsComputers();
};