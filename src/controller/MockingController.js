import { fakerEN_US as faker } from "@faker-js/faker";

export class MockingController {
  static mock = (req, res) => {
    try {
     let fakeProducts = [];
      let code = new Date().getTime();
      for (let i = 1; i <= 100; i++) {
        //console.log(faker.person.lastName());
        let title = faker.commerce.productName();
        let description = faker.commerce.productDescription();
        code = code + 1;
        let price = (Math.random() * 1950 + 50).toFixed(2); // random price 50 - 2000, 2 decimals
        let status = true; // fixed
        let stock = Math.floor(Math.random() * 1000); // random stock 0 - 1000
        let category = faker.commerce.department();
        let thumbnails = [
          "https://unsplash.com/es/fotos/una-imagen-generada-por-computadora-de-una-ola-marron-y-negra-BlPyXNam0TM]",
          "https://unsplash.com/es/fotos/un-jarron-que-tiene-un-arbol-VLDJ725jdLE",
          "https://unsplash.com/es/fotos/un-jarron-con-una-flor-encima-de-un-libro-KTXuVIyhO2c",
        ]; // Fixed
        fakeProducts.push({title, description, price, status, stock, category, thumbnails})
      }
      return res.json(fakeProducts);
    } catch {
      return res.json({ error: "Unknown error" });
    }
  };
}
