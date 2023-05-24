//TODO: this data should be moved to public/locales
export const data = {
  tr: {
    title: {
      type: "header",
      data: {
        text: "Nasıl kullanırım?",
        level: 3,
      },
    },
    blocks: [
      {
        type: "list",
        data: {
          style: "unordered",
          items: [
            "Karşınızdaki haritada bölgelere çıkan yuvarlakların üstüne tıklayarak yaklaşın.",
            "Bölgelere yaklaştıkça müşahit yoğunluğu okul bazlı görünecektir.",
            "Yakınlaşmayı sürdürdükçe bilgilere erişeceksiniz.",
            "Mavi pinlere tıklayıp bilgileri görüntüleyin.",
            "En başta yer adı/adres bilgisini okuyacaksınız. Düğmeler ile amacına uygun ilerlemek isteyebilirsiniz.",
          ],
        },
      },
      {
        type: "header",
        data: {
          text: "Kullanma yöntemleri",
          level: 3,
        },
      },
      {
        type: "list",
        data: {
          style: "unordered",
          items: [
            "*+* artı düğmesi ile haritayı yakınlaştırıp bakın.",
            "*-* artı düğmesi ile haritayı uzaklaştırıp bakın.",
          ],
        },
      },
      {
        type: "header",
        data: {
          text: "Renkli alanların anlamları",
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
        text: "How do I use it?",
        level: 3,
      },
    },
    blocks: [
      {
        type: "list",
        data: {
          style: "unordered",
          items: [
            "Approach by clicking on the circles that appear on the map in front of you.",
            "As you get closer to the regions, the observer density will appear school-based.",
            "As you continue to zoom in, you will access information.",
            "Click on the blue pins to view information.",
            "First of all, you will read the place name/address information. You may want to proceed with the buttons in accordance with its purpose.",
          ],
        },
      },
      {
        type: "header",
        data: {
          text: "Using methods",
          level: 3,
        },
      },
      {
        type: "list",
        data: {
          style: "unordered",
          items: [
            "Zoom the map with the *+* plus button.",
            "*-* zoom out the map with the plus button",
          ],
        },
      },
      {
        type: "header",
        data: {
          text: "Meanings of the colored areas",
          level: 6,
        },
      },
      {
        type: "table",
        data: {
          withHeadings: false,
          content: [
            ["Low Need", "1"],
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
