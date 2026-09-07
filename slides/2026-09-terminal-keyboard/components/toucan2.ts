import { mona2Centered, type Placed } from './mona2'

// 実機の写真 (public/toucan2.jpg, 1200x1200) の実測値 (px)。
// 図を写真に重ねるとき、Q (左手) と Y (右手) の中心とキー間隔を基準に位置合わせする
export const TOUCAN_PHOTO = {
  src: 'toucan2.jpg',
  w: 1200,
  h: 1200,
  pitch: 60,
  q: { x: 172.5, y: 640 },
  y: { x: 820, y: 602.5 },
}

// Toucan2 は片手 3 行 × 5 列 + 親指 3 キー。moNa2 から外側 3 列の 4 段目と最内列を
// 落とし、右の \ は親指クラスターへ移す。落ちるキーは 6 個 (42 → 36)
export const TOUCAN_REMOVED = new Set(['cmd', 'opt', 'tab', 'fn', 'quote', 'ret'])
const LEFT_COLS = [['Q', 'A', 'Z'], ['W', 'S', 'X'], ['E', 'D', 'C'], ['R', 'F', 'V'], ['T', 'G', 'B']]
const RIGHT_COLS = [['Y', 'H', 'N'], ['U', 'J', 'M'], ['I', 'K', 'comma'], ['O', 'L', 'period'], ['P', 'semi', 'slash']]
export const RIGHT_IDS = new Set([...RIGHT_COLS.flat(), 'del', 'lshift', 'bslash'])

// ケースの各ピースがどちらの手に属するか。写真に重ねるとき、左は Q、右は Y を基準に写像する
export type Side = 'left' | 'right'
export type CasePiece = Placed & { side: Side }

const PAD = 0.16
const col = (x: number, y: number, rows: number, side: Side): CasePiece => ({ x: x - PAD, y: y - PAD, w: 1 + PAD * 2, h: rows + PAD * 2, side })

export function toucanLayout(mona2 = mona2Centered()) {
  const ox = mona2.pos.Q.x // 左手の外側列の x
  const oy = mona2.pos.E.y // 一番高い列の上端 = 基準の y

  // 写真は左右の間隔が moNa2 の図より広い。Q→Y のベクトルを写真 (キー間隔 = 1u) と
  // 図で比べ、差のぶん右半分ごとずらす
  const p = TOUCAN_PHOTO
  const shift = {
    x: (p.y.x - p.q.x) / p.pitch - (mona2.pos.Y.x - mona2.pos.Q.x),
    y: (p.y.y - p.q.y) / p.pitch - (mona2.pos.Y.y - mona2.pos.Q.y),
  }
  const rx = mona2.pos.Y.x - 1 + shift.x // 右手の最内列 (quote / ret) があった x
  const ry = oy + shift.y

  const pos: Record<string, Placed> = {}
  for (const [id, r] of Object.entries(mona2.pos)) {
    if (TOUCAN_REMOVED.has(id)) continue
    pos[id] = RIGHT_IDS.has(id) ? { ...r, x: r.x + shift.x, y: r.y + shift.y } : { ...r }
  }
  // 親指 3 キーは C / V / B (右は N / M とトラックパッド) の真下に、外へ行くほど下がる弧で並ぶ
  Object.assign(pos, {
    esc: { x: ox + 2.74, y: oy + 3.19, w: 1, h: 1, rot: 0 },
    space: { x: ox + 4.0, y: oy + 3.3, w: 1, h: 1, rot: 5 },
    ctrl: { x: ox + 5.19, y: oy + 3.65, w: 1, h: 1, rot: 12 },
    del: { x: rx - 0.21, y: ry + 3.76, w: 1, h: 1, rot: -14 },
    lshift: { x: rx + 1.02, y: ry + 3.67, w: 1, h: 1, rot: -6 },
    bslash: { x: rx + 2.28, y: ry + 3.36, w: 1, h: 1, rot: 0 },
  })

  // ケース: 各列 3 段ぶんの矩形 + 左のディスプレイ列 + 右のトラックパッド + 親指クラスター
  const casePieces: CasePiece[] = [
    ...LEFT_COLS.map((ids) => col(pos[ids[0]].x, pos[ids[0]].y, 3, 'left')),
    ...RIGHT_COLS.map((ids) => col(pos[ids[0]].x, pos[ids[0]].y, 3, 'right')),
    { x: ox + 4.9, y: oy, w: 2.0, h: 3.4, side: 'left' }, // ディスプレイ列
    { x: rx - 2.35, y: ry + 0.85, w: 3.2, h: 3.2, rot: -8, side: 'right' }, // トラックパッド列
    { x: ox + 2.3, y: oy + 3.0, w: 4.1, h: 1.5, rot: 8, side: 'left' }, // 左の親指クラスター
    { x: rx - 0.45, y: ry + 3.1, w: 4.0, h: 1.5, rot: -8, side: 'right' }, // 右の親指クラスター
  ]
  const display: CasePiece = { x: ox + 5.0, y: oy + 0.55, w: 1.0, h: 1.65, side: 'left' }
  const trackpad: CasePiece = { x: rx - 2.16, y: ry + 1.07, w: 2.8, h: 2.8, rot: -8, side: 'right' }
  return { pos, casePieces, display, trackpad }
}
