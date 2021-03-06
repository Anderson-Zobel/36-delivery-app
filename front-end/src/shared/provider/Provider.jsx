import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Context from '../contexts/Context';
import { getProducts } from '../services/api';

export default function Provider({ children }) {
  const [products, setProducts] = useState([]);
  const [userCart, setUserCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState();
  const [disableCartButton, setDisableCartButton] = useState(true);
  const [order, setOrder] = useState();
  const [deliveryStatus, setDeliveryStatus] = useState('Pendente');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchAPI() {
      const response = await getProducts();
      setProducts(response);
    }
    fetchAPI();
  }, []);

  function getTotalAmount() {
    const shopCart = JSON.parse(localStorage.getItem('carrinho'));
    let total = 0;
    if (shopCart) {
      shopCart.forEach((product) => {
        const totalProduct = product.count * product.price;
        total += totalProduct;
      });
    }
    return total.toFixed(2).replace('.', ',');
  }

  const addProductCart = (id, name, count, price) => {
    const cart = JSON.parse(localStorage.getItem('carrinho'));
    if (cart !== null) {
      const item = cart.find((p) => p.id === id);
      if (!item) {
        cart.push({ id, name, count, price });
      } else {
        item.count = count;
      }
      setUserCart(cart);
      localStorage.setItem('carrinho', JSON.stringify(cart));
      setDisableCartButton(false);
    } else {
      const newCart = [{ id, name, count, price }];
      setUserCart(newCart);
      localStorage.setItem('carrinho', JSON.stringify(newCart));
      setDisableCartButton(false);
    }
  };

  const removeProductsById = (id) => {
    const cartFiltered = userCart.filter((p) => p.id !== id);
    setUserCart(cartFiltered);
    if (cartFiltered.length === 0) {
      setDisableCartButton(true);
      localStorage.removeItem('carrinho');
    } else {
      const cartStringFy = JSON.stringify(cartFiltered);
      localStorage.setItem('carrinho', cartStringFy);
    }
  };

  const removeProductCart = (id, count) => {
    const item = userCart.find((p) => p.id === id);
    if (item && item.count > 1 && count !== 0) {
      item.count = count;
      localStorage.setItem('carrinho', JSON.stringify(userCart));
    } else {
      removeProductsById(id);
    }
  };

  const clearCart = () => {
    setUserCart([]);
    localStorage.removeItem('carrinho');
  };

  const myProvider = {
    addProductCart,
    removeProductCart,
    clearCart,
    userCart,
    totalAmount,
    setTotalAmount,
    disableCartButton,
    products,
    getTotalAmount,
    removeProductsById,
    order,
    setOrder,
    deliveryStatus,
    setDeliveryStatus,
    users,
    setUsers,
    setDisableCartButton,
    setUserCart,
  };

  return <Context.Provider value={ myProvider }>{children}</Context.Provider>;
}

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};
