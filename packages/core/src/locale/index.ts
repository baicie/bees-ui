type LocaleType = ['zh-cn', 'en-US'][number];

export interface Locale {
  locale: LocaleType;
  global?: Record<string, any>;
}
