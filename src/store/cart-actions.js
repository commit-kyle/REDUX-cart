import { uiActions } from './ui-slice';
import { cartActions } from './cart-slice';

const firebaseURL =
	'https://redux-cart-b1ac6-default-rtdb.europe-west1.firebasedatabase.app/cart.json';

export const fetchCartData = () => {
  return async dispatch => {
    const fetchData = async () => {
      const response = await fetch(firebaseURL);

      if (!response.ok) {
        throw new Error('Could not fetch cart data')
      }

      const data = await response.json();

      return data;
    }

    try {
      const cartData = await fetchData();
      dispatch(cartActions.replaceCart(cartData));
    } catch (error) {
      dispatch(
				uiActions.showNotification({
					status: 'error',
					title: 'Error',
					message: 'Fetching cart data has failed.',
				})
			);
    }

  }
}

export const sendCartData = cart => {
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
