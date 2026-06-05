const YT = "https://www.youtube.com/playlist?list=";
const SC = "https://wiki.supercombo.gg/w/Street_Fighter_6/";
const UFD = "https://ultimateframedata.com/sf6/";
const LP = "https://liquipedia.net/fighters/";

type Video = { title: string; url: string };

export interface TechSection {
  guides?: Video[];
  combos?: Video[];
  pressure?: Video[];
  setups?: Video[];
  techs?: Video[];
}

export interface Player {
  name: string;
  liquipedia?: string;
}

export interface CharacterLinks {
  supercombo?: string;
  ufd?: string;
  playlist?: string;
  raidhyn?: string;
  misterCrimson?: string;
  discords?: string[];
  videoGuides?: Video[];
  techVideos?: Video[];
  techs?: TechSection;
  players?: Player[];
  playersNote?: string;
  playersToWatch?: { name: string; twitch: string }[];
}

export const CHARACTER_LINKS: Record<string, CharacterLinks> = {
  ryu: {
    supercombo: SC + "Ryu",
    ufd: UFD + "ryu",
    playlist: YT + "PLvZ5t8JLwU9IXbcuvqGhm2KvTLMBA0iNL",
    raidhyn:
      "https://docs.google.com/spreadsheets/d/1p8qMi6Yagtk_7Zzh6_P0IKl2e5TnY5a-7vaBQLK3QMo/",
    discords: ["https://discord.gg/jxy55GtZ5d"],
    techs: {
      guides: [
        { title: "Intro", url: "https://www.youtube.com/watch?v=xc2Ogr2JX6g" },
        {
          title: "Full Guide",
          url: "https://www.youtube.com/watch?v=FpsASI8w5EA",
        },
        {
          title: "Burnout Pressure",
          url: "https://www.youtube.com/watch?v=MULDXBqT9Bw",
        },
        {
          title: "Anti Ryu",
          url: "https://www.youtube.com/watch?v=aPVrSlCro80",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=XT3XXT5KBMA" },
        {
          title: "Drive Impact Combos",
          url: "https://www.youtube.com/watch?v=wcnW4lUcahE",
        },
        {
          title: "Denjin Combos",
          url: "https://www.youtube.com/watch?v=lUGJm0O-dvo",
        },
        {
          title: "Stun Combos",
          url: "https://www.youtube.com/watch?v=AJ7Q528_ksE",
        },
      ],
      pressure: [
        {
          title: "Blockstrings",
          url: "https://www.youtube.com/watch?v=XbNPhT0RjXo",
        },
      ],
      setups: [
        { title: "Oki", url: "https://www.youtube.com/watch?v=rDRq2pc47vU" },
        {
          title: "+37 Setups",
          url: "https://www.youtube.com/watch?v=a0SceSc6VGo",
        },
        {
          title: "Medium DP Setups",
          url: "https://www.youtube.com/watch?v=1KhYrq974qo",
        },
        {
          title: "Sideswitch",
          url: "https://www.youtube.com/watch?v=TqSptmnmEJo&t=127s",
        },
        {
          title: "Corner Setups",
          url: "https://www.youtube.com/watch?v=nJ5cUuElbEs",
        },
        {
          title: "+42 and +35 Setups",
          url: "https://www.youtube.com/watch?v=YX-HVESawwY",
        },
        {
          title: "Medium Donkey & Tatsu Setups",
          url: "https://www.youtube.com/watch?v=Pt1CJzTu8H8",
        },
        {
          title: "Drive Impact Resets",
          url: "https://www.youtube.com/watch?v=TqSptmnmEJo&t=138s",
        },
      ],
    },
    players: [
      { name: "Blaz", liquipedia: LP + "Blaz" },
      { name: "Kusanagi", liquipedia: LP + "Kusanagi_(French_Player)" },
      { name: "Shuto", liquipedia: LP + "Shuto" },
    ],
  },

  luke: {
    supercombo: SC + "Luke",
    ufd: UFD + "luke",
    playlist: YT + "PLvZ5t8JLwU9I7Orfcz6s3OjEdyexIGahH",
    discords: ["https://discord.gg/Xqn2wWamJ4"],
    techs: {
      guides: [
        {
          title: "Neutral",
          url: "https://www.youtube.com/watch?v=JC8auaO4tVM",
        },
        { title: "Intro", url: "https://www.youtube.com/watch?v=Z80WOYwV1-o" },
        {
          title: "Suppressor Guide",
          url: "https://www.youtube.com/watch?v=WnPvDOOFCFY",
        },
        {
          title: "Advanced Guide",
          url: "https://www.youtube.com/watch?v=kjaHOSlos1s",
        },
        {
          title: "Anti Luke",
          url: "https://www.youtube.com/watch?v=DzsQ8r-W6tA",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=twvm0JDMVOM" },
        {
          title: "Max Damage Wallsplat",
          url: "https://www.youtube.com/watch?v=IHrmgpkW0KA",
        },
        {
          title: "Stun Combo",
          url: "https://www.youtube.com/watch?v=3lS3IVSMrlg",
        },
      ],
      pressure: [
        {
          title: "Burnout Pressure",
          url: "https://www.youtube.com/watch?v=Ngixdn-V5oI",
        },
        {
          title: "Chip Kill Blockstrings",
          url: "https://www.youtube.com/watch?v=stFEsWpomv4",
        },
      ],
      setups: [
        {
          title: "Oki & Checkmates",
          url: "https://www.youtube.com/watch?v=2Rx3xgLE6Iw",
        },
        {
          title: "Oki & Meaty",
          url: "https://www.youtube.com/watch?v=j-CnkfsCq4I",
        },
      ],
      techs: [
        { title: "Techs", url: "https://www.youtube.com/watch?v=J91nVq0bdkM" },
      ],
    },
    players: [
      { name: "NoahTheProdigy", liquipedia: LP + "NoahTheProdigy" },
      { name: "Chris Wong", liquipedia: LP + "Chris_Wong" },
      { name: "Ugang", liquipedia: LP + "Ugang" },
    ],
  },

  kimberly: {
    supercombo: SC + "Kimberly",
    ufd: UFD + "kimberly",
    playlist: YT + "PLvZ5t8JLwU9K1p3AQg1ZZJyXt9kh8EHkQ",
    raidhyn:
      "https://docs.google.com/spreadsheets/d/1XCmbMGhXqwUiy_CiJENMNDHVf6a8VdYHQrUANPm0Za4/",
    misterCrimson: "https://www.youtube.com/watch?v=mwAHhyxXusg",
    discords: ["https://discord.gg/zW7euU62Fu"],
    techs: {
      guides: [
        { title: "Guide", url: "https://www.youtube.com/watch?v=OepGnXGuFMg" },
        {
          title: "Anti Kimberly",
          url: "https://www.youtube.com/watch?v=86Itgdy5Gr4",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=kTnpS9B3WSA" },
        {
          title: "Can Combos",
          url: "https://www.youtube.com/watch?v=M93tLiOg1b4",
        },
        {
          title: "DP Punish",
          url: "https://www.youtube.com/watch?v=1tU84uw666M",
        },
      ],
      pressure: [
        {
          title: "Burnout Pressure",
          url: "https://www.youtube.com/watch?v=HZe6kRr8qRU",
        },
        {
          title: "Blockstrings",
          url: "https://www.youtube.com/watch?v=iBQ-C0MD7PM",
        },
      ],
      setups: [
        { title: "Oki", url: "https://www.youtube.com/watch?v=A3rxVe1zYao" },
        {
          title: "Can Setups",
          url: "https://www.youtube.com/watch?v=50iajd-5XDQ",
        },
        {
          title: "Midscreen Oki",
          url: "https://www.youtube.com/watch?v=E3-Sr5PLjn0",
        },
        {
          title: "Tatsu Oki",
          url: "https://www.youtube.com/watch?v=s5aQ6kwyeTo",
        },
        {
          title: "Midscreen Setups",
          url: "https://www.youtube.com/watch?v=MEqEWLEV6K4",
        },
        {
          title: "Safe Jumps",
          url: "https://www.youtube.com/watch?v=_i4vmA3eFeE",
        },
      ],
      techs: [
        {
          title: "Drive Rush",
          url: "https://www.youtube.com/watch?v=4hwN_o8axHw",
        },
        { title: "Techs", url: "https://www.youtube.com/watch?v=Z3w9VdLwVf4" },
      ],
    },
    players: [
      { name: "S4ltyKiD", liquipedia: LP + "S4ltyKiD" },
      { name: "Matsu56", liquipedia: LP + "Matsu56" },
      { name: "Psycho", liquipedia: LP + "Psycho" },
    ],
  },

  chunli: {
    supercombo: SC + "Chun-Li",
    ufd: UFD + "chunli",
    playlist: YT + "PLvZ5t8JLwU9KkaAhDfFZMpdHMbPtQPWcP",
    raidhyn:
      "https://docs.google.com/spreadsheets/d/1NbQIc4s080YhFJDnGDKaUzXpCrVaf42ISviSeJort8w/",
    discords: ["https://discord.com/invite/nDFhUjM"],
    techs: {
      guides: [
        { title: "Intro", url: "https://www.youtube.com/watch?v=X93g4j_kAL8" },
        {
          title: "Kikoken Guide",
          url: "https://www.youtube.com/watch?v=vUgvc63-V0g",
        },
        {
          title: "Stance Mixups Guide",
          url: "https://www.youtube.com/watch?v=j7sUWdXQP14",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=uhpqCnoGMGc" },
        {
          title: "Drive Impact Combos",
          url: "https://www.youtube.com/watch?v=uhpqCnoGMGc&t=1657s",
        },
        {
          title: "SA2 Combos",
          url: "https://www.youtube.com/watch?v=0EZudnRujQ8",
        },
        {
          title: "Stun Combo",
          url: "https://www.youtube.com/watch?v=2dyemWBc2q8&t=360s",
        },
      ],
      pressure: [
        {
          title: "Burnout Pressure",
          url: "https://www.youtube.com/watch?v=mp3tG_Vdmlg",
        },
      ],
      setups: [
        { title: "Oki", url: "https://www.youtube.com/watch?v=xj6Plxpys7c" },
        {
          title: "Safejumps",
          url: "https://www.youtube.com/watch?v=tcA3oKqBCnE",
        },
        {
          title: "Side Switch",
          url: "https://www.youtube.com/watch?v=cCq9kAIsjYM",
        },
      ],
      techs: [
        { title: "Techs", url: "https://www.youtube.com/watch?v=bXCq1Iw2L0Q" },
        {
          title: "Instant Air Legs",
          url: "https://www.youtube.com/watch?v=v86fbju0mR4",
        },
      ],
    },
    players: [
      { name: "GO1", liquipedia: LP + "GO1" },
      { name: "Valmaster", liquipedia: LP + "Valmaster" },
      { name: "NYChrisG", liquipedia: LP + "NYChrisG" },
      { name: "Moke", liquipedia: LP + "Moke" },
    ],
  },

  manon: {
    supercombo: SC + "Manon",
    ufd: UFD + "manon",
    playlist: YT + "PLvZ5t8JLwU9KXDa9spT_GucTabWKAgPnO",
    discords: ["https://discord.gg/yGhCvhgzjW"],
    techs: {
      guides: [
        { title: "Guide", url: "https://www.youtube.com/watch?v=SaonIowpkgU" },
        {
          title: "Strategy",
          url: "https://www.youtube.com/watch?v=QNaLU5Ir-eQ",
        },
        {
          title: "Anti Manon",
          url: "https://www.youtube.com/watch?v=wXDfNAGGyws",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=mUUl9I6XGzY" },
        {
          title: "Drive Impact",
          url: "https://www.youtube.com/watch?v=bw4LNtKuAjo",
        },
      ],
      pressure: [
        {
          title: "Burnout Pressure",
          url: "https://www.youtube.com/watch?v=Iu4NsTGrLQo",
        },
      ],
      setups: [
        { title: "Oki", url: "https://www.youtube.com/watch?v=xnpjmu15R7E" },
        {
          title: "Command Grab Oki",
          url: "https://www.youtube.com/watch?v=jdZi6c5fAtg",
        },
      ],
      techs: [
        { title: "Techs", url: "https://www.youtube.com/watch?v=QbjjX3FoXcI" },
      ],
    },
    players: [
      { name: "IDom", liquipedia: LP + "IDom" },
      { name: "Tachikawa", liquipedia: LP + "Tachikawa" },
    ],
  },

  zangief: {
    supercombo: SC + "Zangief",
    ufd: UFD + "zangief",
    playlist: YT + "PLvZ5t8JLwU9KpPsQ_3ZRylSI7esoYKk-x",
    misterCrimson: "https://www.youtube.com/watch?v=bZJCUSKM3mE",
    discords: ["https://discord.gg/0pyTHFGvV3sA7QGX"],
    techs: {
      guides: [
        { title: "Intro", url: "https://www.youtube.com/watch?v=rEVZbp1yL9o" },
        {
          title: "Advanced Guide",
          url: "https://www.youtube.com/watch?v=ifnqSi7DnnA",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=zROn7wmg984" },
        {
          title: "Stun Combos",
          url: "https://www.youtube.com/watch?v=w4fnC-87EvU",
        },
      ],
      pressure: [
        {
          title: "Frame Traps",
          url: "https://www.youtube.com/watch?v=ifnqSi7DnnA&t=1929s",
        },
        {
          title: "Burnout Pressure",
          url: "https://www.youtube.com/watch?v=hA9ywfHu8hI",
        },
      ],
      setups: [
        { title: "Oki", url: "https://www.youtube.com/watch?v=StqAGNdQHZk" },
        {
          title: "Safejumps",
          url: "https://www.youtube.com/watch?v=2A2spS2eR9g",
        },
        {
          title: "Sideswitch",
          url: "https://www.youtube.com/watch?v=seg6MCewEoc",
        },
      ],
      techs: [
        {
          title: "Siberian Express",
          url: "https://www.youtube.com/watch?v=vE7s1qW_ULE",
        },
        {
          title: "Leverless Shortcuts",
          url: "https://www.youtube.com/watch?v=BpwU-Xuq_KM",
        },
      ],
    },
    players: [
      { name: "Itabashi Zangief", liquipedia: LP + "Itabashi_Zangief" },
      { name: "Jr.", liquipedia: LP + "Jr." },
      { name: "Zangief Bolado", liquipedia: LP + "Zangief_bolado" },
      { name: "Kobayan", liquipedia: LP + "Kobayan" },
    ],
  },

  jp: {
    supercombo: SC + "JP",
    ufd: UFD + "jp",
    playlist: YT + "PLvZ5t8JLwU9LbwkD0PuYR767hU5atia62",
    misterCrimson: "https://www.youtube.com/watch?v=vLlSxDwErPM",
    discords: ["https://discord.gg/k9yDhW2awC"],
    techs: {
      guides: [
        { title: "Intro", url: "https://www.youtube.com/watch?v=MdBKdgVgvf4" },
        {
          title: "Advanced Guide",
          url: "https://www.youtube.com/watch?v=0mfvoTEXHxI",
        },
        {
          title: "SA2 Guide",
          url: "https://www.youtube.com/watch?v=jrYrmIntHw0",
        },
        {
          title: "Anti JP",
          url: "https://www.youtube.com/watch?v=rDLG7OIqRm4",
        },
        {
          title: "Anti JP Zoning",
          url: "https://www.youtube.com/watch?v=sndGUhz-Uyo",
        },
      ],
      combos: [
        {
          title: "Drive Impact Combos",
          url: "https://www.youtube.com/watch?v=x5FrEpiVY2c&t=459s",
        },
        {
          title: "Anti Air Combos",
          url: "https://www.youtube.com/watch?v=x5FrEpiVY2c&t=757s",
        },
        {
          title: "Stun Combos",
          url: "https://www.youtube.com/watch?v=hJQ2Im1F0aM",
        },
      ],
      setups: [
        {
          title: "Oki",
          url: "https://www.youtube.com/watch?v=jrYrmIntHw0&t=246s",
        },
        {
          title: "Sideswitch",
          url: "https://www.youtube.com/watch?v=1VyR3xnCtkM&t=195s",
        },
        {
          title: "Setplay",
          url: "https://www.youtube.com/watch?v=x5FrEpiVY2c&t=837s",
        },
        {
          title: "Safe Jumps",
          url: "https://www.youtube.com/watch?v=8LrNzztwWLk&t=302s",
        },
        {
          title: "Meaties & Resets",
          url: "https://www.youtube.com/watch?v=8LrNzztwWLk&t=359s",
        },
      ],
      techs: [
        {
          title: "Portals Guide",
          url: "https://www.youtube.com/watch?v=vs3cd_GCyMI",
        },
        { title: "Techs", url: "https://www.youtube.com/watch?v=8LrNzztwWLk" },
        {
          title: "Amnesia Followups",
          url: "https://www.youtube.com/watch?v=x5FrEpiVY2c&t=554s",
        },
      ],
    },
    players: [
      { name: "Tokido", liquipedia: LP + "Tokido" },
      { name: "Kakeru", liquipedia: LP + "Kakeru" },
      { name: "Ryusei", liquipedia: LP + "Ryusei" },
      { name: "DCQ", liquipedia: LP + "DingChunQiu" },
    ],
  },

  dhalsim: {
    supercombo: SC + "Dhalsim",
    ufd: UFD + "dhalsim",
    playlist: YT + "PLvZ5t8JLwU9Jcr7KeG-f7nXN1pYdpBZjs",
    misterCrimson: "https://www.youtube.com/watch?v=tC_hKBV6aik",
    discords: [
      "https://discord.gg/0pw1HkuKuIcoL8th",
      "https://discord.gg/EUhC67mjv6",
    ],
    techs: {
      guides: [
        { title: "Guide", url: "https://www.youtube.com/watch?v=YoHeSEb8BdY" },
        {
          title: "Fireball",
          url: "https://www.youtube.com/watch?v=ZjxOQpEjYLE",
        },
        {
          title: "Charged Fireball",
          url: "https://www.youtube.com/watch?v=NiRFwtel428",
        },
        {
          title: "How to Defend",
          url: "https://www.youtube.com/watch?v=i-U-nURsJI0",
        },
        {
          title: "Strategies",
          url: "https://www.youtube.com/watch?v=jVslujAv-nc",
        },
      ],
      combos: [
        {
          title: "Stun Combo",
          url: "https://www.youtube.com/watch?v=nk2C9CmuYoc",
        },
        {
          title: "Trade Combos",
          url: "https://www.youtube.com/watch?v=DwUmW16Tk34",
        },
      ],
      pressure: [
        {
          title: "Burnout Pressure",
          url: "https://www.youtube.com/watch?v=aS0dE0mqdVI",
        },
      ],
      setups: [
        { title: "Oki", url: "https://www.youtube.com/watch?v=oYoHVaZCIP8" },
      ],
      techs: [
        { title: "Drill", url: "https://www.youtube.com/watch?v=B0KSAZzQiG8" },
        {
          title: "Teleport",
          url: "https://www.youtube.com/watch?v=p1ndZMiJvxM",
        },
        {
          title: "OD Yoga Arch",
          url: "https://www.youtube.com/watch?v=cbZGuO1TshM",
        },
        { title: "Techs", url: "https://www.youtube.com/watch?v=rYQM9E-qq5I" },
      ],
    },
    players: [
      { name: "Mister Crimson", liquipedia: LP + "Mister_Crimson" },
      { name: "YHC-Mochi", liquipedia: LP + "YHC-Mochi" },
      { name: "Garnet", liquipedia: LP + "Garnet" },
      { name: "Torimeshi", liquipedia: LP + "Torimeshi" },
    ],
  },

  cammy: {
    supercombo: SC + "Cammy",
    ufd: UFD + "cammy",
    playlist: YT + "PLvZ5t8JLwU9IQWiIb-Prj8WGKaAUnqQ3b",
    raidhyn:
      "https://docs.google.com/spreadsheets/d/1eNsGZs7kX-kaCi8cB-iEVxlLfkWuSkIP_COjFzoLUaU/",
    discords: ["https://discord.com/invite/0pgjU35fSAeJNlCQ"],
    techs: {
      guides: [
        { title: "Guide", url: "https://www.youtube.com/watch?v=jbpn1eYfuKI" },
        {
          title: "Hooligan Guide",
          url: "https://www.youtube.com/watch?v=PJPGemesccQ",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=upNw5B6UTgo" },
        {
          title: "Drive Impact Combos",
          url: "https://www.youtube.com/watch?v=7gMjNlWK6xw",
        },
      ],
      pressure: [
        {
          title: "Burnout Pressure",
          url: "https://www.youtube.com/watch?v=0HJMFBHckZM",
        },
      ],
      setups: [
        { title: "Oki", url: "https://www.youtube.com/watch?v=dLzIr-bDsDU" },
        {
          title: "Safejumps",
          url: "https://www.youtube.com/watch?v=VUg5O-IOLSU",
        },
        {
          title: "Setplay",
          url: "https://www.youtube.com/watch?v=wQc0dqYSss4",
        },
      ],
      techs: [
        {
          title: "Spin Knuckle Mixup",
          url: "https://www.youtube.com/watch?v=Guk3MS7IcII",
        },
      ],
    },
    players: [
      { name: "Punk", liquipedia: LP + "Punk" },
      { name: "Kilzyou", liquipedia: LP + "Kilzyou" },
      { name: "Phenom", liquipedia: LP + "Phenom" },
    ],
  },

  ken: {
    supercombo: SC + "Ken",
    ufd: UFD + "ken",
    playlist: YT + "PLvZ5t8JLwU9IFYjprE0kZrTb4TPn0l77c",
    raidhyn:
      "https://docs.google.com/spreadsheets/d/1wuC-rzl3caOXpUt6uiv8tVxv4ceNqFfW1JXOwIVcpLA/",
    misterCrimson: "https://www.youtube.com/watch?v=ILh6LB4yxac",
    discords: ["https://discord.gg/hBdR5FcZRk"],
    techs: {
      guides: [
        {
          title: "Jinrai Guide",
          url: "https://www.youtube.com/watch?v=ZSNYr1zswAg",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=oxm9l9_TP_s" },
        {
          title: "Trade Combos",
          url: "https://www.youtube.com/watch?v=3Ijtwzy0n_4",
        },
      ],
      pressure: [
        {
          title: "Knockdown Pressure",
          url: "https://www.youtube.com/watch?v=0416ZNuOLcY",
        },
      ],
      setups: [
        {
          title: "Safejumps",
          url: "https://www.youtube.com/watch?v=VYA-6-xU_tI",
        },
      ],
    },
  },

  deejay: {
    supercombo: SC + "Dee_Jay",
    ufd: UFD + "deejay",
    playlist: YT + "PLvZ5t8JLwU9KffcH76iRHp8xkk_td2P3f",
    misterCrimson: "https://www.youtube.com/watch?v=nUp9nzDpT-I",
    discords: ["https://discord.gg/NQJemFC2GZ"],
    techs: {
      guides: [
        { title: "Intro", url: "https://www.youtube.com/watch?v=u2S0jwToQtk" },
        {
          title: "Space Traps",
          url: "https://www.youtube.com/watch?v=M0r8RbjVyFU",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=X0pscP1dB7s" },
        {
          title: "Stun Combo",
          url: "https://www.youtube.com/watch?v=V9cPCsyYPy8",
        },
        {
          title: "Wallsplat Combo",
          url: "https://www.youtube.com/watch?v=BTsbG5ANyXY",
        },
        {
          title: "Drive Impact Reset",
          url: "https://www.youtube.com/watch?v=WXOUN0osZ3c&t=137s",
        },
      ],
      pressure: [
        {
          title: "Pressure & Offense",
          url: "https://www.youtube.com/watch?v=UwEGY-66r1k",
        },
        {
          title: "Blockstrings",
          url: "https://www.youtube.com/watch?v=beUyhhomZHg",
        },
        {
          title: "Burnout Pressure",
          url: "https://www.youtube.com/watch?v=6TeTcVwtWGk",
        },
      ],
      setups: [
        { title: "Oki", url: "https://www.youtube.com/watch?v=WXOUN0osZ3c" },
        {
          title: "Safe Jumps",
          url: "https://www.youtube.com/watch?v=Vo6ELGvcteg",
        },
        {
          title: "Sideswitch",
          url: "https://www.youtube.com/watch?v=FkSH2k-u0Ok",
        },
      ],
    },
    players: [
      { name: "Fuudo", liquipedia: LP + "Fuudo" },
      { name: "Xian", liquipedia: LP + "Xian" },
    ],
  },

  lily: {
    supercombo: SC + "Lily",
    ufd: UFD + "lily",
    playlist: YT + "PLvZ5t8JLwU9IQ3zbd9gmT73x4AfYi9P6p",
    discords: ["https://discord.gg/WVNYspuBFQ"],
    techs: {
      guides: [
        { title: "Guide", url: "https://www.youtube.com/watch?v=e4_Ye9OXF_k" },
        {
          title: "Pressure Guide",
          url: "https://www.youtube.com/watch?v=lyTyJygOStc",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=xDHzCrtbM48" },
        {
          title: "Stun Combo",
          url: "https://www.youtube.com/watch?v=KBgAm72tHsY",
        },
      ],
      pressure: [
        {
          title: "Burnout Pressure",
          url: "https://www.youtube.com/watch?v=zVvPNek15XI",
        },
      ],
      setups: [
        {
          title: "Sideswitch",
          url: "https://www.youtube.com/watch?v=1CaeEBDr5DM",
        },
        {
          title: "Safe Jumps",
          url: "https://www.youtube.com/watch?v=UM9vYcslEcA",
        },
      ],
      techs: [
        { title: "Techs", url: "https://www.youtube.com/watch?v=LIRWYoQzDdc" },
        {
          title: "Wind Stocks",
          url: "https://www.youtube.com/watch?v=cFXq8snKZiI",
        },
      ],
    },
    players: [
      { name: "KojiKOG", liquipedia: LP + "KojiKOG" },
      { name: "Hibiki", liquipedia: LP + "Hibiki" },
    ],
  },

  aki: {
    supercombo: SC + "A.K.I.",
    ufd: UFD + "aki",
    playlist: YT + "PLvZ5t8JLwU9Ly7fIlPDOobExANmvKjr4c",
    raidhyn:
      "https://docs.google.com/spreadsheets/d/1wlBIf_qOsch7nzh26tYGDSEGWp2m2L0XqJAhWxTSEW0/",
    discords: ["https://discord.gg/a-k-i-1135649494462124065"],
    techs: {
      guides: [
        {
          title: "Full Guide",
          url: "https://www.youtube.com/watch?v=2kBkizvG7eM",
        },
        {
          title: "Normals",
          url: "https://www.youtube.com/watch?v=2kBkizvG7eM&t=671s",
        },
        {
          title: "Specials",
          url: "https://www.youtube.com/watch?v=2kBkizvG7eM&t=2133s",
        },
      ],
      combos: [
        {
          title: "Anti Air Combos",
          url: "https://www.youtube.com/watch?v=2kBkizvG7eM&t=5100s",
        },
        {
          title: "Stun Combos",
          url: "https://www.youtube.com/watch?v=2kBkizvG7eM&t=5251s",
        },
      ],
      pressure: [
        {
          title: "Burnout Pressure",
          url: "https://www.youtube.com/watch?v=2kBkizvG7eM&t=6496s",
        },
      ],
      setups: [
        {
          title: "Oki",
          url: "https://www.youtube.com/watch?v=2kBkizvG7eM&t=5600s",
        },
        {
          title: "Command Grab Setup",
          url: "https://www.youtube.com/watch?v=1TjpUNM4vGM&t=114s",
        },
        {
          title: "Reset",
          url: "https://www.youtube.com/watch?v=1TjpUNM4vGM&t=186s",
        },
        { title: "Mixups", url: "https://www.youtube.com/watch?v=mqlY63Qq4lI" },
        {
          title: "Safejumps",
          url: "https://www.youtube.com/watch?v=1TjpUNM4vGM",
        },
      ],
      techs: [
        {
          title: "Poison",
          url: "https://www.youtube.com/watch?v=2kBkizvG7eM&t=497s",
        },
      ],
    },
    players: [
      { name: "Broski", liquipedia: LP + "Broski" },
      { name: "Hope", liquipedia: LP + "Hope" },
      { name: "Hikaru", liquipedia: LP + "Hikaru" },
    ],
  },

  rashid: {
    supercombo: SC + "Rashid",
    ufd: UFD + "rashid",
    playlist: YT + "PLvZ5t8JLwU9Jlu2BBhSkTAqj2SiIMGKdv",
    discords: ["https://discord.gg/ZUSRzdJeDj"],
    techs: {
      guides: [
        { title: "Basics", url: "https://www.youtube.com/watch?v=P1LF2x_Sdqs" },
        {
          title: "SA2 Guide",
          url: "https://www.youtube.com/watch?v=phybdiHvjjo",
        },
        {
          title: "SA2 Guide pt.2",
          url: "https://www.youtube.com/watch?v=-SY682RwxT4",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=-p3ajb0VlQY" },
        {
          title: "5HK Punish Counter Combos",
          url: "https://www.youtube.com/watch?v=HNuVla1TId8",
        },
        {
          title: "Drive Impact Combos",
          url: "https://www.youtube.com/watch?v=rNnuiLlRtAM",
        },
      ],
      pressure: [
        {
          title: "Corner Carry Burnout",
          url: "https://www.youtube.com/watch?v=tqk-NiU33_8",
        },
      ],
      setups: [
        {
          title: "Light Eagle Oki",
          url: "https://www.youtube.com/watch?v=p00HtRA-Xc8",
        },
        {
          title: "Medium Eagle Oki",
          url: "https://www.youtube.com/watch?v=OIPIa0D9Hoc",
        },
        {
          title: "Meaty Overhead",
          url: "https://www.youtube.com/watch?v=j5yQ-8AW6os",
        },
        {
          title: "Meaty cr.MP",
          url: "https://www.youtube.com/watch?v=sOsoSswC54M",
        },
        {
          title: "Midscreen Oki",
          url: "https://www.youtube.com/watch?v=V9vATykIkaY",
        },
        {
          title: "Drive Impact Setups",
          url: "https://www.youtube.com/watch?v=jr6859If9hk",
        },
        {
          title: "Front Flip Oki Setups",
          url: "https://www.youtube.com/watch?v=UD9cWsgcZNs",
        },
        {
          title: "Float Oki Setups",
          url: "https://www.youtube.com/watch?v=WBW9MduLTw8",
        },
        { title: "Setups", url: "https://www.youtube.com/watch?v=URp2SeFQoEM" },
      ],
    },
    players: [
      { name: "Big Bird", liquipedia: LP + "Big_Bird" },
      { name: "Dual Kevin", liquipedia: LP + "Dual_Kevin" },
      { name: "Gachikun", liquipedia: LP + "Gachikun" },
      { name: "Oil King", liquipedia: LP + "Oil_King" },
    ],
  },

  blanka: {
    supercombo: SC + "Blanka",
    ufd: UFD + "blanka",
    playlist: YT + "PLvZ5t8JLwU9K3c9C5TUGFT4w1TKpgXfm9",
    discords: ["https://discord.gg/XzHkn6N"],
    techs: {
      guides: [
        {
          title: "Neutral",
          url: "https://www.youtube.com/watch?v=VVU4X9BQVuo",
        },
        {
          title: "SA2 Guide",
          url: "https://www.youtube.com/watch?v=NPwktmDn3k8",
        },
        {
          title: "Advanced SA2 Guide",
          url: "https://www.youtube.com/watch?v=DZDgSRQCIqU",
        },
        {
          title: "Matchup Tips",
          url: "https://www.youtube.com/watch?v=CKUnN2DgwOQ",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=W88U25NrNVg" },
        {
          title: "OD Combos",
          url: "https://www.youtube.com/watch?v=pY_zhvX4EgY",
        },
        {
          title: "Drive Impact Combos",
          url: "https://www.youtube.com/watch?v=a_bIf8RLEE0",
        },
      ],
      pressure: [
        {
          title: "Drive Rush Pressure",
          url: "https://www.youtube.com/watch?v=dS_Bj3rfxzI",
        },
        {
          title: "Drive Chip Sequences",
          url: "https://www.youtube.com/watch?v=AB9NNnB9BNg",
        },
      ],
      setups: [
        { title: "Oki", url: "https://www.youtube.com/watch?v=hANJQGOeX6Q" },
        {
          title: "Blanka-Chan Setups",
          url: "https://www.youtube.com/watch?v=e3X2FaDryNk",
        },
        {
          title: "Safejumps",
          url: "https://www.youtube.com/watch?v=9FMiyg5cC1w",
        },
      ],
      techs: [
        {
          title: "Hop Tips",
          url: "https://www.youtube.com/watch?v=KYtoZneElCU",
        },
      ],
    },
    players: [
      { name: "MenaRD", liquipedia: LP + "MenaRD" },
      { name: "Kingsvega", liquipedia: LP + "Kingsvega" },
    ],
  },

  juri: {
    supercombo: SC + "Juri",
    ufd: UFD + "juri",
    playlist: YT + "PLvZ5t8JLwU9JTBBhI0EMZ8GqLQ9c3UnaC",
    raidhyn:
      "https://docs.google.com/spreadsheets/d/1RXr0jfyrgh8bpQ0uRoUwm2MxWhFEBKclKEda0O8Z8bo/",
    discords: ["https://discord.gg/8Xs5ddd"],
    techs: {
      guides: [
        { title: "Intro", url: "https://www.youtube.com/watch?v=NqPBY-dcj0o" },
        {
          title: "SA2 Guide",
          url: "https://www.youtube.com/watch?v=Ywx_7X_M0Xg",
        },
        {
          title: "Space Traps",
          url: "https://www.youtube.com/watch?v=RKBL-KkuS04",
        },
        {
          title: "Anti Juri",
          url: "https://www.youtube.com/watch?v=ke60KQg5mO8",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=-pZzuxgbi2c" },
        {
          title: "Drive Impact Combos",
          url: "https://www.youtube.com/watch?v=74nG2U9VTqo",
        },
        {
          title: "Max Damage Combos",
          url: "https://www.youtube.com/watch?v=BsP4MyE7wMI",
        },
      ],
      pressure: [
        {
          title: "Frame Traps",
          url: "https://www.youtube.com/watch?v=2CWWcG0zbr4",
        },
        {
          title: "Pressure",
          url: "https://www.youtube.com/watch?v=Z-ehQUzFhoE",
        },
      ],
      setups: [
        { title: "Oki", url: "https://www.youtube.com/watch?v=c1bxXMyC2P0" },
        {
          title: "Resets",
          url: "https://www.youtube.com/watch?v=c1bxXMyC2P0&t=242s",
        },
        {
          title: "Safe Jumps",
          url: "https://www.youtube.com/watch?v=c1bxXMyC2P0&t=132s",
        },
      ],
    },
    players: [
      { name: "Nephew", liquipedia: LP + "Nephew" },
      { name: "Kilzyou", liquipedia: LP + "Kilzyou" },
      { name: "Mago", liquipedia: LP + "Mago" },
      { name: "JAK", liquipedia: LP + "Justakid" },
    ],
  },

  marisa: {
    supercombo: SC + "Marisa",
    ufd: UFD + "marisa",
    playlist: YT + "PLvZ5t8JLwU9IJBQHLmW30RBGgCkATRCmD",
    misterCrimson: "https://www.youtube.com/watch?v=1A-8EsEw4CE",
    discords: ["https://discord.gg/uQScVkRmX5"],
    techs: {
      guides: [
        { title: "Intro", url: "https://www.youtube.com/watch?v=ZPgi4fo9MJ0" },
        {
          title: "Neutral",
          url: "https://www.youtube.com/watch?v=SIn9Q1frG0g",
        },
        {
          title: "Gladius Guide",
          url: "https://www.youtube.com/watch?v=9lQ6JH_bEH8&t=1690s",
        },
        {
          title: "Advanced Guide",
          url: "https://www.youtube.com/watch?v=JUUIsc9X1RE",
        },
        {
          title: "Anti Marisa",
          url: "https://www.youtube.com/watch?v=579V4VbAcdQ",
        },
      ],
      combos: [
        {
          title: "DP Punish",
          url: "https://www.youtube.com/watch?v=XDGDMxKnW7I",
        },
        {
          title: "DI Combo",
          url: "https://www.youtube.com/watch?v=va8UNNfQXCg",
        },
        {
          title: "DI Combo & Option Select",
          url: "https://www.youtube.com/watch?v=tNtw-zqdooY",
        },
      ],
      pressure: [
        {
          title: "Burnout Pressure",
          url: "https://www.youtube.com/watch?v=TFbARdo-Bm8",
        },
      ],
      setups: [
        { title: "Oki", url: "https://www.youtube.com/watch?v=bqx1dJQCxoI" },
        {
          title: "Enfold Oki",
          url: "https://www.youtube.com/watch?v=xRjwBHPsPMc",
        },
        {
          title: "Command Grab Oki",
          url: "https://www.youtube.com/watch?v=zRU3UBiq42E",
        },
        {
          title: "Reset Setups",
          url: "https://www.youtube.com/watch?v=qNxRdVsD9ow",
        },
      ],
    },
    players: [
      { name: "Itabashi Zangief", liquipedia: LP + "Itabashi_Zangief" },
      { name: "Infexious", liquipedia: LP + "Infexious" },
    ],
  },

  guile: {
    supercombo: SC + "Guile",
    ufd: UFD + "guile",
    playlist: YT + "PLvZ5t8JLwU9LbBqvY5gLGQkh0R47e_EZL",
    discords: ["https://discord.com/invite/B7Q6gGsRjp"],
    techs: {
      guides: [
        { title: "Intro", url: "https://www.youtube.com/watch?v=cxlo_vwedkQ" },
        {
          title: "Intro pt.2",
          url: "https://www.youtube.com/watch?v=2VQLcBYuwmk",
        },
        {
          title: "Sonic Boom Basics",
          url: "https://www.youtube.com/watch?v=zdA3ipDuk9I",
        },
        {
          title: "Sonic Blade Basics",
          url: "https://www.youtube.com/watch?v=wz5ttIEzbeo",
        },
        { title: "Zoning", url: "https://www.youtube.com/watch?v=Sye7I2pXQKs" },
        {
          title: "Space Traps",
          url: "https://www.youtube.com/watch?v=AAF3j7Kuxi4",
        },
        {
          title: "Boom Loops Guide",
          url: "https://www.youtube.com/watch?v=wEGTkjRBhE0",
        },
        {
          title: "Anti Guile",
          url: "https://www.youtube.com/watch?v=4UQfKQ_u538",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=YgnBP41hMPY" },
        {
          title: "SA2 Combos",
          url: "https://www.youtube.com/watch?v=g4B4Ydeubtw",
        },
        {
          title: "Drive Impact Combos",
          url: "https://www.youtube.com/watch?v=LvNKUivt7zg&t=120s",
        },
        {
          title: "Stun Combo",
          url: "https://www.youtube.com/watch?v=kyDcG2C-W9s",
        },
      ],
      pressure: [
        {
          title: "Frame Traps",
          url: "https://www.youtube.com/watch?v=Dgh8mGvE5-A",
        },
      ],
      setups: [
        { title: "Oki", url: "https://www.youtube.com/watch?v=Gi0dHykM784" },
        {
          title: "Meaty Sonic Blade",
          url: "https://www.youtube.com/watch?v=GQV8zKzmnMM&t=180s",
        },
        {
          title: "Overhead Setups",
          url: "https://www.youtube.com/watch?v=rD8YdhXTATI",
        },
        {
          title: "Safejumps",
          url: "https://www.youtube.com/watch?v=O76Eil5GCBs&t=88s",
        },
        {
          title: "Reset",
          url: "https://www.youtube.com/watch?v=O76Eil5GCBs&t=122s",
        },
      ],
      techs: [
        {
          title: "Drive Rush st.LK",
          url: "https://www.youtube.com/watch?v=OCHgcC__kGM",
        },
      ],
    },
    players: [
      { name: "Akainu", liquipedia: LP + "Akainu" },
      { name: "Nuckledu", liquipedia: LP + "Nuckledu" },
      { name: "Rainpro", liquipedia: LP + "Rainpro" },
    ],
  },

  ed: {
    supercombo: SC + "Ed",
    ufd: UFD + "ed",
    playlist: YT + "PLvZ5t8JLwU9JjDmQqmCqPoh_AeKdJhGoS",
    discords: ["https://discord.com/invite/JEqx5R5"],
    techs: {
      guides: [
        {
          title: "Neutral Guide",
          url: "https://www.youtube.com/watch?v=TLG_dgMSQ4A",
        },
        {
          title: "Flicker Guide",
          url: "https://www.youtube.com/watch?v=xvLMyYy5NaU",
        },
        {
          title: "Anti Zoning Guide",
          url: "https://www.youtube.com/watch?v=XPFrZu0YcqA",
        },
        {
          title: "Matchup Tips",
          url: "https://www.youtube.com/watch?v=nKIbtPyukAE",
        },
      ],
      combos: [
        {
          title: "Advanced Combos",
          url: "https://www.youtube.com/watch?v=m5SAx0VAaZQ",
        },
        {
          title: "Dream Combo",
          url: "https://www.youtube.com/watch?v=P5O8KRE2gWg",
        },
        {
          title: "Shin Dream Combo",
          url: "https://www.youtube.com/watch?v=7kvVB-L4yO4",
        },
      ],
      pressure: [
        {
          title: "Knockdown Pressure",
          url: "https://www.youtube.com/watch?v=J1YH2zogEv8",
        },
      ],
      setups: [
        {
          title: "Sideswitch",
          url: "https://www.youtube.com/watch?v=y3qr3ntQFkU",
        },
        {
          title: "Safejumps",
          url: "https://www.youtube.com/watch?v=GePz3Lg6mmc",
        },
      ],
    },
    players: [
      { name: "EndingWalker", liquipedia: LP + "EndingWalker" },
      { name: "Fuudo", liquipedia: LP + "Fuudo" },
      { name: "Momochi", liquipedia: LP + "Momochi" },
      { name: "Leshar", liquipedia: LP + "Leshar" },
      { name: "Sahara", liquipedia: LP + "Sahara" },
    ],
  },

  honda: {
    supercombo: SC + "E._Honda",
    ufd: UFD + "honda",
    playlist: YT + "PLvZ5t8JLwU9KGCkdsMBP_pa55t6aZ0NLO",
    raidhyn:
      "https://docs.google.com/spreadsheets/d/1ivgTExaMITZCsJZpCWRvEcbbcAkZimKuQQNJ1A6R5r4/",
    discords: ["https://discord.com/invite/a8WFtaR"],
    techs: {
      guides: [
        { title: "Intro", url: "https://www.youtube.com/watch?v=ZI5sAd5RyOw" },
        {
          title: "Anti Honda",
          url: "https://www.youtube.com/watch?v=Ng_rt5kNfW4",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=-lRaQevWaaw" },
      ],
      pressure: [
        {
          title: "Burnout Pressure",
          url: "https://www.youtube.com/watch?v=Cw5D1hel1Gs",
        },
      ],
      setups: [
        { title: "Oki", url: "https://www.youtube.com/watch?v=xDkaX6tv1Jc" },
        {
          title: "Side Switch",
          url: "https://www.youtube.com/watch?v=ndlUNJj6gMI&t=54s",
        },
        {
          title: "Safejumps",
          url: "https://www.youtube.com/watch?v=ndlUNJj6gMI&t=28s",
        },
        {
          title: "Command Grab Setups",
          url: "https://www.youtube.com/watch?v=ndlUNJj6gMI&t=66s",
        },
      ],
    },
  },

  jamie: {
    supercombo: SC + "Jamie",
    ufd: UFD + "jamie",
    playlist: YT + "PLvZ5t8JLwU9IiMB69_00baG5RyPyPn2WT",
    misterCrimson: "https://www.youtube.com/watch?v=xDNgX9Sns_U",
    discords: ["https://discord.gg/knCKnhw5px"],
    techs: {
      guides: [
        {
          title: "Full Guide",
          url: "https://www.youtube.com/watch?v=rMQWYKAWM8E",
        },
      ],
      combos: [
        {
          title: "Level 3 Combos",
          url: "https://www.youtube.com/watch?v=fNwyfVvwpzg",
        },
      ],
      pressure: [
        {
          title: "Blockstrings (Deprecated)",
          url: "https://www.youtube.com/watch?v=lgwX7h_2JMc",
        },
        {
          title: "Burnout Pressure",
          url: "https://www.youtube.com/watch?v=i4yG4l5PHGM",
        },
      ],
      setups: [
        {
          title: "Side Switch",
          url: "https://www.youtube.com/watch?v=24WPV4pRQlI",
        },
        {
          title: "Meaties",
          url: "https://www.youtube.com/watch?v=oWgNxf9U_Q4",
        },
        {
          title: "Safe Jumps",
          url: "https://www.youtube.com/watch?v=_V6P3X301zc",
        },
        {
          title: "Command Grab",
          url: "https://www.youtube.com/watch?v=qF_-cb6ivL4",
        },
      ],
      techs: [
        {
          title: "DI Resets & Spacing Traps",
          url: "https://www.youtube.com/watch?v=0NISyeWUxMI",
        },
      ],
    },
    players: [{ name: "Naruo", liquipedia: LP + "Naruo" }],
  },

  gouki: {
    supercombo: SC + "Akuma",
    ufd: UFD + "akuma",
    playlist: YT + "PLvZ5t8JLwU9I2rratnrITg5QYh4msNl8y",
    raidhyn:
      "https://docs.google.com/spreadsheets/d/1qybgNuH_tPb1PmLISqKAl_Mfpo6AFq-g_RuUqRgi5lI/",
    discords: ["https://discord.com/invite/cVXAwnN"],
    techs: {
      guides: [
        { title: "Intro", url: "https://www.youtube.com/watch?v=9dCixpnTrDI" },
        {
          title: "Adamant Flame Guide",
          url: "https://www.youtube.com/watch?v=7BhQoig8Z_I",
        },
        {
          title: "Demon Flip Guide",
          url: "https://www.youtube.com/watch?v=G3jsRMRp06E",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=kwLbZ_iyzxA" },
        {
          title: "Near Corner Combos",
          url: "https://www.youtube.com/watch?v=tQHZQ0okzkM",
        },
        {
          title: "Anti Air Combos",
          url: "https://www.youtube.com/watch?v=s_y0rXm0Jg0",
        },
      ],
      pressure: [
        {
          title: "Burnout Pressure",
          url: "https://www.youtube.com/watch?v=x5W5tbuNndc",
        },
      ],
      setups: [
        { title: "Oki", url: "https://www.youtube.com/watch?v=n0FB-ASB1NU" },
        {
          title: "Raging Demon Setups",
          url: "https://www.youtube.com/watch?v=2zevTthzqh4",
        },
      ],
    },
    players: [
      { name: "Daigo Umehara", liquipedia: LP + "Daigo_Umehara" },
      { name: "AngryBird", liquipedia: LP + "AngryBird" },
      { name: "Kawano", liquipedia: LP + "Kawano" },
      { name: "Shuto", liquipedia: LP + "Shuto" },
      { name: "Jojotaro", liquipedia: LP + "Jojotaro" },
    ],
  },

  vega: {
    supercombo: SC + "M._Bison",
    ufd: UFD + "mbison",
    playlist: YT + "PLvZ5t8JLwU9J-xymYoQkZ8tRiMOIwZc_Q",
    raidhyn:
      "https://docs.google.com/spreadsheets/d/1uXGk3gUCIds98BRc8A4UeiWj-W3e-q0XsIeV4s6xPtw/",
    misterCrimson: "https://www.youtube.com/watch?v=hhtokonGPMQ",
    discords: ["https://discord.gg/w82tSmAzY4"],
    techs: {
      guides: [
        { title: "Intro", url: "https://www.youtube.com/watch?v=BaG_b4VGUR0" },
        {
          title: "Beginner Guide",
          url: "https://www.youtube.com/watch?v=tyCT7XF1VBo",
        },
        {
          title: "Full Guide",
          url: "https://www.youtube.com/watch?v=6wc9rJcGq2c",
        },
        {
          title: "Advanced Strategy",
          url: "https://www.youtube.com/watch?v=cgEv-DY8fOU",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=zNoEkB5Ql9I" },
        {
          title: "Anti Air Combos",
          url: "https://www.youtube.com/watch?v=YauW_NrFwvk",
        },
        {
          title: "Drive Impact Combos",
          url: "https://www.youtube.com/watch?v=zNoEkB5Ql9I&t=647s",
        },
      ],
      pressure: [
        {
          title: "Burnout Pressure",
          url: "https://www.youtube.com/watch?v=Tw3HH-8vIkk",
        },
        {
          title: "Drive Pressure Blockstrings",
          url: "https://www.youtube.com/watch?v=UjdgWKLsQtQ",
        },
      ],
      setups: [
        {
          title: "Sideswitch",
          url: "https://www.youtube.com/watch?v=FhbKdJ_G5N8",
        },
      ],
    },
    players: [
      { name: "Hotdog29", liquipedia: LP + "HotDog29" },
      { name: "Xiaohai", liquipedia: LP + "Xiaohai" },
      { name: "Nemo", liquipedia: LP + "Nemo" },
      { name: "Vxbao", liquipedia: LP + "Vxbao" },
      { name: "DCQ", liquipedia: LP + "DingChunQiu" },
      { name: "Zhen", liquipedia: LP + "Rou" },
    ],
  },

  terry: {
    supercombo: SC + "Terry",
    ufd: UFD + "terry",
    playlist: YT + "PLvZ5t8JLwU9J6edj8FFcp5Oh11TRENEfi",
    raidhyn:
      "https://docs.google.com/spreadsheets/d/1vIbP2sGXyX7VG1aghP25MSSPYITigwPlzvqWBq_AonM/",
    discords: ["https://discord.gg/BcACwFFQxE"],
    techs: {
      guides: [
        { title: "Intro", url: "https://www.youtube.com/watch?v=SIs8A5SaH90" },
        {
          title: "Space Traps",
          url: "https://www.youtube.com/watch?v=INmYCRescoI",
        },
        {
          title: "Anti Terry",
          url: "https://www.youtube.com/watch?v=4cG9ygRGzUg",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=33f_hbjcsoo" },
        {
          title: "All-In Combo",
          url: "https://www.youtube.com/watch?v=IKOHchEIYJ4",
        },
      ],
      pressure: [
        {
          title: "Burnout Pressure",
          url: "https://www.youtube.com/watch?v=Kvf3JDhlX8U",
        },
      ],
      setups: [
        {
          title: "Oki & Frame Traps",
          url: "https://www.youtube.com/watch?v=N0vm6S9RqHs",
        },
        {
          title: "Meaty Overhead",
          url: "https://www.youtube.com/watch?v=uMIFNIZKvGA&t=276s",
        },
        {
          title: "Sideswitch",
          url: "https://www.youtube.com/watch?v=zSC_zPOWyyY&t=212s",
        },
        {
          title: "Safe Jumps",
          url: "https://www.youtube.com/watch?v=zSC_zPOWyyY&t=166s",
        },
        {
          title: "Resets",
          url: "https://www.youtube.com/watch?v=zSC_zPOWyyY&t=221s",
        },
      ],
    },
    players: [
      { name: "Riddles", liquipedia: LP + "Riddles" },
      { name: "Oil King", liquipedia: LP + "Oil_King" },
      { name: "Kincho", liquipedia: LP + "Kintyo" },
    ],
  },

  mai: {
    supercombo: SC + "Mai",
    ufd: UFD + "mai",
    playlist: YT + "PLvZ5t8JLwU9IxvmyomQImOG_kYY7dsFQX",
    misterCrimson: "https://www.youtube.com/watch?v=I2bxwtBXey4",
    discords: ["https://discord.gg/kcMxnp9Gbd"],
    techs: {
      guides: [
        { title: "Intro", url: "https://www.youtube.com/watch?v=H4m0P2YBAjM" },
        {
          title: "Anti Mai",
          url: "https://www.youtube.com/watch?v=jaANNBXZVmA",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=F5LDjZpvvZg" },
        {
          title: "Fire Fan Conversions",
          url: "https://www.youtube.com/watch?v=KhUNl7yTp84",
        },
        {
          title: "Drive Impact Wallsplat",
          url: "https://www.youtube.com/watch?v=kQiKv7rZ9H0",
        },
        {
          title: "Stun Combos (No Stocks)",
          url: "https://www.youtube.com/watch?v=p6sCzue8U-c",
        },
        {
          title: "Stun Combos (With Stocks)",
          url: "https://www.youtube.com/watch?v=SVP-nHrKix4",
        },
      ],
      pressure: [
        {
          title: "Corner Pressure",
          url: "https://www.youtube.com/watch?v=9cG8vF5CD5M",
        },
        {
          title: "True Blockstring",
          url: "https://www.youtube.com/watch?v=OlO8Xhnm-uM",
        },
        {
          title: "Fan Pressure",
          url: "https://www.youtube.com/watch?v=HZBFw5GVchw",
        },
        {
          title: "Burnout Pressure",
          url: "https://www.youtube.com/watch?v=Q-79y_Y38dc",
        },
      ],
      setups: [
        {
          title: "Oki & Setups",
          url: "https://www.youtube.com/watch?v=2nqeLIbdOPg",
        },
        {
          title: "OD Fire Fan Meaty",
          url: "https://www.youtube.com/watch?v=FIFFSyAN-RU",
        },
        {
          title: "Resets",
          url: "https://www.youtube.com/watch?v=yCwC6j1I0zg&t=366s",
        },
        {
          title: "Safejumps",
          url: "https://www.youtube.com/watch?v=yCwC6j1I0zg&t=295s",
        },
        {
          title: "Sideswitch",
          url: "https://www.youtube.com/watch?v=yCwC6j1I0zg&t=350s",
        },
      ],
      techs: [
        {
          title: "Air to Air",
          url: "https://www.youtube.com/watch?v=Y4uxFIPN6Zc",
        },
        {
          title: "Extra Techs",
          url: "https://www.youtube.com/watch?v=ogcc7QXOkMI",
        },
      ],
    },
    playersNote:
      "She's so broken that literally everyone plays her. Here are some:",
    players: [
      { name: "Xiaohai", liquipedia: LP + "Xiaohai" },
      { name: "Kilzyou", liquipedia: LP + "Kilzyou" },
      { name: "Yamaguchi", liquipedia: LP + "Yamaguchi" },
      { name: "Ryukichi", liquipedia: LP + "Ryukichi" },
    ],
  },

  elena: {
    supercombo: SC + "Elena",
    ufd: UFD + "elena",
    playlist: YT + "PLvZ5t8JLwU9LJzzudsJmsQDu53jqhGtZU",
    discords: ["https://discord.gg/7Cpyjsw8Zp"],
    techs: {
      guides: [
        { title: "Guide", url: "https://www.youtube.com/watch?v=KyXSs_foNl0" },
        {
          title: "Strategy",
          url: "https://www.youtube.com/watch?v=mydkwtqAXoc",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=ciCL0ZYY9aQ" },
        {
          title: "DI Wallsplat Combos",
          url: "https://www.youtube.com/watch?v=sSulkWxCToI&t=342s",
        },
      ],
      setups: [
        { title: "Oki", url: "https://www.youtube.com/watch?v=V0FL4F70d98" },
        {
          title: "Meaties",
          url: "https://www.youtube.com/watch?v=qDFvAkSlcag",
        },
        {
          title: "Safejumps",
          url: "https://www.youtube.com/watch?v=qDFvAkSlcag&t=248s",
        },
        {
          title: "Sideswitches",
          url: "https://www.youtube.com/watch?v=qDFvAkSlcag&t=315s",
        },
      ],
    },
    players: [
      { name: "Sako", liquipedia: LP + "Sako" },
      { name: "Dogura", liquipedia: LP + "Dogura" },
    ],
  },

  sagat: {
    supercombo: SC + "Sagat",
    ufd: UFD + "sagat",
    playlist: YT + "PLvZ5t8JLwU9K6ns4oo6HGRXvNJRHrqlSl",
    misterCrimson: "https://www.youtube.com/watch?v=LjQAoBvjguE",
    discords: ["https://discord.com/invite/gaBG2Xs"],
    techs: {
      guides: [
        {
          title: "Pugera's Gameplan",
          url: "https://www.youtube.com/watch?v=rmnVOCMPc4w",
        },
        { title: "Guide", url: "https://www.youtube.com/watch?v=mHv_GP6q1EE" },
        {
          title: "Fireball Spacing",
          url: "https://www.youtube.com/watch?v=JieDhAPsuYk",
        },
        {
          title: "Fireball Traps",
          url: "https://www.youtube.com/watch?v=mHv_GP6q1EE&t=2673s",
        },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=noV7sGjDmM4" },
        {
          title: "Punish Counter Combos",
          url: "https://www.youtube.com/watch?v=kvOLF91z4qs",
        },
        {
          title: "Drive Impact Combos",
          url: "https://www.youtube.com/watch?v=_V6LL4VrBS8",
        },
        {
          title: "Anti Air Combos",
          url: "https://www.youtube.com/watch?v=EeGp_78Rad4",
        },
        {
          title: "Corner-to-Corner Combo",
          url: "https://www.youtube.com/watch?v=Rs4S3OLp1gQ&t=286s",
        },
      ],
      pressure: [
        {
          title: "Chip Damage Blockstring",
          url: "https://www.youtube.com/watch?v=Dpqwe6wOTqU",
        },
      ],
      setups: [
        { title: "Oki", url: "https://www.youtube.com/watch?v=cfTAgI7LX1Q" },
        {
          title: "Meaty Fireball",
          url: "https://www.youtube.com/watch?v=tNQOhR5bUh4",
        },
        {
          title: "Safejumps",
          url: "https://www.youtube.com/watch?v=cfTAgI7LX1Q&t=681s",
        },
        {
          title: "Sideswitch",
          url: "https://www.youtube.com/watch?v=Rs4S3OLp1gQ&t=271s",
        },
        {
          title: "Drive Impact Setups",
          url: "https://www.youtube.com/watch?v=Rs4S3OLp1gQ&t=298s",
        },
      ],
    },
    players: [
      { name: "Bonchan", liquipedia: LP + "Bonchan" },
      { name: "Pugera", liquipedia: LP + "Pugera" },
      { name: "Hinao", liquipedia: LP + "Hinao" },
      { name: "Blaz", liquipedia: LP + "Blaz" },
    ],
  },

  cviper: {
    supercombo: SC + "C._Viper",
    ufd: UFD + "cviper",
    playlist: YT + "PLvZ5t8JLwU9J8zKD-sSQcE-Ek6uHSxQqB",
    discords: ["https://discord.gg/DyNj2CTJZj"],
    techs: {
      guides: [
        {
          title: "Execution Guide",
          url: "https://www.youtube.com/watch?v=zQtrI6r0qyA",
        },
        { title: "Guide", url: "https://www.youtube.com/watch?v=QnM17vm3S0Y" },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=sD6SaqB9h-M" },
        {
          title: "Stun Combo",
          url: "https://www.youtube.com/watch?v=2KmXNMWP3yg",
        },
        {
          title: "Max Damage",
          url: "https://www.youtube.com/watch?v=dD_rrm1idj8",
        },
        {
          title: "Feint Knuckle Punishes",
          url: "https://www.youtube.com/watch?v=d5VMKQ4sOWM",
        },
        {
          title: "Advanced Combos",
          url: "https://www.youtube.com/watch?v=HzSxokQP8a4",
        },
      ],
      pressure: [
        {
          title: "Burnout Pressure",
          url: "https://www.youtube.com/watch?v=npmfkY90CuY",
        },
      ],
      setups: [
        { title: "Oki", url: "https://www.youtube.com/watch?v=q6XFnRI9obc" },
        {
          title: "Oki pt.2",
          url: "https://www.youtube.com/watch?v=Rz1jz8jmLWM",
        },
        {
          title: "Overhead Setup",
          url: "https://www.youtube.com/watch?v=RPoDuADvjw0",
        },
        {
          title: "Overhead Setup 2",
          url: "https://www.youtube.com/watch?v=8NRFGjsmFxA",
        },
        {
          title: "Burn Kick Setups",
          url: "https://www.youtube.com/watch?v=tFi2hdfhipQ",
        },
        {
          title: "Sideswitches",
          url: "https://www.youtube.com/watch?v=q6XFnRI9obc&t=531s",
        },
        {
          title: "Sideswitches pt.2",
          url: "https://www.youtube.com/watch?v=Rz1jz8jmLWM&t=216s",
        },
        {
          title: "Resets",
          url: "https://www.youtube.com/watch?v=q6XFnRI9obc&t=541s",
        },
        {
          title: "Safejumps",
          url: "https://www.youtube.com/watch?v=q6XFnRI9obc&t=491s",
        },
        {
          title: "Drive Impact Setups",
          url: "https://www.youtube.com/watch?v=3IChPAE-emM",
        },
      ],
    },
    players: [
      { name: "Kazunoko", liquipedia: LP + "Kazunoko" },
      { name: "Mister Crimson", liquipedia: LP + "Mister_Crimson" },
      { name: "Tachikawa", liquipedia: LP + "Tachikawa" },
    ],
  },

  alex: {
    supercombo: SC + "Alex",
    ufd: UFD + "alex",
    playlist: YT + "PLvZ5t8JLwU9L1MFxn3CXKLgAAJol_YiH9",
    discords: ["https://discord.gg/8qH4zupmEK"],
    techs: {
      guides: [
        { title: "Guide", url: "https://www.youtube.com/watch?v=L4OjcgYa7-o" },
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=KOBn4nUUVKU" },
        {
          title: "Combos & Oki",
          url: "https://www.youtube.com/watch?v=GEWPCeTQQ-A",
        },
      ],
      setups: [
        { title: "Setups", url: "https://www.youtube.com/watch?v=lVKZEkZTgXc" },
        {
          title: "Meaties",
          url: "https://www.youtube.com/watch?v=Nrp5SLzTKAw",
        },
        {
          title: "Safejumps",
          url: "https://www.youtube.com/watch?v=Nrp5SLzTKAw&t=370s",
        },
        {
          title: "Sideswitches",
          url: "https://www.youtube.com/watch?v=Nrp5SLzTKAw&t=471s",
        },
        {
          title: "Resets",
          url: "https://www.youtube.com/watch?v=Nrp5SLzTKAw&t=488s",
        },
      ],
    },
    players: [
      { name: "Hotdog29", liquipedia: LP + "HotDog29" },
      { name: "Nemo", liquipedia: LP + "Nemo" },
    ],
  },

  ingrid: {
    supercombo: SC + "Ingrid",
    ufd: UFD + "ingrid",
    playlist: YT + "PLvZ5t8JLwU9J-V_RxiT7CvqvfafKK8NKv",
    discords: [
      "https://discord.gg/jEsdJZWswT",
      "https://discord.gg/eUAjKa6VAy",
    ],
    techs: {
      guides: [
        { title: "Ingrid Guide", url: "https://www.youtube.com/watch?v=CemqJ5giO88"},
        { title: "Anti Ingrid Guide", url: "https://www.youtube.com/watch?v=6kOWXT6fol0"},
      ],
      combos: [
        { title: "Combos", url: "https://www.youtube.com/watch?v=Fb566Gy3YcU" },
        {
          title: "Combos & Setups",
          url: "https://www.youtube.com/watch?v=QmUwizYjJNc",
        },
      ],
      setups: [
        {
          title: "Safejump Shimmy setup",
          url: "https://www.youtube.com/watch?v=zx9p4cTrKh8",
        },
      ],
    },
    players: [
    ],
  },
};
