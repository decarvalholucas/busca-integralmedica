const config = {
  netlifySiteUrl: "https://silly-heyrovsky-fd9eaf.netlify.app",
  shelfTemplateId: "55a0970e-7bf7-4687-bf93-308673d742eb",
};

const { netlifySiteUrl, shelfTemplateId } = config;

const getProduct = () => {
  $("#product-category").on("change", async (e) => {
    if (e.target.value === "Selecione uma categoria") {
      return $(".shelf-product > *").remove();
    }

    const config = {
      categoryId: e.target.value,
      productQuantity: 8,
      shelfId: `${shelfTemplateId}`,
      pageNumber: sessionStorage.setItem("number", 1),
    };

    $(".shelf-product > *").remove();

    async function getProductShelf() {
      const pageUrl = await fetch(
        `${netlifySiteUrl}/.netlify/functions/api/buscapagina?fq=C:${
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
      }
    }
    getProductShelf();
  });
};

const search = () => {
  const config = {
    productQuantity: 16,
    shelfId: `${shelfTemplateId}`,
    pageNumber: sessionStorage.setItem("number", 1),
  };

  const debounceEvent = (fn, wait = 1000, time) => (...args) =>
    clearTimeout(time, (time = setTimeout(() => fn(...args), wait)));

  document.querySelector("#searchProducts").addEventListener(
    "keyup",
    debounceEvent(async (e) => {
      const pageUrl = await fetch(
        `${netlifySiteUrl}/.netlify/functions/api/buscapagina?PS=${config.productQuantity}&sl=${config.shelfId}&cc=${config.productQuantity}&sm=0&ft=${e.target.value}`
      );
      $(".shelf-product > *").remove();
      const response = await pageUrl.text();

      console.log($(response)[1]);

      if ($(".prateleira.vitrine")) {
        $(".shelf-product").append(response);
        $("meta").remove();
      }

      $(".product-image, .product-name a").on("click", (e) =>
        e.preventDefault()
      );
    }, 300)
  );
};

getProduct();
search();
