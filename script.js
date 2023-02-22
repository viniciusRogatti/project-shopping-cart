const ulItems = document.querySelector('.cart__items');
const exibValue = document.querySelectorAll('.total-price');
const btnEmptyCart = document.querySelector('.empty-cart');
const countItems = document.getElementById('count-items');
const cart = document.querySelector('.cart');
const cartTitle = document.querySelector('.container-cartTitle');
const cartIcon = document.querySelector('.cart-icon');
const modalPopup = document.querySelector('.modal-cart-shop');
const btnOpenModal = document.querySelector('.open-cart');
const btnCloseModal = document.querySelector('.close-cart');
const btnXCloseModal = document.querySelector('.close-cart-x');
const btnSearch = document.querySelector('#btn-search');
const inputSearch = document.querySelector('#input-search');
const sectionItems = document.querySelector('.items');

const handleSearch = async () => {
  const items = document.querySelectorAll('.item');
  createSpinnerLoading();
  const allItems = await fetchProducts(inputSearch.value);

  if (allItems.results?.length !== 0) {
    Array.from(items).forEach(item =>item.remove());
    allItems.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
      const element = createProductItemElement({ sku, name, image });
      sectionItems.appendChild(element);
    });
  } else alert('Nenhum produto encontrado')
  removeSpinnerLoading();
};

const toggleCart = () => {
  cart.classList.toggle('open');
  setTimeout(() => {
    cart.classList.remove('open');
  }, 10000)
}

const handleModalPopup = () => {
  modalPopup.classList.toggle('open');
  if(modalPopup.classList.contains('open')) {
    setTimeout(() => {
      modalPopup.classList.remove('open');
    }, 4700);
  }
}

const createSpinnerLoading = () => {
  const spinner = document.createElement('div');
  spinner.classList.add('loading-spinner');
  sectionItems.appendChild(spinner);

  return spinner;
};

const removeSpinnerLoading = () => {
  const spinner = document.querySelector('.loading-spinner');
  spinner.remove();
}

const saveItemsList = () => {
  if (ulItems.children.length === 0) return saveCartItems(JSON.stringify(''));
  const itemsCart = [];
  for (let i = 0; i < ulItems.children.length; i += 1) {
    const obj = {
      content: ulItems.children[i].childNodes[0].innerText,
      price: ulItems.children[i].childNodes[2].innerText,
      image: ulItems.children[i].childNodes[1].currentSrc,
    }; itemsCart.push(obj);
  }
  saveCartItems(JSON.stringify(itemsCart));
};

const calculateValue = () => {
  if (ulItems.children.length === 0) return Array.from(exibValue).forEach(el => el.innerText = '0.00');
  let value = 0;
  for (let i = 0; i < ulItems.children.length; i += 1) {
    value += +ulItems.children[i].id;
  }; return Array.from(exibValue).forEach(el => el.innerText = value.toFixed(2));
}

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  const imageHD = imageSource.replace(/I.jpg/g, 'W.jpg');
  img.className = 'item__image';
  img.src = imageHD;
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
  calculateValue();
  countItems.innerText = +countItems.innerText - 1;
  saveItemsList();
};

const createCartItemElement = (name, salePrice, image) => {
  const li = document.createElement('li');
  const img = document.createElement('img');
  const span = document.createElement('span');
  const paragraph = document.createElement('p');

  span.innerText = salePrice;
  img.src = image.replace(/I.jpg/g, 'W.jpg');;
  li.id = salePrice;
  li.className = 'cart__item';
  paragraph.innerText = name;
  li.appendChild(paragraph);
  li.appendChild(img);
  li.appendChild(span);
  li.addEventListener('click', cartItemClickListener);
  ulItems.appendChild(li);
};

const addItemCard = async (element) => {
  createSpinnerLoading();
  const getItemId = getSkuFromProductItem(element);
  const response = await fetchItem(getItemId);
  const { id: sku, title: name, price: salePrice, thumbnail } = response;
  createCartItemElement(name, salePrice, thumbnail);  
  calculateValue();
  saveItemsList();
  countItems.innerText = +countItems.innerText + 1;
  handleModalPopup();
  removeSpinnerLoading();
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
  createSpinnerLoading();

  const allComputers = await fetchProducts('computador');
  allComputers.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const element = createProductItemElement({ sku, name, image });
    sectionItems.appendChild(element);
  });
  removeSpinnerLoading();
};

const getListCard = () => {
  const carts = JSON.parse(getSavedCartItems('cartItems'));
  if (!carts) return;
  countItems.innerText = carts.length;
  if (carts) {
    for (let i = 0; i < carts.length; i += 1) {
      createCartItemElement(carts[i].content, carts[i].price, carts[i].image)
    }
  }
  calculateValue();
};

btnEmptyCart.addEventListener('click', () => {
  Array.from(ulItems.children).forEach((e) => e.remove());
  Array.from(exibValue).forEach(el => el.innerText = '0.00')
  countItems.innerText = 0;
  saveItemsList();
  toggleCart();
});

cartTitle.onclick = toggleCart;
cartIcon.onclick = toggleCart;
btnOpenModal.onclick = toggleCart;

btnCloseModal.onclick = handleModalPopup;
btnXCloseModal.onclick = handleModalPopup;

btnSearch.onclick = handleSearch;

window.onload = () => {
  getListCard();
  getItemsComputers();
};