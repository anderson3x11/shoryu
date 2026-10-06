import type { Locale } from './locales'

// UI strings only. Character reference data (wiki prose, combos, patch notes) stays English:
// it is a scraped snapshot, regenerated after every balance patch.
// Keep the shape flat-ish and the keys grouped by where they appear.
export const DICT = {
  en: {
    nav: {
      pros: 'Pros',
      tournaments: 'Tournaments',
      ranking: 'Ranking',
      streetdle: 'Streetdle',
      stats: 'Stats',
      openMenu: 'Open menu',
      searchPlayer: 'Search player...',
      language: 'Language',
    },
    footer: {
      notAffiliated: 'Not affiliated with Capcom',
      qa: 'Q&A',
      about: 'About',
      sourceOnGitHub: 'Source code on GitHub',
    },
    home: {
      tagline: 'Street Fighter 6 stats, player profiles, and rankings',
      characters: 'Characters',
    },
    search: {
      placeholder: 'Search by CFN name or ID',
      goToPlayer: 'Go to player',
      player: 'Player',
      recent: 'Recent',
      noResults: 'No players found',
      removeRecent: 'Remove from recent searches',
    },
    player: {
      refresh: 'Refresh',
      updated: 'Updated',
      justRefreshed: 'Just refreshed.',
      refreshUnavailable: 'Refresh unavailable.',
      justNow: 'just now',
      overview: 'Overview',
      history: 'Recent Battles',
      statsTab: 'Stats',
      rivals: 'Rivals',
      watchReplay: 'Watch replay on SF6 Stats',
      copyId: 'Click to copy',
      copied: 'COPIED',
    },
    meta: {
      home: { title: 'Shoryu - SF6 Stats', description: 'Street Fighter 6 player profiles, Master ranking, matchup charts, match history, and character guides.' },
      ranking: { title: 'Master Ranking', description: 'Top Street Fighter 6 players ranked by Master Rating. Live global leaderboard.' },
      stats: { title: 'Stats', description: 'Street Fighter 6 character usage rates across all rank tiers.' },
      pros: { title: 'Pro Players & Creators', description: 'Top Street Fighter 6 pro players and content creators with their Buckler profiles.' },
      tournaments: { title: 'Tournaments', description: 'Street Fighter 6 Tier 1 tournament results, prize pools, and top players.' },
      guides: { title: 'Guides', description: 'Street Fighter 6 guides, frame data, mechanics, and learning resources.' },
      streetdle: { title: 'Streetdle', description: 'Daily Street Fighter character guessing game. 72 characters from SF1 to KOF. A new character every day.' },
    },
  },

  ja: {
    nav: {
      pros: 'プロ',
      tournaments: '大会',
      ranking: 'ランキング',
      streetdle: 'ストリートドル',
      stats: 'キャラ使用率',
      openMenu: 'メニューを開く',
      searchPlayer: 'プレイヤー検索...',
      language: '言語',
    },
    footer: {
      notAffiliated: 'カプコンとは無関係の非公式サイトです',
      qa: 'よくある質問',
      about: 'このサイトについて',
      sourceOnGitHub: 'GitHubでソースコードを見る',
    },
    home: {
      tagline: 'ストリートファイター6の戦績・プレイヤー情報・ランキング',
      characters: 'キャラクター',
    },
    search: {
      placeholder: 'CFN名またはIDで検索',
      goToPlayer: 'プレイヤーページへ',
      player: 'プレイヤー',
      recent: '最近の検索',
      noResults: 'プレイヤーが見つかりません',
      removeRecent: '最近の検索から削除',
    },
    player: {
      refresh: '更新',
      updated: '取得',
      justRefreshed: '更新したばかりです。',
      refreshUnavailable: '更新できませんでした。',
      justNow: 'たった今',
      overview: '概要',
      history: '対戦履歴',
      statsTab: '戦績',
      rivals: 'ライバル',
      watchReplay: 'SF6 Statsでリプレイを見る',
      copyId: 'クリックでコピー',
      copied: 'コピーしました',
    },
    meta: {
      home: { title: 'Shoryu - SF6 戦績', description: 'ストリートファイター6のプレイヤー情報、マスターランキング、キャラ相性、対戦履歴、キャラ攻略。' },
      ranking: { title: 'マスターランキング', description: 'マスターレーティング順のストリートファイター6プレイヤーランキング。世界ランキングをリアルタイムで掲載。' },
      stats: { title: 'キャラ使用率', description: '全ランク帯のストリートファイター6キャラクター使用率。' },
      pros: { title: 'プロ選手・配信者', description: 'ストリートファイター6のトッププロ選手と配信者のBucklerプロフィール。' },
      tournaments: { title: '大会', description: 'ストリートファイター6のTier 1大会の結果、賞金、上位選手。' },
      guides: { title: '攻略', description: 'ストリートファイター6の攻略、フレームデータ、システム解説、学習リソース。' },
      streetdle: { title: 'ストリートドル', description: '毎日遊べるストリートファイターのキャラ当てゲーム。SF1からKOFまで72キャラ。毎日新しいキャラが登場。' },
    },
  },

  'pt-br': {
    nav: {
      pros: 'Profissionais',
      tournaments: 'Torneios',
      ranking: 'Ranking',
      streetdle: 'Streetdle',
      stats: 'Estatísticas',
      openMenu: 'Abrir menu',
      searchPlayer: 'Buscar jogador...',
      language: 'Idioma',
    },
    footer: {
      notAffiliated: 'Site não oficial, sem vínculo com a Capcom',
      qa: 'Perguntas frequentes',
      about: 'Sobre',
      sourceOnGitHub: 'Código-fonte no GitHub',
    },
    home: {
      tagline: 'Estatísticas, perfis de jogadores e rankings de Street Fighter 6',
      characters: 'Personagens',
    },
    search: {
      placeholder: 'Buscar por nome CFN ou ID',
      goToPlayer: 'Ir para o jogador',
      player: 'Jogador',
      recent: 'Buscas recentes',
      noResults: 'Nenhum jogador encontrado',
      removeRecent: 'Remover das buscas recentes',
    },
    player: {
      refresh: 'Atualizar',
      updated: 'Atualizado',
      justRefreshed: 'Atualizado agora mesmo.',
      refreshUnavailable: 'Não foi possível atualizar.',
      justNow: 'agora mesmo',
      overview: 'Visão geral',
      history: 'Partidas recentes',
      statsTab: 'Estatísticas',
      rivals: 'Rivais',
      watchReplay: 'Ver replay no SF6 Stats',
      copyId: 'Clique para copiar',
      copied: 'COPIADO',
    },
    meta: {
      home: { title: 'Shoryu - Estatísticas de SF6', description: 'Perfis de jogadores de Street Fighter 6, ranking Master, confrontos, histórico de partidas e guias de personagens.' },
      ranking: { title: 'Ranking Master', description: 'Os melhores jogadores de Street Fighter 6 por Master Rating. Placar global ao vivo.' },
      stats: { title: 'Estatísticas', description: 'Taxas de uso dos personagens de Street Fighter 6 em todos os ranks.' },
      pros: { title: 'Profissionais e Criadores', description: 'Os melhores jogadores profissionais e criadores de conteúdo de Street Fighter 6, com seus perfis no Buckler.' },
      tournaments: { title: 'Torneios', description: 'Resultados, premiações e melhores jogadores dos torneios Tier 1 de Street Fighter 6.' },
      guides: { title: 'Guias', description: 'Guias, frame data, mecânicas e recursos de aprendizado de Street Fighter 6.' },
      streetdle: { title: 'Streetdle', description: 'Jogo diário de adivinhar o personagem de Street Fighter. 72 personagens de SF1 a KOF. Um personagem novo todo dia.' },
    },
  },
} as const

export type Dict = (typeof DICT)['en']

export function getDict(locale: Locale): Dict {
  return DICT[locale] as Dict
}
