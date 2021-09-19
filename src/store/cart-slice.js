import { createSlice } from '@reduxjs/toolkit';
import { uiActions } from './ui-slice';

const cartSlice = createSlice({
	name: 'cart',
	initialState: {
		items: [],
		totalQuantity: 0,
	},
	reducers: {
		addItemToCart(state, action) {
			const newItem = action.payload;
			const existingItem = state.items.find(item => item.id === newItem.id);
			state.totalQuantity++;

			if (!existingItem) {
				state.items.push({
					id: newItem.id,
					price: newItem.price,
					quantity: 1,
					totalPrice: newItem.price,
					name: newItem.title,
				});
			} else {
				existingItem.quantity++;
				existingItem.totalPrice += newItem.price;
			}
		},
		removeitemFromCart(state, action) {
			const id = action.payload;
			const existingItem = state.items.find(item => item.id === id);
			state.totalQuantity--;

			if (existingItem.quantity === 1) {
				state.items = state.items.filter(item => item.id !== id);
			} else {
				existingItem.quantity--;
				existingItem.totalPrice -= existingItem.price;
			}
		},
	},
});

const firebaseURL =
	'https://redux-cart-b1ac6-default-rtdb.europe-west1.firebasedatabase.app/cart.json';

const sendCartData = cart => {
	return async dispatch => {
		dispatch(
			uiActions.showNotification({
				status: 'pending',
				title: 'Sending',
				message: 'Sending cart data...',
			})
		);

		// Updates our firebase cart whenever the cart is updated in the frontend
		const sendRequest = async () => {
		
			const response = await fetch(firebaseURL, {
				// PUT request overrides existing data in firebase DB
				method: 'PUT',
				body: JSON.stringify(cart),
			});

			if (!response.ok) {
				throw new Error('Sending cart data has failed.');
			}
		};

		try {
			await sendRequest();

			dispatch(
				uiActions.showNotification({
					status: 'success',
					title: 'Success',
					message: 'Sent cart data successfully!',
				})
			);
		} catch (error) {
			dispatch(
				uiActions.showNotification({
					status: 'error',
					title: 'Error',
					message: 'Sending cart data has failed.',
				})
			);
		}
	};
};

export const cartActions = cartSlice.actions;

export default cartSlice;
