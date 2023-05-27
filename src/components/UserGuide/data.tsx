//TODO: this data should be moved to public/locales
export const data = {
  tr: {
    title: {
      type: "header",
      data: {
        text: "Kullanma Kılavuzu",
        level: 3,
      },
    },
    blocks: [
      {
        type: "list",
        data: {
          style: "unordered",
          items: [
            "Haritadaki noktalar oradaki toplam mahalle sayısını gösterir, yakınlaştırmak için tıklayın.",
            "Sarıdan kırmızıya renkli alanlar o bölgede ne kadar tutanak eksiği olduğunu gösterir.",
            "Yakınlaştıkça göreceğiniz mahalle noktalarına tıklayarak detaylarını görüntüleyin, orada yer alan binanın (okul, muhtarlık, vb.) ıslak imzalı tutanak eksiğini göreceksiniz.",
          ],
        },
      },
      {
        type: "header",
        data: {
          text: "Düğmeler",
          level: 3,
        },
      },
      {
        type: "list",
        data: {
          style: "unordered",
          items: [
            "Sol üst köşedeki + - düğmeleri haritaya yakınlaştırır ve uzaklaştırır",
            "Sağ üst köşedeki arama düğmesinden il ilçe mahalle seçilir",
            "Sağ alt köşedeki düğmeden dil Türkçe ya da İngilizce seçilir",
          ],
        },
      },
      {
        type: "header",
        data: {
          text: "Renkli alanlar",
          level: 6,
        },
      },
      {
        type: "table",
        data: {
          withHeadings: false,
          content: [
            ["İhtiyaç Az", "1"],
            ["İhtiyaç Az-Orta", "2"],
            ["İhtiyaç Orta", "3"],
            ["İhtiyaç Orta-Yüksek", "4"],
            ["İhtiyaç Yüksek", "5"],
          ],
        },
      },
    ],
  },
  en: {
    title: {
      type: "header",
      data: {
        text: "User guide",
        level: 3,
      },
    },
    blocks: [
      {
        type: "list",
        data: {
          style: "unordered",
          items: [
            "The dots on the map show the total number of neighborhoods in there, click to zoom in.",
            "Colored areas from yellow to red indicate how much need there is for a ballot box record in that area.",
            "As you zoom in you will see neighborhood pins, click to view their details, you will see the need for ballot box records in the building (school, headman's office, etc.) located there.",
          ],
        },
      },
      {
        type: "header",
        data: {
          text: "Buttons",
          level: 3,
        },
      },
      {
        type: "list",
        data: {
          style: "unordered",
          items: [
            "Top left + - buttons zoom in and out on the map",
            "Top right search button allows selecting a city, district, and neighborhood",
            "Bottom right switcher allows selecting language Turkish or English.",
          ],
        },
      },
      {
        type: "header",
        data: {
          text: "Colored areas",
          level: 6,
        },
      },
      {
        type: "table",
        data: {
          withHeadings: false,
          content: [
            ["Need Low", "1"],
            ["Need Low-Medium", "2"],
            ["Need Medium", "3"],
            ["Need Medium-High", "4"],
            ["Need High", "5"],
          ],
        },
      },
    ],
  },
};
