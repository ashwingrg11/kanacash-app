const country = [
  {
    name: 'Baringo',
    town: [{name: 'Baringo'}, {name: 'Eldama Ravine'}, {name: 'Kabarnet'}],
  },
  {
    name: 'Bomet',
    town: [{name: 'Bomet'}],
  },
  {
    name: 'Bungoma',
    town: [
      {name: 'Bungoma'},
      {name: 'Cheptais'},
      {name: 'Kimilili'},
      {name: 'Malakisi'},
      {name: 'Webuye'},
      {name: 'Kapsokwony'},
    ],
  },
  {
    name: 'Busia',
    town: [{name: 'Busia'}, {name: 'Funyula'}, {name: 'Malaba'}],
  },
  {
    name: 'Elgeyo Marakwet',
    town: [
      {name: 'Elgeyo-Marakwet'},
      {name: 'Iten'},
      {name: 'Kapsowar'},
      {name: 'Majimazuri'},
    ],
  },
  {
    name: 'Embu',
    town: [{name: 'Embu'}, {name: 'Runyenjes'}],
  },
  {
    name: 'Garissa',
    town: [{name: 'Dadaab'}, {name: 'Garissa'}],
  },
  {
    name: 'Homa Bay',
    town: [
      {name: 'Homa Bay'},
      {name: 'Kendu Bay'},
      {name: 'Oyugis'},
      {name: 'Sindo'},
    ],
  },
  {
    name: 'Isiolo',
    town: [{name: 'Garbatula'}, {name: 'Isiolo'}, {name: 'Kinna'}],
  },
  {
    name: 'Kajiado',
    town: [
      {name: 'Bissil'},
      {name: 'Kajiado'},
      {name: 'Kitengela'},
      {name: 'Namanga'},
      {name: 'Ngong'},
    ],
  },
  {
    name: 'Kakamega',
    town: [{name: 'Butere'}, {name: 'Kakamega'}, {name: 'Mumias'}],
  },
  {
    name: 'Kericho',
    town: [
      {name: 'Kericho'},
      {name: 'Kipkelion'},
      {name: 'Litein'},
      {name: 'Londiani'},
    ],
  },
  {
    name: 'Kiambu',
    town: [
      {name: 'Gatundu'},
      {name: 'Juja'},
      {name: 'Karuri'},
      {name: 'Kiambu'},
      {name: 'Kikuyu'},
      {name: 'Ruiru'},
      {name: 'Thika'},
    ],
  },
  {
    name: 'Kilifi',
    town: [
      {name: 'Gede'},
      {name: 'Kilifi'},
      {name: 'Malindi'},
      {name: 'Marereni'},
      {name: 'Mariakani'},
      {name: 'Mtwapa'},
      {name: 'Takaungu'},
      {name: 'Watamu'},
    ],
  },
  {
    name: 'Kirinyaga',
    town: [
      {name: 'Kagio'},
      {name: 'Kagumo'},
      {name: 'Kerugoya Kutus Town'},
      {name: 'Kirinyaga'},
    ],
  },
  {
    name: 'Kisii',
    town: [
      {name: 'Keroka'},
      {name: 'Kisii'},
      {name: 'Nyansiongo'},
      {name: 'Ogembo'},
      {name: 'Suneka'},
      {name: 'Tabaka'},
    ],
  },
  {
    name: 'Kisumu',
    town: [
      {name: 'Ahero'},
      {name: 'Awasi'},
      {name: 'Kisumu'},
      {name: 'Maseno'},
      {name: 'Muhoroni'},
    ],
  },
  {
    name: 'Kitui',
    town: [{name: 'Kitui'}, {name: 'Mutomo'}],
  },
  {
    name: 'Kwale',
    town: [
      {name: 'Diani Beach'},
      {name: 'Kwale'},
      {name: 'Samburu'},
      {name: 'Shimoni'},
      {name: 'Ukunda'},
    ],
  },
  {
    name: 'Laikipia',
    town: [
      {name: 'Kinamba'},
      {name: 'Laikipia'},
      {name: 'Nanyuki'},
      {name: 'Nyahururu'},
      {name: 'Rumuruti'},
    ],
  },
  {
    name: 'Lamu',
    town: [{name: 'Lamu'}],
  },
  {
    name: 'Machakos',
    town: [
      {name: 'Athi River-Mavoko'},
      {name: 'Kangundo'},
      {name: 'Kathiani'},
      {name: 'Machakos'},
      {name: 'Masii'},
      {name: 'Matuu'},
    ],
  },
  {
    name: 'Makueni',
    town: [
      {name: 'Emali'},
      {name: 'Kibwezi'},
      {name: 'Makindu'},
      {name: 'Sultan Hamud'},
      {name: 'Wote'},
    ],
  },
  {
    name: 'Mandera',
    town: [{name: 'Mandera'}],
  },
  {
    name: 'Marsabit',
    town: [
      {name: 'Laisamis'},
      {name: 'Loiyangalani'},
      {name: 'Loyangalani'},
      {name: 'Marsabit'},
      {name: 'Moyale'},
      {name: 'Sololo'},
    ],
  },
  {
    name: 'Meru',
    town: [{name: 'Meru'}],
  },
  {
    name: 'Migori',
    town: [{name: 'Kehancha'}, {name: 'Migori'}, {name: 'Muhuru Bay'}],
  },
  {
    name: 'Mombasa',
    town: [{name: 'Mombasa'}],
  },
  {
    name: 'Muranga',
    town: [
      {name: 'Kangema'},
      {name: 'Kigumo'},
      {name: 'Kiria-Ini'},
      {name: 'Makuyu'},
      {name: 'Maragua'},
      {name: 'Muranga'},
    ],
  },
  {
    name: 'Nairobi',
    town: [{name: 'Langata'}, {name: 'Nairobi'}],
  },
  {
    name: 'Nakuru',
    town: [
      {name: 'Bahati'},
      {name: 'Dundori'},
      {name: 'Gilgil'},
      {name: 'Naivasha'},
      {name: 'Nakuru'},
      {name: 'Olenguruone'},
      {name: 'Salgaa'},
    ],
  },
  {
    name: 'Nandi',
    town: [{name: 'Kapsabet'}, {name: 'Nandi'}],
  },
  {
    name: 'Narok',
    town: [{name: 'Nairagieenkare'}, {name: 'Narok'}],
  },
  {
    name: 'Nyamira',
    town: [{name: 'Nyamira'}],
  },
  {
    name: 'Nyandarua',
    town: [{name: 'Njabini'}, {name: 'Nyandarua'}, {name: 'Ol Kalou'}],
  },
  {
    name: 'Nyeri',
    town: [
      {name: 'Endarasha'},
      {name: 'Karatina'},
      {name: 'Naro Moru'},
      {name: 'Naromoru'},
      {name: 'Nyeri'},
      {name: 'Othaya'},
    ],
  },
  {
    name: 'Samburu',
    town: [{name: 'Archerspost'}, {name: 'Baragoi'}, {name: 'Maralal'}],
  },
  {
    name: 'Siaya',
    town: [
      {name: 'Bondo'},
      {name: 'Bumala'},
      {name: 'Siaya'},
      {name: 'Ugunja'},
      {name: 'Ukwala'},
      {name: 'Yala'},
    ],
  },
  {
    name: 'Taita-Taveta',
    town: [
      {name: 'Mwatate'},
      {name: 'Mwingi'},
      {name: 'Taita-Taveta'},
      {name: 'Taveta'},
      {name: 'Voi'},
      {name: 'Wundanyi'},
    ],
  },
  {
    name: 'Tana River',
    town: [{name: 'Hola'}],
  },
  {
    name: 'Tharaka-Nithi',
    town: [{name: 'Chogoria'}, {name: 'Chuka'}],
  },
  {
    name: 'Trans-Nzoia',
    town: [{name: 'Kitale'}],
  },
  {
    name: 'Turkana',
    town: [
      {name: 'Kakuma'},
      {name: 'Lodwar'},
      {name: 'Lokichogio'},
      {name: 'Lolgorian'},
      {name: 'Turkana'},
    ],
  },
  {
    name: 'Uasin Gishu',
    town: [{name: 'Eldoret'}, {name: 'Burnt Forest'}],
  },
  {
    name: 'Vihiga',
    town: [{name: 'Vihiga'}],
  },
  {
    name: 'Wajir',
    town: [{name: 'Wajir'}],
  },
  {
    name: 'West Pokot',
    town: [{name: 'Kapenguria'}],
  },
];

export default country;
