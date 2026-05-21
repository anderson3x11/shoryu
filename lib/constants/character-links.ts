const YT = 'https://www.youtube.com/playlist?list='
const SC = 'https://wiki.supercombo.gg/w/Street_Fighter_6/'
const UFD = 'https://ultimateframedata.com/sf6/'

export interface CharacterLinks {
  supercombo?: string
  ufd?: string
  playlist?: string
  raidhyn?: string
  misterCrimson?: string  // direct video — only for the 11 chars covered by his series
  discords?: string[]     // one or more character Discord invites
}

export const CHARACTER_LINKS: Record<string, CharacterLinks> = {
  ryu:      { supercombo: SC+'Ryu',      ufd: UFD+'ryu',    playlist: YT+'PLvZ5t8JLwU9IXbcuvqGhm2KvTLMBA0iNL', raidhyn: 'https://docs.google.com/spreadsheets/d/1p8qMi6Yagtk_7Zzh6_P0IKl2e5TnY5a-7vaBQLK3QMo/', discords: ['https://discord.gg/jxy55GtZ5d'] },
  luke:     { supercombo: SC+'Luke',     ufd: UFD+'luke',   playlist: YT+'PLvZ5t8JLwU9I7Orfcz6s3OjEdyexIGahH', discords: ['https://discord.gg/Xqn2wWamJ4'] },
  kimberly: { supercombo: SC+'Kimberly', ufd: UFD+'kimberly', playlist: YT+'PLvZ5t8JLwU9K1p3AQg1ZZJyXt9kh8EHkQ', raidhyn: 'https://docs.google.com/spreadsheets/d/1XCmbMGhXqwUiy_CiJENMNDHVf6a8VdYHQrUANPm0Za4/', misterCrimson: 'https://www.youtube.com/watch?v=mwAHhyxXusg', discords: ['https://discord.gg/zW7euU62Fu'] },
  chunli:   { supercombo: SC+'Chun-Li',  ufd: UFD+'chunli', playlist: YT+'PLvZ5t8JLwU9KkaAhDfFZMpdHMbPtQPWcP', raidhyn: 'https://docs.google.com/spreadsheets/d/1NbQIc4s080YhFJDnGDKaUzXpCrVaf42ISviSeJort8w/', discords: ['https://discord.com/invite/nDFhUjM'] },
  manon:    { supercombo: SC+'Manon',    ufd: UFD+'manon',  playlist: YT+'PLvZ5t8JLwU9KXDa9spT_GucTabWKAgPnO', discords: ['https://discord.gg/yGhCvhgzjW'] },
  zangief:  { supercombo: SC+'Zangief',  ufd: UFD+'zangief', playlist: YT+'PLvZ5t8JLwU9KpPsQ_3ZRylSI7esoYKk-x', misterCrimson: 'https://www.youtube.com/watch?v=bZJCUSKM3mE', discords: ['https://discord.gg/0pyTHFGvV3sA7QGX'] },
  jp:       { supercombo: SC+'JP',       ufd: UFD+'jp',     playlist: YT+'PLvZ5t8JLwU9LbwkD0PuYR767hU5atia62', misterCrimson: 'https://www.youtube.com/watch?v=vLlSxDwErPM', discords: ['https://discord.gg/k9yDhW2awC'] },
  dhalsim:  { supercombo: SC+'Dhalsim',  ufd: UFD+'dhalsim', playlist: YT+'PLvZ5t8JLwU9Jcr7KeG-f7nXN1pYdpBZjs', misterCrimson: 'https://www.youtube.com/watch?v=tC_hKBV6aik', discords: ['https://discord.gg/0pw1HkuKuIcoL8th', 'https://discord.gg/EUhC67mjv6'] },
  cammy:    { supercombo: SC+'Cammy',    ufd: UFD+'cammy',  playlist: YT+'PLvZ5t8JLwU9IQWiIb-Prj8WGKaAUnqQ3b', raidhyn: 'https://docs.google.com/spreadsheets/d/1eNsGZs7kX-kaCi8cB-iEVxlLfkWuSkIP_COjFzoLUaU/', discords: ['https://discord.com/invite/0pgjU35fSAeJNlCQ'] },
  ken:      { supercombo: SC+'Ken',      ufd: UFD+'ken',    playlist: YT+'PLvZ5t8JLwU9IFYjprE0kZrTb4TPn0l77c', raidhyn: 'https://docs.google.com/spreadsheets/d/1wuC-rzl3caOXpUt6uiv8tVxv4ceNqFfW1JXOwIVcpLA/', misterCrimson: 'https://www.youtube.com/watch?v=ILh6LB4yxac', discords: ['https://discord.gg/hBdR5FcZRk'] },
  deejay:   { supercombo: SC+'Dee_Jay',  ufd: UFD+'deejay', playlist: YT+'PLvZ5t8JLwU9KffcH76iRHp8xkk_td2P3f', misterCrimson: 'https://www.youtube.com/watch?v=nUp9nzDpT-I', discords: ['https://discord.gg/NQJemFC2GZ'] },
  lily:     { supercombo: SC+'Lily',     ufd: UFD+'lily',   playlist: YT+'PLvZ5t8JLwU9IQ3zbd9gmT73x4AfYi9P6p', discords: ['https://discord.gg/WVNYspuBFQ'] },
  aki:      { supercombo: SC+'A.K.I.',   ufd: UFD+'aki',    playlist: YT+'PLvZ5t8JLwU9Ly7fIlPDOobExANmvKjr4c', raidhyn: 'https://docs.google.com/spreadsheets/d/1wlBIf_qOsch7nzh26tYGDSEGWp2m2L0XqJAhWxTSEW0/', discords: ['https://discord.gg/a-k-i-1135649494462124065'] },
  rashid:   { supercombo: SC+'Rashid',   ufd: UFD+'rashid', playlist: YT+'PLvZ5t8JLwU9Jlu2BBhSkTAqj2SiIMGKdv', discords: ['https://discord.gg/ZUSRzdJeDj'] },
  blanka:   { supercombo: SC+'Blanka',   ufd: UFD+'blanka', playlist: YT+'PLvZ5t8JLwU9K3c9C5TUGFT4w1TKpgXfm9', discords: ['https://discord.gg/XzHkn6N'] },
  juri:     { supercombo: SC+'Juri',     ufd: UFD+'juri',   playlist: YT+'PLvZ5t8JLwU9JTBBhI0EMZ8GqLQ9c3UnaC', raidhyn: 'https://docs.google.com/spreadsheets/d/1RXr0jfyrgh8bpQ0uRoUwm2MxWhFEBKclKEda0O8Z8bo/', discords: ['https://discord.gg/8Xs5ddd'] },
  marisa:   { supercombo: SC+'Marisa',   ufd: UFD+'marisa', playlist: YT+'PLvZ5t8JLwU9IJBQHLmW30RBGgCkATRCmD', misterCrimson: 'https://www.youtube.com/watch?v=1A-8EsEw4CE', discords: ['https://discord.gg/uQScVkRmX5'] },
  guile:    { supercombo: SC+'Guile',    ufd: UFD+'guile',  playlist: YT+'PLvZ5t8JLwU9LbBqvY5gLGQkh0R47e_EZL', discords: ['https://discord.com/invite/B7Q6gGsRjp'] },
  ed:       { supercombo: SC+'Ed',       ufd: UFD+'ed',     playlist: YT+'PLvZ5t8JLwU9JjDmQqmCqPoh_AeKdJhGoS', discords: ['https://discord.com/invite/JEqx5R5'] },
  honda:    { supercombo: SC+'E._Honda', ufd: UFD+'honda',  playlist: YT+'PLvZ5t8JLwU9KGCkdsMBP_pa55t6aZ0NLO', raidhyn: 'https://docs.google.com/spreadsheets/d/1ivgTExaMITZCsJZpCWRvEcbbcAkZimKuQQNJ1A6R5r4/', discords: ['https://discord.com/invite/a8WFtaR'] },
  jamie:    { supercombo: SC+'Jamie',    ufd: UFD+'jamie',  playlist: YT+'PLvZ5t8JLwU9IiMB69_00baG5RyPyPn2WT', misterCrimson: 'https://www.youtube.com/watch?v=xDNgX9Sns_U', discords: ['https://discord.gg/knCKnhw5px'] },
  gouki:    { supercombo: SC+'Akuma',    ufd: UFD+'akuma',  playlist: YT+'PLvZ5t8JLwU9I2rratnrITg5QYh4msNl8y', raidhyn: 'https://docs.google.com/spreadsheets/d/1qybgNuH_tPb1PmLISqKAl_Mfpo6AFq-g_RuUqRgi5lI/', discords: ['https://discord.com/invite/cVXAwnN'] },
  vega:     { supercombo: SC+'M._Bison', ufd: UFD+'mbison', playlist: YT+'PLvZ5t8JLwU9J-xymYoQkZ8tRiMOIwZc_Q', raidhyn: 'https://docs.google.com/spreadsheets/d/1uXGk3gUCIds98BRc8A4UeiWj-W3e-q0XsIeV4s6xPtw/', misterCrimson: 'https://www.youtube.com/watch?v=hhtokonGPMQ', discords: ['https://discord.gg/w82tSmAzY4'] },
  terry:    { supercombo: SC+'Terry',    ufd: UFD+'terry',  playlist: YT+'PLvZ5t8JLwU9J6edj8FFcp5Oh11TRENEfi', raidhyn: 'https://docs.google.com/spreadsheets/d/1vIbP2sGXyX7VG1aghP25MSSPYITigwPlzvqWBq_AonM/', discords: ['https://discord.gg/BcACwFFQxE'] },
  mai:      { supercombo: SC+'Mai',      ufd: UFD+'mai',    playlist: YT+'PLvZ5t8JLwU9IxvmyomQImOG_kYY7dsFQX', misterCrimson: 'https://www.youtube.com/watch?v=I2bxwtBXey4', discords: ['https://discord.gg/kcMxnp9Gbd'] },
  elena:    { supercombo: SC+'Elena',    ufd: UFD+'elena',  playlist: YT+'PLvZ5t8JLwU9LJzzudsJmsQDu53jqhGtZU', discords: ['https://discord.gg/7Cpyjsw8Zp'] },
  sagat:    { supercombo: SC+'Sagat',    ufd: UFD+'sagat',  playlist: YT+'PLvZ5t8JLwU9K6ns4oo6HGRXvNJRHrqlSl', misterCrimson: 'https://www.youtube.com/watch?v=LjQAoBvjguE', discords: ['https://discord.com/invite/gaBG2Xs'] },
  cviper:   { supercombo: SC+'C._Viper', ufd: UFD+'cviper', playlist: YT+'PLvZ5t8JLwU9J8zKD-sSQcE-Ek6uHSxQqB', discords: ['https://discord.gg/DyNj2CTJZj'] },
  alex:     { supercombo: SC+'Alex',     ufd: UFD+'alex',   playlist: YT+'PLvZ5t8JLwU9L1MFxn3CXKLgAAJol_YiH9', discords: ['https://discord.gg/8qH4zupmEK'] },
  ingrid:   { discords: ['https://discord.gg/jEsdJZWswT', 'https://discord.gg/eUAjKa6VAy'] },
}
