const clickLogin = (e) => {
	e.preventDefault();
	const form = document.querySelector('form');
	const formData = new FormData(form);
	fetch('https://b099-2401-4900-1c68-e6e7-2561-d035-ebe7-efe3.in.ngrok.io', {
		mode: 'cors',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		credentials: 'include',
		withCredentials: true,
		body: new URLSearchParams(formData),
	})
		.then((response) => {
			return response.json();
		})
		.then((data, error) => {
			if (data) {
				// return data;
				window.location.redirect(
					'https://b099-2401-4900-1c68-e6e7-2561-d035-ebe7-efe3.in.ngrok.io/user/dashboard',
				);
			} else {
				console.log(error);
			}
		})
		.catch((error) => {
			console.log(error);
		});
};
