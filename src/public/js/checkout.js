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
    let errorData = {
      title: "Error checking out",
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
    customLogger.error(JSON.stringify(errorData, null, 5));
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Unexpected server error - Try again later or contact admninistrator`,
    });
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
    let errorData = {
      title: "Error deleting product in cart",
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
    customLogger.error(JSON.stringify(errorData, null, 5));
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Unexpected server error - Try again later or contact admninistrator`,
    });
  }
};
