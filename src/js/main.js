//Search Product
const formSearch = document.querySelector('.nav-search__form');
if (formSearch) {
  formSearch.onsubmit = (e) => {
    const inputSearch = formSearch.querySelector('.nav-search__form-input');
    e.preventDefault();
    let valueSearch = inputSearch.value;
    if (valueSearch.length > 0) {
      let url = `timkiem.html?query=${encodeURIComponent(valueSearch)}`;
      window.location.href = url;
      inputSearch.value = '';
    }
  };
}
// Cart Product
var itemList = {
  sp001: { name: 'Sữa Chua Vị Kiwi', price: 21000, photo: 'images/sanpham/kiwi.jpg' },
  sp002: { name: 'Sữa Chua Vị Xoài', price: 22000, photo: 'images/sanpham/mango.jpg' },
  sp003: { name: 'Sữa Chua Vị Dưa lưới', price: 23000, photo: 'images/sanpham/cantaloupe.jpg' },
  sp004: { name: 'Sữa Chua Vị Mâm Xôi', price: 24000, photo: 'images/sanpham/blackberry.jpg' },
  sp005: { name: 'Sữa Chua Vị Dâu Tây', price: 25000, photo: 'images/sanpham/strawberry.jpg' },
  sp006: { name: 'Sữa Chua Vị Việt Quất', price: 26000, photo: 'images/sanpham/blueberry.jpg' },
  sp007: { name: 'Sữa Chua Vị Bưởi', price: 27000, photo: 'images/sanpham/grapes.jpg' },
  sp008: { name: 'Sữa Chua Vị Táo Xanh', price: 28000, photo: 'images/sanpham/green-apple.jpg' },
  sp009: { name: 'Sữa Chua Vị Dứa', price: 29000, photo: 'images/sanpham/pineapple.jpg' }
};
const productList = document.querySelectorAll('.product-item');
if (productList) {
  Array.from(productList).forEach((productItem) => {
    const inputNum = productItem.querySelector('input[type="number"]');
    const btnOrder = productItem.querySelector('.btn-order');
    let amountProduct;
    inputNum.oninput = (e) => {
      let value = Number.parseInt(e.target.value);
      if (value > 0 && value <= 100) {
        amountProduct = value;
      } else if (value > 100) {
        alert('Nhập số lượng sản phẩm dưới 100');
        e.target.value = 0;
      }
    };
    btnOrder.onclick = (e) => {
      let idProductItem = productItem.dataset.productid;
      if (!Boolean(JSON.parse(localStorage.getItem('order')))) {
        localStorage.setItem('order', JSON.stringify([{ [idProductItem]: amountProduct }]));
      } else {
        // Có order
        let orders = JSON.parse(localStorage.getItem('order'));
        let isHaveProInOrder = false;
        orders.forEach((order) => {
          if (idProductItem in order) {
            isHaveProInOrder = true;
            let numberProInOrder = Number.parseInt(order[idProductItem]);
            let total = numberProInOrder + amountProduct;
            if (total > 100) {
              alert(
                `Chúng tôi đã đặt ${itemList[idProductItem].name} là 100 sản phẩm vì tổng số lượng sản phẩm không quá 100`
              );
              order[idProductItem] = 100;
            } else {
              order[idProductItem] = total;
            }
          }
        });
        if (!isHaveProInOrder) {
          let newProOrder = { [idProductItem]: amountProduct };
          orders.push(newProOrder);
        }
        localStorage.setItem('order', JSON.stringify(orders));
      }
      inputNum.value = 0;
    };
  });
}

const cartBtn = document.querySelector('.button-order');
if (cartBtn) {
  cartBtn.onclick = function (e) {
    window.location.href = 'donhang.html';
  };
}
