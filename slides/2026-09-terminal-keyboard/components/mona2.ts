// moNa2 の物理配列 (単位: u = 1 キー幅)。
// 左: 外側 3 列は 4 行、内側 2 列は 3 行、最内列にエンコーダーと 1 キー、親指 3 キー (計 22)
// 右: 左右対称だが親指は 2 キー + トラックボール (計 20)
export type Placed = { x: number; y: number; w: number; h: number; rot?: number }

const STAGGER = [0.75, 0.4, 0.05, 0.15, 0.35, 0.55]
const HALF_W = 6.1
const HALF_GAP = 1.6
export const MONA2_W = HALF_W * 2 + HALF_GAP
export const MONA2_H = 5.35

// 列ごとに上から並べる。null は空き (エンコーダーの位置)
const LEFT_COLS: (string | null)[][] = [
  ['Q', 'A', 'Z', 'cmd'],
  ['W', 'S', 'X', 'opt'],
  ['E', 'D', 'C', 'tab'],
  ['R', 'F', 'V'],
  ['T', 'G', 'B'],
  [null, null, 'fn'],
]
const RIGHT_COLS: (string | null)[][] = [
  [null, 'quote', 'ret'],
  ['Y', 'H', 'N'],
  ['U', 'J', 'M'],
  ['I', 'K', 'comma'],
  ['O', 'L', 'period'],
  ['P', 'semi', 'slash', 'bslash'],
]
const LEFT_THUMBS: [string, number, number, number][] = [
  ['esc', 3.0, 3.55, 5],
  ['space', 4.05, 3.7, 12],
  ['ctrl', 5.1, 3.95, 20],
]
const RIGHT_THUMBS: [string, number, number, number][] = [
  ['del', -0.1, 3.95, -20],
  ['lshift', 0.95, 3.7, -12],
]

// ケースはキーの輪郭に沿わせるため、列ごとの矩形と親指クラスターの矩形を重ねて描く
const PAD = 0.16
const colPiece = (x: number, y: number, rows: number): Placed => ({
  x: x - PAD,
  y: y - PAD,
  w: 1 + PAD * 2,
  h: rows + PAD * 2,
})

export function mona2Layout(ox: number, oy: number) {
  const rx = ox + HALF_W + HALF_GAP
  const pos: Record<string, Placed> = {}
  LEFT_COLS.forEach((col, c) =>
    col.forEach((id, r) => {
      if (id) pos[id] = { x: ox + c, y: oy + STAGGER[c] + r, w: 1, h: 1 }
    }),
  )
  RIGHT_COLS.forEach((col, c) =>
    col.forEach((id, r) => {
      if (id) pos[id] = { x: rx + c, y: oy + STAGGER[5 - c] + r, w: 1, h: 1 }
    }),
  )
  LEFT_THUMBS.forEach(([id, x, y, rot]) => (pos[id] = { x: ox + x, y: oy + y, w: 1, h: 1, rot }))
  RIGHT_THUMBS.forEach(([id, x, y, rot]) => (pos[id] = { x: rx + x, y: oy + y, w: 1, h: 1, rot }))

  const casePieces: Placed[] = [
    ...LEFT_COLS.map((col, c) => colPiece(ox + c, oy + STAGGER[c], col.length)),
    ...RIGHT_COLS.map((col, c) => colPiece(rx + c, oy + STAGGER[5 - c], col.length)),
    { x: ox + 2.7, y: oy + 3.35, w: 3.7, h: 1.55, rot: 12 },
    { x: rx - 0.2, y: oy + 3.35, w: 4.0, h: 1.55, rot: -10 },
  ]
  const knob: Placed = { x: ox + 5.1, y: oy + 1.05, w: 0.8, h: 0.8 }
  const ball: Placed = { x: rx + 2.05, y: oy + 3.3, w: 1.6, h: 1.6 }
  return { pos, casePieces, knob, ball }
}

export const rectStyle = (r: Placed) => ({
  left: `calc(var(--u) * ${r.x})`,
  top: `calc(var(--u) * ${r.y})`,
  width: `calc(var(--u) * ${r.w} - var(--gap))`,
  height: `calc(var(--u) * ${r.h} - var(--gap))`,
})

// KeyboardShrink と Mona2Layer で図の位置を揃えるための共通キャンバス (Magic Keyboard の外形)
export const CANVAS_W = 14.5 + 0.45 + 3 + 0.45 + 4
export const CANVAS_H = 0.62 + 5
export const mona2Centered = () =>
  mona2Layout((CANVAS_W - MONA2_W) / 2, (CANVAS_H - MONA2_H) / 2 + 0.3)
