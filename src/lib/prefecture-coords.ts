// 都道府県の中心座標（概算）
// 物件の詳細住所からジオコーディングする前の仮座標として使用
export const PREFECTURE_COORDS: Record<string, [number, number]> = {
  "Hokkaido": [43.06, 141.35],
  "Aomori": [40.82, 140.74],
  "Iwate": [39.70, 141.15],
  "Miyagi": [38.27, 140.87],
  "Akita": [39.72, 140.10],
  "Yamagata": [38.24, 140.33],
  "Fukushima": [37.75, 140.47],
  "Ibaraki": [36.34, 140.45],
  "Tochigi": [36.57, 139.88],
  "Gunma": [36.39, 139.06],
  "Saitama": [35.86, 139.65],
  "Chiba": [35.61, 140.12],
  "Tokyo": [35.68, 139.69],
  "Kanagawa": [35.45, 139.64],
  "Niigata": [37.90, 139.02],
  "Toyama": [36.70, 137.21],
  "Ishikawa": [36.59, 136.63],
  "Fukui": [36.07, 136.22],
  "Yamanashi": [35.66, 138.57],
  "Nagano": [36.23, 138.18],
  "Gifu": [35.39, 136.72],
  "Shizuoka": [34.98, 138.38],
  "Aichi": [35.18, 136.91],
  "Mie": [34.73, 136.51],
  "Shiga": [35.00, 135.87],
  "Kyoto": [35.01, 135.77],
  "Osaka": [34.69, 135.50],
  "Hyogo": [34.69, 135.18],
  "Nara": [34.69, 135.83],
  "Wakayama": [34.23, 135.17],
  "Tottori": [35.50, 134.24],
  "Shimane": [35.47, 133.05],
  "Okayama": [34.66, 133.93],
  "Hiroshima": [34.40, 132.46],
  "Yamaguchi": [34.19, 131.47],
  "Tokushima": [34.07, 134.56],
  "Kagawa": [34.34, 134.04],
  "Ehime": [33.84, 132.77],
  "Kochi": [33.56, 133.53],
  "Fukuoka": [33.61, 130.42],
  "Saga": [33.25, 130.30],
  "Nagasaki": [32.75, 129.87],
  "Kumamoto": [32.79, 130.74],
  "Oita": [33.24, 131.61],
  "Miyazaki": [31.91, 131.42],
  "Kagoshima": [31.56, 130.56],
  "Okinawa": [26.34, 127.77],
};

// 同一県内でピンが重ならないよう、県全体に広く散らす
export function jitterCoord(base: [number, number], index: number): [number, number] {
  const angle = (index * 137.508) * (Math.PI / 180); // golden angle
  // 県の広がりをカバーする大きめの半径（0.05〜0.35度 ≒ 5〜35km）
  const radius = 0.05 + Math.sqrt(index) * 0.06;
  return [
    base[0] + radius * Math.cos(angle),
    base[1] + radius * Math.sin(angle),
  ];
}
