const checkout = async (cid) => {
  let inputCarrito = document.getElementById("cartCheckout");
  cid = inputCarrito.value;
  try {
    let payload = await fetch(`/api/cart/${cid}/purchase`, {
      method: "post",
    });
    if (payload.status === 201) {
      let data = await payload.json();
      console.log("data", data);
      alert(data.message);
    }
    if (payload.status === 404) {
      let data = await payload.json();
      alert(data.message);
    }
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (cid, pid) => {
    console.log("xxx");                                                                                 // clg
  try {
    let inputCarrito = document.getElementById("cartCheckout");
    console.log("inputCarrito", inputCarrito);                                                              // clg
    cid = inputCarrito.value;
    let deleteProd = document.getElementById("deleteProd");
    console.log("deleteProd", deleteProd);                                                              // clg
    pid = deleteProd.value;
    console.log("pid".pid);                                                                             // clg
    await fetch(`/api/cart/${cid}/product/${pid}`, {
        method: "post",
      });
   // window.location.reload();
  } catch (error) {
    console.log(error);
  }
};
