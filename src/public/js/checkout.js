const checkout = async (cid) => {
  let inputCarrito = document.getElementById("cartCheckout");
  cid = inputCarrito.value;
  try {
    let payload = await fetch(`/api/cart/${cid}/purchase`, {
      method: "post",
    });
    if (payload.status === 201) {
      let data = await payload.json();
      alert(data.message);
    }
    if (payload.status === 404) {
      let data = await payload.json();
      alert(data.message);
    }
    window.location.reload();
  } catch (error) {
    console.log(error);                                                     // Logger?
  }
};
// delete product from cart
const deleteProduct = async (cid, pid) => {
  try {
    let inputCarrito = document.getElementById("cartCheckout");
    cid = inputCarrito.value;
    let deleteProd = document.getElementById("deleteProd");
    pid = deleteProd.value;
    await fetch(`/api/cart/${cid}/product/${pid}`, {
        method: "post",
      });
   // window.location.reload();
  } catch (error) {
    console.log(error);                                                         // Logger?
  }
};
