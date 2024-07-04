interface Product {
  displayName: {
    en: string;
    pl: string;
  };
  price: number; // Price in PLN
  description: string;
}

interface Category {
  displayName: {
    en: string;
    pl: string;
  };
  products: { [key: string]: Product } | Record<string, never>;
}

interface Products {
  [key: string]: Category;
}

export const products: Products = {
  spices: {
    displayName: {
      en: "Spices",
      pl: "Przyprawy",
    },
    products: {
      tumeric: {
        displayName: {
          en: "Tumeric",
          pl: "Kurkuma",
        },
        price: 10,
        description: "stuff",
      },
      pepper: {
        displayName: {
          en: "Pepper",
          pl: "Pieprz",
        },
        price: 12,
        description: "other stuff",
      },
    },
  },
  drinks: {
    displayName: {
      en: "Drinks",
      pl: "Napoje",
    },
    products: {
      orangeJuice: {
        displayName: {
          en: "Orange juice",
          pl: "Sok pomarańczowy",
        },
        price: 6.5,
        description: "More stuuff",
      },
    },
  },
};
