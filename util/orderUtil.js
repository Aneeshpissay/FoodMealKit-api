const moment = require('moment');

const itemData = (title, price) => {
    const htmlContent = `<tr class="item"><td>${title}</td><td>₹${price}</td></tr>`;
    return htmlContent;
}

const totalPrice = (total) => {
    const htmlContent = `<tr class="total"><td></td><td>Total: ₹${total}</td></tr>`;
    return htmlContent;
}

const getItem = (item) => {
    let data = '';
    let total = 0;
    for(var i = 0; i < item.length; i++) {
        data += itemData(item[i].title, item[i].price);
        total += item[i].price;
    }
    data += totalPrice(total);
    return data;
}

const getHtmlContent = async (order) => {
    let htmlContent = '<div class="invoice-box">';
    htmlContent += '<p class="invoice-text">Order Invoice</p>'
    htmlContent += '<table cellpadding="0" cellspacing="0"><tr class="top"><td colspan="2"><table><tr><td class="title"><img src="https://res.cloudinary.com/aneesh-pissay/image/upload/v1620544080/Food%20Meal%20Kit%20Blog/chef-grey_c9jgtd.jpg" style="width: 100%; max-width: 100px" /></td><td>';
    htmlContent += `Order ID: ${order.orderId}<br />`;
    htmlContent += `Ordered On: ${moment(order.createdAt).format('LLL')}`;
    htmlContent += ` </td></tr></table></td></tr><tr class="information"><td colspan="2"><table><tr class="heading"><td>Address</td><td>User Details</td><tr><td>`;
    htmlContent += `${order.address.houseno}, ${order.address.roadname}<br />`;
    htmlContent += `${order.address.area}, ${order.address.landmark}<br />`;
    htmlContent += `${order.address.state}, ${order.address.city} - ${order.address.pincode}</td><td>`;
    htmlContent += `${order.address.fullname}<br />`;
    htmlContent += `+91${order.address.phone}</td></tr></table></td></tr><tr class="heading"><td>Payment Method</td><td>Status</td></tr><tr class="details">`;
    htmlContent += `<td>${order.paymentMode}</td><td>${order.status}</td></tr><tr class="heading"><td>Item</td><td>Price</td></tr>`;
    htmlContent += getItem(order.item);
    htmlContent += `</table></div>`;
    return htmlContent;
  };

  module.exports = {
    getHtmlContent: getHtmlContent,
  };