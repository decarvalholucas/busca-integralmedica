const getProduct = () => {
  $("select").on("change", async (e) => {
    if (e.target.value === "Selecione uma categoria") {
      return $(".shelf-product > *").remove();
    }

    const config = {
      categoryId: e.target.value,
      productQuantity: 8,
      shelfId: "55a0970e-7bf7-4687-bf93-308673d742eb",
      pageNumber: sessionStorage.setItem("number", 1),
    };

    $(".shelf-product > *").remove();

    async function getProductShelf() {
      const pageUrl = await fetch(
        `https://upbeat-clarke-554e29.netlify.app/.netlify/functions/api/buscapagina?fq=C:${
          config.categoryId
        }&PS=${config.productQuantity}&sl=${config.shelfId}&cc=${
          config.productQuantity
        }&sm=0&PageNumber=${sessionStorage.getItem("number")}`
      );
      const response = await pageUrl.text();

      console.log($(response)[1]);

      if ($(".prateleira.vitrine")) {
        $(".shelf-product").append(response);
        $("meta").remove();
      }

      $(".product-image, .product-name a").on("click", (e) =>
        e.preventDefault()
      );

      function pagination() {
        sessionStorage.setItem(
          "number",
          Number(sessionStorage.getItem("number")) + 1
        );
        if ($(".viewMore")) {
          $(".viewMore").remove();
        }
        getProductShelf();

        $(".product-image, .product-name a").on("click", (e) =>
          e.preventDefault()
        );
      }

      $(".shelf-product").append(`<div class="viewMore">ver mais</div>`);

      $(".viewMore").on("click", pagination);

      if (response === "") {
        $(".viewMore").remove();
        $(".shelf-product").append(
          `<div class="productNotFound">Nao temos mais produtos</div>`
        );
      } else {
        $(".productNotFound").remove();
      }
    }
    getProductShelf();
  });
};

getProduct();
