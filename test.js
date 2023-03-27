// fetch("https://5c53-117-242-153-226.in.ngrok.io/",{method: "POST", mode: "cors", headers: {"Content-Type": "application/x-www-form-urlencoded"}, body: })
// form.addEventListener("onsubmit", function (event) {
//     event.preventDefault();
// });

// const sendData = () => {
//     const formData = new FormData(form);
//     try {
//         fetch("https://5c53-117-242-153-226.in.ngrok.io/", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/x-www-form-urlencoded",
//             },
//             body: new URLSearchParams(formData),
//         })
//             // .then((res) => {
//             //     return res.json();
//             // })
//             // .then((data) => {
//             //     console.log(data);
//             // });
//             // Converting to JSON
//             .then((response) => response.json())

//             // Displaying results to console
//             .then((json) => console.log(json));
//     } catch (err) {
//         console.log(err);
//     }
// }

// form.addEventListener("submit", () => {
//     const formData = new FormData(form);
//     try {
//         // fetch("https://5c53-117-242-153-226.in.ngrok.io/", {
//         //     method: "POST",
//         //     headers: {
//         //         "Content-Type": "application/x-www-form-urlencoded",
//         //     },
//         //     body: new URLSearchParams(formData),
//         // })
//         //     .then((res) => {
//         //         return res.json();
//         //     })
//         //     .then((data) => {
//         //         console.log(data);
//         //     });
//         // fetch("https://5c53-117-242-153-226.in.ngrok.io/")
//         // .then(response => response.json())
//         // .then(data => setPostId(data.id));
//         // axios({
//         //     method: "post",
//         //     url: "https://5c53-117-242-153-226.in.ngrok.io/",
//         //     data: formData,
//         //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         //   })
//         //     .then(function (response) {
//         //       //handle success
//         //       console.log(response);
//         //     })
//         //     .catch(function (response) {
//         //       //handle error
//         //       console.log(response);
//         //     });
//         fetch("https://5c53-117-242-153-226.in.ngrok.io/user/dashboard", {
//             // Adding method type
//             // method: "POST",
//             // body: JSON.stringify({
//             //     email: "foo",
//             //     password: "bar",
//             // }),
//             // // Adding headers to the request
//             // headers: {
//             //     "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
//             // },
//         })
//             // Converting to JSON
//             .then((response) => response.json())

//             // Displaying results to console
//             .then((json) => console.log(json));
//     } catch (err) {
//         console.log(err);
//     }
// });
const clickLogin = (e) => {
    e.preventDefault();
    const form = document.querySelector("form");
    const formData = new FormData(form);
    fetch("https://0723-2401-4900-1c31-277a-c49c-2be0-4acc-b9e6.in.ngrok.io/", {
        mode:"cors",
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
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
                return data;
            } else {
                console.log(error);
            }
        }).catch((error)=> {
            console.log(error);
        });
};
