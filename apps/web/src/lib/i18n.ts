type Locale = 'zh-TW' | 'en' | 'ja';

const translations: Record<Locale, Record<string, string>> = {
  'zh-TW': {
    // Nav
    'nav.quests': '任務板',
    'nav.vocab': '單詞學習',
    'nav.news': '新聞挑戰',
    'nav.achievements': '成就',
    'nav.profile': '我的',
    'nav.shop': '商店',
    'nav.leaderboard': '排行榜',

    // Auth
    'auth.login': '登入',
    'auth.register': '註冊',
    'auth.email': '電子郵件',
    'auth.password': '密碼',
    'auth.familyName': '家庭名稱',
    'auth.displayName': '顯示名稱',
    'auth.childPin': '輸入 PIN 碼',
    'auth.enterPin': '請輸入 4 位數 PIN 碼',

    // Quests
    'quest.board': '今日任務',
    'quest.detail': '任務詳情',
    'quest.submit': '提交任務',
    'quest.verify': '審核任務',
    'quest.approve': '通過',
    'quest.reject': '退回',
    'quest.completed': '已完成',
    'quest.pending': '待完成',
    'quest.submitted': '待審核',

    // Gamification
    'game.level': '等級',
    'game.xp': '經驗值',
    'game.coins': '星幣',
    'game.streak': '連續天數',
    'game.levelUp': '升級了！',
    'game.achievementUnlocked': '成就解鎖！',

    // Vocab
    'vocab.review': '複習單詞',
    'vocab.correct': '答對了！',
    'vocab.incorrect': '再試試',
    'vocab.complete': '今日複習完成！',
    'vocab.newCards': '新單詞',

    // News
    'news.today': '今日新聞',
    'news.readMore': '閱讀全文',
    'news.quiz': '回答問題',
    'news.score': '得分',

    // Parent
    'parent.dashboard': '總覽',
    'parent.review': '待審核',
    'parent.create': '佈置任務',
    'parent.progress': '進度報告',
    'parent.settings': '設定',
    'parent.family': '家庭管理',

    // Common
    'common.loading': '載入中...',
    'common.error': '發生錯誤',
    'common.save': '儲存',
    'common.cancel': '取消',
    'common.confirm': '確認',
    'common.back': '返回',
    'common.today': '今天',
    'common.noData': '暫無資料',
  },
  en: {
    'nav.quests': 'Quests',
    'nav.vocab': 'Vocabulary',
    'nav.news': 'News',
    'nav.achievements': 'Achievements',
    'nav.profile': 'Profile',
    'nav.shop': 'Shop',
    'nav.leaderboard': 'Leaderboard',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'quest.board': "Today's Quests",
    'game.level': 'Level',
    'game.xp': 'XP',
    'game.coins': 'Star Coins',
    'game.streak': 'Streak',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
  },
  ja: {},
};

let currentLocale: Locale = 'zh-TW';

export function setLocale(locale: Locale) {
  currentLocale = locale;
}

export function t(key: string): string {
  return translations[currentLocale]?.[key] || translations['zh-TW']?.[key] || key;
}

export function getLocale(): Locale {
  return currentLocale;
}
