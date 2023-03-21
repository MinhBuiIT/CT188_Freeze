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
  sp001: { name: 'Sữa Chua Vị Kiwi', price: 21000, photo: '../asset/images/sanpham/kiwi.jpg' },
  sp002: { name: 'Sữa Chua Vị Xoài', price: 22000, photo: '../asset/images/sanpham/mango.jpg' },
  sp003: { name: 'Sữa Chua Vị Dưa lưới', price: 23000, photo: '../asset/images/sanpham/cantaloupe.jpg' },
  sp004: { name: 'Sữa Chua Vị Mâm Xôi', price: 24000, photo: '../asset/images/sanpham/blackberry.jpg' },
  sp005: { name: 'Sữa Chua Vị Dâu Tây', price: 25000, photo: '../asset/images/sanpham/strawberry.jpg' },
  sp006: { name: 'Sữa Chua Vị Việt Quất', price: 26000, photo: '../asset/images/sanpham/blueberry.jpg' },
  sp007: { name: 'Sữa Chua Vị Bưởi', price: 27000, photo: '../asset/images/sanpham/grapes.jpg' },
  sp008: { name: 'Sữa Chua Vị Táo Xanh', price: 28000, photo: '../asset/images/sanpham/green-apple.jpg' },
  sp009: { name: 'Sữa Chua Vị Dứa', price: 29000, photo: '../asset/images/sanpham/pineapple.jpg' }
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
function showCart() {
  const cartDetailRow = document.querySelector('#cart-detail tbody');
  const totalPrice = document.querySelector('#cart-detail .table-foot__total');
  const discountPrice = document.querySelector('#cart-detail .table-foot__discount');
  const taxPrice = document.querySelector('#cart-detail .table-foot__tax');
  const sumPrice = document.querySelector('#cart-detail .table-foot__sum');
  let orders = JSON.parse(localStorage.getItem('order'));
  let html = [];
  let total = 0;
  if (cartDetailRow) {
    orders.forEach((order) => {
      let keys = Object.keys(order);
      let { name, price, photo } = itemList[keys[0]];
      let amount = order[keys[0]];
      total = total + price * amount;
      let htmlItem = `<tr class="table-details__row" data-id=${keys[0]}>
      <td class="table-order-img">
          <img src=${photo} alt="SP" width="100px">
      </td>
      <td colspan="2">${name}</td>
      <td class="table-right">${amount}</td>
      <td class="table-right">${new Intl.NumberFormat().format(price)} đ</td>
      <td class="table-right">${new Intl.NumberFormat().format(amount * price)} đ</td>
      <td class="table-icon" >
          <div onclick="hanldRemovePro(event)"><i class="bi bi-trash3-fill"></i></div>
      </td>
  </tr>`;
      html.push(htmlItem);
      cartDetailRow.innerHTML = html.join('');
    });
    let discount = conditionDiscount(total);
    let tax = 0.1 * (total - total * 0.1);
    let sum = total - discount + tax;
    totalPrice.innerHTML = `<td colspan="7">Tổng thành tiền (A) = ${new Intl.NumberFormat().format(total)}đ</td>`;
    discountPrice.innerHTML = `<td colspan="7">Chiết Khấu (B) = 0.1 x A = ${new Intl.NumberFormat().format(
      discount
    )}đ</td>`;
    taxPrice.innerHTML = `<td colspan="7">Thuế (C) = 10% x (A-B) = ${new Intl.NumberFormat().format(tax)}đ</td>`;
    sumPrice.innerHTML = `<td colspan="7">Tổng đơn hàng = A - B + C = ${new Intl.NumberFormat().format(sum)}đ</td>`;
  }
}
function hanldRemovePro(event) {
  let productRow = event.currentTarget.closest('.table-details__row');
  let productRowId = productRow.dataset.id;
  let orders = JSON.parse(localStorage.getItem('order'));
  orders.forEach((order, index) => {
    if (order[productRowId]) {
      orders.splice(index, 1);
    }
  });
  localStorage.setItem('order', JSON.stringify(orders));
  showCart();
}
function conditionDiscount(number) {
  let arrDay = [2, 3, 4];
  let day = new Date().getDay(); //0-6: sunday-saturday
  let hour = new Date().getHours();
  if (arrDay.includes(day + 1) && ((hour >= 7 && hour <= 11) || (hour >= 13 && hour <= 17))) {
    number = number * 0.1;
    return number;
  }
  return 0;
}
// The storage event of the Window interface fires when a storage area (localStorage) has been modified in the context of another document.
window.onstorage = () => {
  showCart();
};
showCart();
