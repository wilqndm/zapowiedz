export type Team = {
      id: string;
      name: string;
      address?: string;
      logo?: string;
    };

    export const teams: Team[] = [
      { id: "nadbuzanka-slopsk", name: "Nadbużanka Słopsk", address: "" },
      { id: "impet-lajski", name: "Impet Łajski", address: "Łajski, ul. Sikorskiego 6" },
      { id: "lider-zakroczym", name: "Lider Zakroczym", address: "Zakroczym, ul. O. H. Koźmińskiego 63" },
      { id: "mewa-krubin", name: "Mewa Krubin", address: "Krubin, ul. Jeziorna 40" },
      { id: "aon-rembertow", name: "AON Rembertów", address: "" },
      { id: "wisla-jablonna", name: "Wisła Jabłonna", address: "Jabłonna, ul. Modlińska 102" },
      { id: "rys-ii-laski", name: "Ryś II Laski", address: "Laski, ul. Jana Wieczorka 50" },
      { id: "rzadza-zalubice", name: "Rządza Załubice", address: "" },
      { id: "rotavia-nieporet", name: "Rotavia Nieporęt", address: "" },
      { id: "lotnisko-modlin", name: "Lotnisko Modlin", address: "" },
      { id: "apjd-lomianki", name: "APJD Łomianki", address: "" },
      { id: "pensylwania-lajski", name: "Pensylwania Łajski", address: "" }
    ].map(t => ({ ...t, logo: `/logos/${t.id}.png` }));
