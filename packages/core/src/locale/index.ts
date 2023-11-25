type LocaleType = ['zh-CN', 'en-US'][number];

export interface Locale {
  locale: LocaleType;
  global?: Record<string, any>;
}
