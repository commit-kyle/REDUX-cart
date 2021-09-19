import { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import Notification from './components/UI/Notification';

import { uiActions } from './store/ui-slice';

let initialRender = true;

function App() {
	const dispatch = useDispatch();

	const showCart = useSelector(state => state.ui.cartIsVisible);
	const cart = useSelector(state => state.cart);
	const notification = useSelector(state => state.ui.notification);
	const firebaseURL =
		'https://redux-cart-b1ac6-default-rtdb.europe-west1.firebasedatabase.app/cart.json';

	useEffect(() => {
		// Updates our firebase cart whenever the cart is updated in the frontend
		const sendCartData = async () => {
			dispatch(
				uiActions.showNotification({
					status: 'pending',
					title: 'Sending',
					message: 'Sending cart data...',
				})
			);
			const response = await fetch(firebaseURL, {
				// PUT request overrides existing data in firebase DB
				method: 'PUT',
				body: JSON.stringify(cart),
			});

			if (!response.ok) {
				throw new Error('Sending cart data has failed.');
			}

			dispatch(
				uiActions.showNotification({
					status: 'success',
					title: 'Success',
					message: 'Sent cart data successfully!',
				})
			);
		};

		if (initialRender) {
			initialRender = false;
			return;
		}

		sendCartData().catch(err => {
			dispatch(
				uiActions.showNotification({
					status: 'error',
					title: 'Error',
					message: 'Sending cart data has failed.',
				})
			);
		});
	}, [cart, dispatch]);

	return (
		<Fragment>
			{notification && (
				<Notification
					status={notification.status}
					title={notification.title}
					message={notification.message}
				/>
			)}
			<Layout>
				{showCart && <Cart />}
				<Products />
			</Layout>
		</Fragment>
	);
}

export default App;
