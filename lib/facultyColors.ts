export const FACULTY_RING_COLORS: Record<string, string> = {
  '文学部':                '#92400e',
  '経済学部':              '#ef4444',
  '法学部（法律学科）':    '#facc15',
  '法学部（政治学科）':    '#facc15',
  '商学部':                '#a855f7',
  '医学部':                '#9ca3af',
  '理工学部':              '#22c55e',
  '総合政策学部':          '#f97316',
  '環境情報学部':          '#3730a3',
  '看護医療学部':          '#ec4899',
  '薬学部（薬学科）':      '#84cc16',
  '薬学部（薬科学科）':    '#84cc16',
  '文学研究科':                          '#1e293b',
  '経済学研究科':                        '#1e293b',
  '法学研究科':                          '#1e293b',
  '社会学研究科':                        '#1e293b',
  '商学研究科':                          '#1e293b',
  '医学研究科':                          '#1e293b',
  '理工学研究科':                        '#1e293b',
  '政策・メディア研究科':                '#1e293b',
  '健康マネジメント研究科':              '#1e293b',
  '薬学研究科':                          '#1e293b',
  '経営管理研究科（KBS）':              '#1e293b',
  'システムデザイン・マネジメント研究科（SDM）': '#1e293b',
  'メディアデザイン研究科（KMD）':      '#1e293b',
  '法務研究科（ロースクール）':          '#1e293b',
};

export const DEFAULT_RING_COLOR = '#d1d5db';

export const getFacultyRingColor = (faculty: string | null): string => {
  if (!faculty) return DEFAULT_RING_COLOR;
  return FACULTY_RING_COLORS[faculty] ?? DEFAULT_RING_COLOR;
};
