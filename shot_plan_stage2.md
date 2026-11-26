# Stage 2 shot plan — Retention Engine rebuild

**Full audio:** **15:06.8** (906.76s). **34 scenes.** Custom CAD components: **426.3s = 47.0%**. AssetBeat: **479.9s = 52.9%**.

Legend: **Ph** = `<PhysicsComparison />`; **LS** = `<LayerStackDiagram />`; **YM** = `<YieldMeter />`; **SC** = `<SupplyChainMap />`; **P** = static photo; **V** = Mixkit video; **BG** = generated CAD background; **KB** = Ken Burns 1.00→1.08.

Every scene is cut into **3 visual beats of 8–10 s** (actual 8.2–9.6 s). Static photos get Ken Burns. `[BADGE]` appears for 3–4 s; `[J-CUT SFX]` is scheduled **1.0 s before the scene cut**.

| # | Global | Dur | Primary | Beat A | Beat B | Beat C | BADGE / J-CUT |
|---:|---|---:|---|---|---|---|---|
| 01 | 0:00.5–0:27.3 | 26.8s | AssetBeat | P nvidia_blackwell.jpg (KB 1.00→1.08) + price badge | P hbm_package.jpg (KB) + P sk_hynix_logo.png | BG cad_gpu_hbm.jpg + inset hbm_stack.png | `[BADGE: $40,000] @ 1.0–4.0s`; `[J-CUT: data whoosh] @ −1.0s` |
| 02 | 0:27.3–0:52.7 | 25.4s | AssetBeat | V mixkit_data_center_hallway.mp4 | P data_center_servers.jpg (KB) | V mixkit_fiber_optics_server_room.mp4 | `[BADGE: SOLD OUT] @ 1.0–4.0s`; `[J-CUT: warning pulse] @ −1.0s` |
| 03 | 0:52.7–1:18.4 | 25.8s | AssetBeat | P microchip_die.jpg (KB) | V mixkit_circuit_board_processor.mp4 | P nvidia_h100.png + P dram_chip.jpg (KB) | `[BADGE: MEMORY WALL] @ 1.0–4.0s`; `[J-CUT: digital tick] @ −1.0s` |
| 04 | 1:18.4–1:43.1 | 24.7s | PhysicsComparison | **PhysicsComparison** — Bus width: GDDR 384/512-bit vs HBM 1024-bit | **PhysicsComparison** — Energy per bit + thermal consequence | **PhysicsComparison** — Roofline: compute vs bandwidth | `[BADGE: 384-BIT] @ 1.0–4.0s`; `[J-CUT: crisp transition] @ −1.0s` |
| 05 | 1:43.1–2:08.3 | 25.2s | PhysicsComparison | **PhysicsComparison** — PCB trace matching / timing error | **PhysicsComparison** — Signal reflection + eye diagram | **PhysicsComparison** — Impedance vs trace length | `[BADGE: ns TIMING] @ 1.0–4.0s`; `[J-CUT: digital tick] @ −1.0s` |
| 06 | 2:08.3–2:34.0 | 25.7s | PhysicsComparison | **PhysicsComparison** — Energy per bit bars | **PhysicsComparison** — Thermal map / heat path | **PhysicsComparison** — Power vs bandwidth curve | `[BADGE: pJ/BIT] @ 1.0–4.0s`; `[J-CUT: warning pulse] @ −1.0s` |
| 07 | 2:34.0–3:02.4 | 28.4s | PhysicsComparison | **PhysicsComparison** — Compute vs bandwidth growth | **PhysicsComparison** — Matrix multiply data hunger | **PhysicsComparison** — Roofline / utilization | `[BADGE: ROOFLINE] @ 1.0–4.0s`; `[J-CUT: crisp transition] @ −1.0s` |
| 08 | 3:02.4–3:28.4 | 26.0s | AssetBeat | V mixkit_data_center_blue_hallway.mp4 | P data_center_racks.jpg (KB) | BG cad_gpu_hbm.jpg + inset nvidia_h100.png | `[BADGE: KV CACHE] @ 1.0–4.0s`; `[J-CUT: digital tick] @ −1.0s` |
| 09 | 3:28.4–3:53.7 | 25.3s | AssetBeat | P pcb_macro.jpg (KB) | V mixkit_electronics_assembly_line.mp4 | BG cad_gpu_hbm.jpg + inset silicon_interposer.jpg | `[BADGE: PIN COUNT] @ 1.0–4.0s`; `[J-CUT: crisp transition] @ −1.0s` |
| 10 | 3:53.7–4:20.0 | 26.3s | LayerStackDiagram | **LayerStackDiagram** — Exploded HBM stack | **LayerStackDiagram** — TSV array / die thinning | **LayerStackDiagram** — Silicon interposer / 2.5D | `[BADGE: HBM] @ 1.0–4.0s`; `[J-CUT: data whoosh] @ −1.0s` |
| 11 | 4:20.0–4:46.7 | 26.8s | LayerStackDiagram | **LayerStackDiagram** — TSV cross-section | **LayerStackDiagram** — Via count / pitch | **LayerStackDiagram** — Die thinning / stack height | `[BADGE: 10,000 TSV] @ 1.0–4.0s`; `[J-CUT: digital tick] @ −1.0s` |
| 12 | 4:46.7–5:11.9 | 25.2s | LayerStackDiagram | **LayerStackDiagram** — Interposer top view | **LayerStackDiagram** — GPU + HBM side by side | **LayerStackDiagram** — CoWoS package stack | `[BADGE: 2.5D] @ 1.0–4.0s`; `[J-CUT: crisp transition] @ −1.0s` |
| 13 | 5:11.9–5:40.4 | 28.4s | LayerStackDiagram | **LayerStackDiagram** — 12-Hi 36GB stack | **LayerStackDiagram** — 1.2 TB/s per stack | **LayerStackDiagram** — 8 stacks around GPU / 8 TB/s | `[BADGE: 1.2 TB/S] @ 1.0–4.0s`; `[J-CUT: data whoosh] @ −1.0s` |
| 14 | 5:40.4–6:07.3 | 26.9s | AssetBeat | P hbm_package.jpg (KB) | P hbm_stack.png | V mixkit_pick_and_place_circuit.mp4 | `[BADGE: 8 TB/S] @ 1.0–4.0s`; `[J-CUT: warning pulse] @ −1.0s` |
| 15 | 6:07.3–6:32.3 | 25.0s | LayerStackDiagram | **LayerStackDiagram** — 12-Hi 36GB stack | **LayerStackDiagram** — 1.2 TB/s counter | **LayerStackDiagram** — 8 stacks / 8 TB/s total | `[BADGE: 12-HI] @ 1.0–4.0s`; `[J-CUT: digital tick] @ −1.0s` |
| 16 | 6:32.3–6:59.7 | 27.4s | AssetBeat | P silicon_wafer.jpg (KB) | V mixkit_robot_electronics_factory.mp4 | BG cad_wafer_tsv.jpg + inset through_silicon_via.png | `[BADGE: TC-NCF] @ 1.0–4.0s`; `[J-CUT: warning pulse] @ −1.0s` |
| 17 | 6:59.7–7:27.2 | 27.5s | YieldMeter | **YieldMeter** — Yield gauge 70% SK hynix vs competitor | **YieldMeter** — Thermal resistance / TC-NCF | **YieldMeter** — Nvidia HBM4 allocation | `[BADGE: +36% HEAT] @ 1.0–4.0s`; `[J-CUT: data whoosh] @ −1.0s` |
| 18 | 7:27.2–7:53.4 | 26.2s | YieldMeter | **YieldMeter** — MR-MUF film vs liquid fill | **YieldMeter** — +36% / 1.6x thermal stats | **YieldMeter** — Yield meter to 70% | `[BADGE: 70% YIELD] @ 1.0–4.0s`; `[J-CUT: digital tick] @ −1.0s` |
| 19 | 7:53.4–8:19.0 | 25.6s | YieldMeter | **YieldMeter** — Yield comparison | **YieldMeter** — Millions of stacks / schedule | **YieldMeter** — Nvidia allocation bar | `[BADGE: YIELD MOAT] @ 1.0–4.0s`; `[J-CUT: crisp transition] @ −1.0s` |
| 20 | 8:19.0–8:46.2 | 27.2s | AssetBeat | Collage: sk_hynix_logo + samsung_logo + micron_logo_white | V mixkit_data_center_hallway.mp4 | BG cad_supply_chain.jpg + inset nvidia_logo.png | `[BADGE: MID-50%] @ 1.0–4.0s`; `[J-CUT: data whoosh] @ −1.0s` |
| 21 | 8:46.2–9:13.7 | 27.5s | AssetBeat | V mixkit_server_room_alarm.mp4 | P data_center_racks.jpg (KB) | P sk_hynix_logo.png + P hbm_package.jpg (KB) | `[BADGE: -7.7T KRW] @ 1.0–4.0s`; `[J-CUT: warning pulse] @ −1.0s` |
| 22 | 9:13.7–9:40.8 | 27.1s | AssetBeat | P nvidia_headquarters.jpg (KB) | V mixkit_data_center_blue_hallway.mp4 | P sk_hynix_logo.png + P sk_hynix_mrdimm.jpg (KB) | `[BADGE: 47.2T KRW] @ 1.0–4.0s`; `[J-CUT: crisp transition] @ −1.0s` |
| 23 | 9:40.8–10:09.0 | 28.2s | AssetBeat | P asml_containers.jpg (KB) | V mixkit_electronics_assembly_line.mp4 | BG cad_supply_chain.jpg + insets silicon_wafer.jpg, dram_chip.jpg (KB) | `[BADGE: 2x WAFER] @ 1.0–4.0s`; `[J-CUT: digital tick] @ −1.0s` |
| 24 | 10:09.0–10:37.9 | 28.9s | AssetBeat | P south_korea_map.png (KB) pins Icheon / Cheongju / Yongin | V mixkit_robot_electronics_factory.mp4 | P cleanroom.jpg (KB) + P semiconductor_fab.jpg (KB) | `[BADGE: M15X / YONGIN] @ 1.0–4.0s`; `[J-CUT: data whoosh] @ −1.0s` |
| 25 | 10:37.9–11:05.6 | 27.6s | SupplyChainMap | **SupplyChainMap** — Korea → Taiwan → USA triangle | **SupplyChainMap** — CoWoS package flow | **SupplyChainMap** — HBM4 logic base die | `[BADGE: CoWoS] @ 1.0–4.0s`; `[J-CUT: crisp transition] @ −1.0s` |
| 26 | 11:05.6–11:31.5 | 25.9s | AssetBeat | P samsung_logo.png + P sk_hynix_logo.png | P hbm_package.jpg (KB) | V mixkit_circuit_board_macro.mp4 | `[BADGE: 80% YIELD] @ 1.0–4.0s`; `[J-CUT: warning pulse] @ −1.0s` |
| 27 | 11:31.5–11:58.2 | 26.7s | LayerStackDiagram | **LayerStackDiagram** — 2048-bit HBM4 interface | **LayerStackDiagram** — 12-Hi 36GB vs 16-Hi 48GB | **LayerStackDiagram** — 2 TB/s per stack / Vera Rubin | `[BADGE: 2 TB/S] @ 1.0–4.0s`; `[J-CUT: data whoosh] @ −1.0s` |
| 28 | 11:58.2–12:26.8 | 28.6s | LayerStackDiagram | **LayerStackDiagram** — Solder bump vs Cu–Cu | **LayerStackDiagram** — Pitch 20 µm → <1 µm | **LayerStackDiagram** — 16-Hi hybrid bonding | `[BADGE: <1 µm] @ 1.0–4.0s`; `[J-CUT: digital tick] @ −1.0s` |
| 29 | 12:26.8–12:52.1 | 25.2s | AssetBeat | P lithography_machine.jpg (KB) | V mixkit_pick_and_place_circuit.mp4 | BG cad_wafer_tsv.jpg + inset through_silicon_via.png | `[BADGE: 16-HI] @ 1.0–4.0s`; `[J-CUT: warning pulse] @ −1.0s` |
| 30 | 12:52.1–13:20.4 | 28.4s | SupplyChainMap | **SupplyChainMap** — CoWoS capacity wall | **SupplyChainMap** — Larger interposer / lower yield | **SupplyChainMap** — Packaging is the new bottleneck | `[BADGE: CoWoS WALL] @ 1.0–4.0s`; `[J-CUT: crisp transition] @ −1.0s` |
| 31 | 13:20.4–13:46.9 | 26.4s | AssetBeat | P microchip_die.jpg (KB) | P cleanroom.jpg (KB) | P asml_containers.jpg (KB) + P silicon_wafer.jpg (KB) | `[BADGE: EUV MATERIALS] @ 1.0–4.0s`; `[J-CUT: data glitch] @ −1.0s` |
| 32 | 13:46.9–14:13.8 | 26.9s | AssetBeat | BG cad_supply_chain.jpg + insets nvidia_logo, sk_hynix_logo | V mixkit_fiber_optics_server_room.mp4 | P semiconductor_fab.jpg (KB) + P silicon_wafer.jpg (KB) | `[BADGE: DEPENDENCY STACK] @ 1.0–4.0s`; `[J-CUT: digital tick] @ −1.0s` |
| 33 | 14:13.8–14:39.2 | 25.4s | AssetBeat | Collage: nvidia_logo + sk_hynix_logo + tsmc_fab18.jpg | V mixkit_data_center_hallway.mp4 | P data_center_servers.jpg (KB) | `[BADGE: CHOKEPOINT] @ 1.0–4.0s`; `[J-CUT: warning pulse] @ −1.0s` |
| 34 | 14:39.2–15:06.8 | 27.6s | AssetBeat | BG cad_supply_chain.jpg + insets tsmc_fab18.jpg, lithography_machine.jpg (KB) | V mixkit_fiber_optics_server_room.mp4 | P silicon_wafer.jpg (KB) + P semiconductor_fab.jpg (KB) | `[BADGE: NEXT WALL] @ 1.0–4.0s`; `[J-CUT: crisp transition] @ −1.0s` |

## Shorts (3 × 38–42 s)

| Short | Global | Dur | Scene cuts | Screen text / BADGE | CTA |
|---|---|---:|---|---|---|
| Short 1 | 0:00–0:39.0 | 38.97s | S1: 0.5–14.3s · S2: 14.3–26.8s · S3: 26.8–39.0s | $40,000 CHIP → 8 TB/S → ONE SUPPLIER | FULL BREAKDOWN BELOW |
| Short 2 | 0:00–0:38.1 | 38.11s | S1: 0.5–13.4s · S2: 13.4–25.2s · S3: 25.2–38.1s | GDDR vs HBM → 1024-BIT TSV → 8 TB/S | FULL BREAKDOWN BELOW |
| Short 3 | 0:00–0:40.7 | 40.65s | S1: 0.5–10.4s · S2: 10.4–26.2s · S3: 26.2–40.7s | TC-NCF → +36% HEAT → 70% YIELD | FULL BREAKDOWN BELOW |

Short cuts every 2.5–4 s; on-screen text ≤ 4 words from 0.0 s. Each Short ends with a 4.5 s CTA plate pointing to Related Video.

## Shorts — beat-by-beat (cuts every 2.5–4 s)

| Short / Scene | Global | Dur | Visual beats | Screen text / BADGE | J-CUT |
|---|---|---|---:|---|---|
| Short 1 / Scene 1 | 0:00.5–0:14.3 | 13.8s | 0–3.5s `nvidia_blackwell.jpg` + price badge · 3.5–7.0s `hbm_package.jpg` + `sk_hynix_logo.png` · 7.0–10.5s `hbm_stack.png` + "12 LAYERS" · 10.5–14.3s `cad_gpu_hbm.jpg` + "DEAD SILICON" | `[SCREEN TEXT: $40,000 CHIP]` from 0.0s · `[BADGE: $40,000 CHIP]` @ 1.0–4.0s | data whoosh @ −1.0s |
| Short 1 / Scene 2 | 0:14.3–0:26.8 | 12.5s | 0–3.5s LS hbm3e Beat C · 3.5–7.0s 8 TB/S over stack · 7.0–10.5s `cad_supply_chain.jpg` + supplier node · 10.5–12.5s `sk_hynix_logo.png` | `[SCREEN TEXT: 8 TB/S]` from 0.0s · `[BADGE: 8 TB/S]` @ 1.0–4.0s | data whoosh @ −1.0s |
| Short 1 / Scene 3 | 0:26.8–0:39.0 | 12.2s | 0–3.5s Korea → Taiwan → US flow · 3.5–7.0s `nvidia_logo.png` + `sk_hynix_logo.png` + ONE SUPPLIER badge · 7.0–7.7s lockup · 7.7–12.2s CTA plate (4.5s) | `[SCREEN TEXT: ONE SUPPLIER]` from 0.0s · `[BADGE: ONE SUPPLIER]` @ 3.5–7.0s | data whoosh @ −1.0s |
| Short 2 / Scene 1 | 0:00.5–0:13.4 | 12.9s | 0–3.5s `pcb_macro.jpg` + GDDR bus · 3.5–7.0s Ph energy/heat · 7.0–10.5s `cad_gpu_hbm.jpg` + 8 TB/S wall · 10.5–13.4s `data_center_racks.jpg` | `[SCREEN TEXT: GDDR vs HBM]` from 0.0s · `[BADGE: GDDR vs HBM]` @ 1.0–4.0s | data whoosh @ −1.0s |
| Short 2 / Scene 2 | 0:13.4–0:25.2 | 11.8s | 0–3.5s LS package TSV · 3.5–7.0s 1024-BIT TSV badge · 7.0–10.5s `hbm_package.jpg` · 10.5–12.7s `silicon_interposer.jpg` | `[SCREEN TEXT: 1024-BIT TSV]` from 0.0s · `[BADGE: 1024-BIT TSV]` @ 1.0–4.0s | data whoosh @ −1.0s |
| Short 2 / Scene 3 | 0:25.2–0:38.1 | 12.9s | 0–3.5s LS hbm3e 8 stacks · 3.5–7.0s 8 TB/S badge · 7.0–8.4s `nvidia_blackwell.jpg` · 8.4–12.9s CTA plate (4.5s) | `[SCREEN TEXT: 8 TB/S]` from 0.0s · `[BADGE: 8 TB/S]` @ 3.5–7.0s | data whoosh @ −1.0s |
| Short 3 / Scene 1 | 0:00.5–0:10.4 | 9.9s | 0–3.0s YM heat/TC-NCF · 3.0–6.0s `samsung_logo.png` + `sk_hynix_logo.png` · 6.0–9.0s TC-NCF badge · 9.0–10.4s `hbm_package.jpg` | `[SCREEN TEXT: TC-NCF]` from 0.0s · `[BADGE: TC-NCF]` @ 1.0–4.0s | data whoosh @ −1.0s |
| Short 3 / Scene 2 | 0:10.4–0:26.2 | 15.8s | 0–3.5s YM MR-MUF · 3.5–7.0s +36% badge · 7.0–10.5s YM 70% gauge · 10.5–15.8s `hbm_package.jpg` + 70% YIELD | `[SCREEN TEXT: +36% HEAT]` from 0.0s · `[BADGE: +36% HEAT]` @ 1.0–4.0s | data whoosh @ −1.0s |
| Short 3 / Scene 3 | 0:26.2–0:40.7 | 14.5s | 0–3.5s `sk_hynix_mrdimm.jpg` + `samsung_logo.png` · 3.5–7.0s YM allocation · 7.0–9.95s HBM4 allocation badge · 9.95–14.5s CTA plate (4.5s) | `[SCREEN TEXT: 70% YIELD]` from 0.0s · `[BADGE: 70% YIELD]` @ 7.0–9.95s | data whoosh @ −1.0s |

## Coverage summary

| Component | Scenes | Seconds | Share |
|---|---|---:|---:|
| PhysicsComparison | 4, 5, 6, 7 | 104.0 | 11.5% |
| LayerStackDiagram | 10, 11, 12, 13, 15, 27, 28 | 187.0 | 20.6% |
| YieldMeter | 17, 18, 19 | 79.3 | 8.7% |
| SupplyChainMap | 25, 30 | 56.0 | 6.2% |
| **Total custom** | **16 scenes** | **426.3** | **47.0%** |

**Scene 01 asset rule applied:** `nvidia_blackwell.jpg` + `hbm_package.jpg` + `sk_hynix_logo.png`; `sk_hynix_mrdimm.jpg` is not used in Scene 01.

