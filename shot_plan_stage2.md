# Stage 2 shot plan — 32 scenes

Legend: **C1** = `<PhysicsComparison />`; **C2** = `<LayerStackDiagram />`; **C3** = `<YieldMeter />`; **C4** = `<SupplyChainMap />`; **P** = Wikimedia photo; **V** = Mixkit stock clip; **BG** = generated CAD background.

Full audio: **14:27** (867.35s). Each scene is cut into 3 visual beats of roughly 8–10s. Custom components cover **430.0s = 49.6%** of runtime; photos/video cover **437.4s = 50.4%**. No two Mixkit clips are adjacent.

| # | Global | Dur | Primary | Beat A | Beat B | Beat C |
|---:|---|---:|---|---|---|---|
| 01 | 0:00–0:27 | 26.9s | Photo/Video | **P** `nvidia_blackwell.jpg` — B200 GPU, slow push-in | **P** `sk_hynix_mrdimm.jpg + sk_hynix_logo.png` — HBM product + SK hynix logo | **BG** `cad_gpu_hbm.jpg + nvidia_h100.png` — useful silicon vs expensive sand |
| 02 | 0:27–0:54 | 27.4s | Photo/Video | **V** `mixkit_data_center_hallway.mp4` — server aisle | **P** `data_center_servers.jpg` — sold-out capacity overlay | **V** `mixkit_fiber_optics_server_room.mp4` — data-flow macro |
| 03 | 0:54–1:21 | 26.7s | Photo/Video | **P** `microchip_die.jpg` — GPU die macro | **V** `mixkit_circuit_board_processor.mp4` — board/processor | **P** `nvidia_h100.png + dram_chip.jpg` — compute vs memory gap |
| 04 | 1:21–1:46 | 24.8s | C1 PhysicsComparison | **C1** bus-width schematic | **C1** interposer bus | **C1** distance collapse |
| 05 | 1:46–2:11 | 25.2s | C1 PhysicsComparison | **C1** length/impedance | **C1** reflection/noise | **C1** signal integrity |
| 06 | 2:11–2:39 | 28.1s | C1 PhysicsComparison | **C1** bar chart | **C1** heat spread | **C1** efficiency curve |
| 07 | 2:39–3:05 | 25.4s | C1 PhysicsComparison | **C1** memory wall ratio | **C1** utilization | **C1** roofline |
| 08 | 3:05–3:32 | 27.9s | Photo/Video | **V** `mixkit_data_center_blue_hallway.mp4` — inference at scale | **P** `data_center_racks.jpg` — KV-cache/capacity | **BG** `cad_gpu_hbm.jpg + nvidia_h100.png` — capacity vs bandwidth |
| 09 | 3:32–4:00 | 27.8s | Photo/Video | **V** `mixkit_circuit_board_macro.mp4` — DRAM traffic | **P** `dram_chip.jpg` — DRAM banks macro | **P** `hbm_package.jpg` — HBM capacity stack |
| 10 | 4:00–4:27 | 26.6s | Photo/Video | **P** `pcb_macro.jpg` — pin count / board area | **V** `mixkit_electronics_assembly_line.mp4` — board assembly | **BG** `cad_gpu_hbm.jpg + silicon_interposer.jpg` — why the bus cannot grow |
| 11 | 4:27–4:53 | 26.6s | C2 LayerStackDiagram | **C2** vertical DRAM stack | **C2** GPU + HBM side by side | **C2** board cm to silicon mm |
| 12 | 4:53–5:20 | 26.4s | C2 LayerStackDiagram | **C2** through-silicon vias | **C2** thousands of vias | **C2** stack height |
| 13 | 5:20–5:47 | 27.3s | C2 LayerStackDiagram | **C2** thousands of traces | **C2** 2.5D | **C2** chip on wafer on substrate |
| 14 | 5:47–6:14 | 27.3s | Photo/Video | **P** `hbm_package.jpg` — real HBM/interposer package | **P** `hbm_stack.png` — HBM generation diagram | **V** `mixkit_pick_and_place_circuit.mp4` — packaging line |
| 15 | 6:14–6:42 | 27.6s | C2 LayerStackDiagram | **C2** capacity label | **C2** per-stack bandwidth | **C2** 8 TB/s total |
| 16 | 6:42–7:07 | 24.8s | Photo/Video | **P** `silicon_wafer.jpg` — thin wafer handling | **V** `mixkit_robot_electronics_factory.mp4` — stacking/packaging | **BG** `cad_wafer_tsv.jpg + through_silicon_via.png` — warpage/heat |
| 17 | 7:07–7:34 | 27.6s | Photo/Video | **P** `lithography_machine.jpg` — cleanroom process | **V** `mixkit_robot_production_line.mp4` — production line | **P** `cleanroom.jpg` — TC-NCF film process overlay |
| 18 | 7:34–8:00 | 25.8s | C3 YieldMeter | **C3** TC-NCF weakness | **C3** heat path | **C3** yield meter |
| 19 | 8:00–8:28 | 27.7s | C3 YieldMeter | **C3** MR-MUF process | **C3** bar comparison | **C3** thermal vias |
| 20 | 8:28–8:55 | 26.9s | C3 YieldMeter | **C3** advanced MR-MUF | **C3** SK hynix yield | **C3** thin-die stack |
| 21 | 8:55–9:22 | 27.4s | C3 YieldMeter | **C3** yield comparison | **C3** millions of stacks | **C3** largest share |
| 22 | 9:22–9:48 | 26.3s | Photo/Video | **V** `mixkit_server_room_alarm.mp4` — 2023 memory crash | **P** `data_center_racks.jpg` — loss chart overlay | **P** `sk_hynix_logo.png + sk_hynix_mrdimm.jpg` — SK hynix bet |
| 23 | 9:48–10:16 | 27.7s | Photo/Video | **P** `nvidia_headquarters.jpg` — AI demand | **V** `mixkit_data_center_blue_hallway.mp4` — data-center buildout | **P** `sk_hynix_logo.png` — FY24/FY25 profit chart |
| 24 | 10:16–10:45 | 28.7s | Photo/Video | **P** `asml_containers.jpg` — equipment/capacity | **V** `mixkit_electronics_assembly_line.mp4` — packaging lines | **BG** `cad_supply_chain.jpg + silicon_wafer.jpg + dram_chip.jpg` — 2x wafer capacity |
| 25 | 10:45–11:14 | 29.3s | Photo/Video | **P** `south_korea_map.png` — Icheon/Cheongju/Yongin pins | **V** `mixkit_robot_electronics_factory.mp4` — fab/packaging | **P** `cleanroom.jpg + semiconductor_fab.jpg` — concentration risk |
| 26 | 11:14–11:43 | 28.7s | C4 SupplyChainMap | **C4** supply chain map | **C4** TSMC packaging | **C4** TSMC logic process |
| 27 | 11:43–12:10 | 27.1s | C4 SupplyChainMap | **C4** mid-50/mid-20/20 | **C4** Nvidia-SK hynix | **C4** SK hynix/Samsung/Micron |
| 28 | 12:10–12:38 | 27.7s | Photo/Video | **P** `data_center_servers.jpg` — demand pressure | **V** `mixkit_circuit_board_macro.mp4` — yield race | **P** `samsung_logo.png + micron_logo_white.png + sk_hynix_logo.png` — competitor comparison |
| 29 | 12:38–13:05 | 27.4s | C2 LayerStackDiagram | **C2** HBM4 doubling | **C2** capacity | **C2** Vera Rubin package |
| 30 | 13:05–13:33 | 27.7s | C2 LayerStackDiagram | **C2** hybrid bonding | **C2** connection density | **C2** HBM4E horizon |
| 31 | 13:33–13:59 | 26.1s | Photo/Video | **P** `lithography_machine.jpg` — cleanroom limits | **V** `mixkit_pick_and_place_circuit.mp4` — placement precision | **BG** `cad_wafer_tsv.jpg + through_silicon_via.png` — copper/heat limit |
| 32 | 13:59–14:27 | 28.6s | Photo/Video | **BG** `cad_supply_chain.jpg + nvidia_logo.png + sk_hynix_logo.png + tsmc_fab18.jpg` — triangle recap | **V** `mixkit_fiber_optics_server_room.mp4` — next frontier | **P** `semiconductor_fab.jpg + silicon_wafer.jpg` — advanced packaging tease |
