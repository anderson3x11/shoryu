// Checks the frame data move order and hitbox labels on real snapshot cases.
//   npx tsx scripts/check-frame-data.ts
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { frameMeter, hitboxShots, orderMoves, type Move, type MoveGroup } from '../lib/supercombo'

const moves = (id: string): Move[] => JSON.parse(readFileSync(`lib/data/supercombo/${id}.json`, 'utf8')).moves
const order = (id: string, group: MoveGroup) => orderMoves(group, moves(id).filter((m) => m.group === group)).map((m) => m.input)
const labels = (...files: string[]) => hitboxShots(files.map((f) => `/images/x/${f}`)).map((s) => s.label)

assert.deepEqual(order('ryu', 'normal').slice(0, 12), ['5LP', '5MP', '5HP', '5LK', '5MK', '5HK', '2LP', '2MP', '2HP', '2LK', '2MK', '2HK'])
assert.deepEqual(order('ryu', 'normal').slice(-3), ['5MP~LK', '5MP~LK~HK', '5HP~HK'])
assert.deepEqual(order('ryu', 'special').slice(0, 10), ['236LP', '236MP', '236HP', '236PP', 'D.236HP', 'D.236PP', '236LK', '236MK', '236HK', '236KK'])
// Follow-ups stay with the special they come from.
const gouki = order('gouki', 'special')
assert.ok(gouki.indexOf('236KK~P') > gouki.indexOf('236KK') && gouki.indexOf('236KK~P') < gouki.indexOf('623LP'))

assert.deepEqual(labels('A_623pp_hitbox_1.png', 'A_623pp_hitbox_preview.png', 'A_623pp_hitbox_2.png'), ['Full hitbox', 'Hitbox 1', 'Hitbox 2'])
assert.deepEqual(labels('A_214kk_hitbox.png', 'A_214kk2_hitbox.png', 'A_214kk3_hitbox.png'), ['Hitbox 1', 'Hitbox 2', 'Hitbox 3'])
assert.deepEqual(labels('A_4hk_hitbox_1.png', 'A_4hk_hitbox_2_3_preview.png', 'A_4hk_hitbox_2.png'), ['Hitbox 1', 'Hitbox 2-3', 'Hitbox 2'])
assert.deepEqual(labels('A_4hk_hitbox_1.png', 'A_4hk_hitbox_2_preview.png', 'A_4hk_hitbox_2.png'), ['Hitbox 1', 'Preview 2', 'Hitbox 2'])
assert.deepEqual(labels('J_6mk_dl2_hitbox_preview.png', 'J_6mk_dl2_hitbox_1.png'), ['Full hitbox', 'Hitbox 1'])
assert.deepEqual(labels('A_5lp_hitbox.png', 'A_5lp_hitbox.png'), ['Hitbox'])
assert.deepEqual(labels('H_214p_hitbox1.png', 'H_214p_enhanced.png'), ['Hitbox 1', 'Hitbox 2'])

const meter = (startup: string, active: string, recovery: string) =>
  frameMeter({ startup, active, recovery })?.map((s) => `${s.kind}:${s.frames}`).join(' ') ?? null
assert.equal(meter('4', '3', '7'), 'startup:3 active:3 recovery:7')
assert.equal(meter('16', '2(13)2', '14+17 land'), 'startup:15 active:2 gap:13 active:2 recovery:14 landing:17')
assert.equal(meter('1', '2,2', '20(22)'), 'active:2 active:2 recovery:20')
assert.equal(meter('10', 'until land', '17 land'), null)
assert.equal(meter('10', '90', '90'), null)

console.log('frame data order, hitbox labels and frame meter: ok')
