const ulItems = document.querySelector('.cart__items');
const exibValue = document.querySelector('.value');

const saveItemsList = () => {
  if (ulItems.children.length === 0) return saveCartItems(JSON.stringify(''));
  const itemsCart = [];
  for (let i = 0; i < ulItems.children.length; i += 1) {
    console.log('dentro do for');
    const obj = {     
      content: ulItems.children[i].innerText, 
    }; itemsCart.push(obj);
  } console.log('atualizou o localStorage');
  saveCartItems(JSON.stringify(itemsCart));
};

const calculateValue = (obj, operation) => {
  if (operation === 'sub') {
    exibValue.innerText = Number(exibValue.innerText) - Number(obj);
    return;
  }  
  exibValue.innerText = Number(exibValue.innerText) + Number(obj);
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
  ulItems.removeChild(e.target);
  saveItemsList();
  calculateValue(e.target.id, 'sub');
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
  console.log('adicionou ao carrinho');
  const getItemId = getSkuFromProductItem(element);
  const response = await fetchItem(getItemId);
  const { id: sku, title: name, price: salePrice } = response;
  const cart = createCartItemElement({ sku, name, salePrice });
  ulItems.appendChild(cart);
  calculateValue(salePrice, 'sum');
  saveItemsList();
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
  allComputers.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const element = createProductItemElement({ sku, name, image });
    sectionItems.appendChild(element);
  });
};

const getListCard = () => {
  const carts = JSON.parse(getSavedCartItems('cartItems'));
  if (!carts) return;
  if (carts) {
    for (let i = 0; i < carts.length; i += 1) {
      const newLi = document.createElement('li');
      newLi.innerText = carts[i].content;
      newLi.id = carts[i].id;
      ulItems.appendChild(newLi);
      newLi.addEventListener('click', cartItemClickListener);
    }
  }
};

window.onload = () => {
  getListCard();
  getItemsComputers();
};
