# The Hidden Bottleneck of AI: Why Nvidia Can't Exist Without SK Hynix

## COLD OPEN

### Scene 1

A single Nvidia accelerator can sell for thirty thousand dollars or more. It is one of the most complex pieces of engineering ever mass produced. Yet without a small stack of memory built by one company in South Korea, that accelerator is a very expensive piece of sand. The memory is high bandwidth memory. The company is SK Hynix. Why Nvidia cannot simply buy it somewhere else is a story about physics, packaging, and a quiet chokehold.

## THE STAKES

### Scene 2

The numbers are hard to ignore. Nvidia became one of the most valuable companies by selling the shovels of the artificial intelligence boom. Every data center GPU needs high bandwidth memory, and the supply is not elastic. SK Hynix says its capacity sold out well before the year began, and warns shortages could persist to the end of the decade. When the bottleneck is measured in months of factory time, memory stops being a component. It becomes the schedule.

### Scene 3

Computer architects have a name for the gap between how fast a processor calculates and how fast memory can feed it. They call it the memory wall. For decades, caches and prefetching hid that gap in general computing. Artificial intelligence broke the illusion. A modern model does not read data once. It streams billions of parameters through the chip for every token, and the arithmetic units spend much of their time waiting for the next number to arrive.

## ACT I: THE PHYSICAL BARRIER

### Scene 4

To understand why high bandwidth memory exists, start with the graphics card you already know. A gaming GPU sits on a circuit board next to a handful of memory chips. Those chips are called graphics double data rate memory, or GDDR. They are cheap, dense, and fast in the way a highway is fast when traffic is light. The problem is not the chips themselves. The problem is the road between them and the processor.

### Scene 5

On a flagship graphics card, the memory bus is wide by historical standards. Three hundred and eighty four bits on one generation, five hundred and twelve bits on the next. Each bit is a copper trace routed across a printed circuit board, and every trace must arrive at the processor at the same time. At multi gigabit speeds, a few millimetres of extra length is no longer a detail. It is a timing error.

### Scene 6

Those copper traces behave like transmission lines. They have capacitance, inductance, and resistance. High frequency signals leak, reflect, and interfere with their neighbours. The further a signal travels, the more energy it loses and the more it distorts. Engineers compensate with better substrates, more layers, and careful shielding. But every fix costs money, adds thickness, and consumes power. You can only push a signal across a circuit board so far before the physical cost stops making sense.

### Scene 7

There is a second cost that matters even more in a data center. Moving a bit of data across a wire takes energy. The longer the wire and the faster the signal, the more energy that bit consumes. On a graphics card, that energy becomes heat, and heat becomes a cooling problem. Multiply it by hundreds of billions of bits per second and the power bill becomes a design constraint. The industry calls this the energy per bit.

### Scene 8

The memory wall is not a metaphor. It is a measurable ratio between compute throughput and memory bandwidth. Over the last two decades, floating point performance grew far faster than the bandwidth of ordinary memory. For a while, caches absorbed most of the traffic. Artificial intelligence workloads are different. They are dominated by matrix multiplication, and matrix multiplication is hungry for data. An arithmetic unit with no data is just a very expensive heater.

### Scene 9

Modern language models make the problem worse in two directions. Training requires enormous datasets and repeated passes over the same weights. Inference requires reading the entire model for every token, plus a growing cache of intermediate state called the key value cache. Both workloads care about capacity as much as bandwidth. A GPU with insufficient memory cannot hold the model, and a GPU with insufficient bandwidth cannot keep its cores busy. You need both at once.

### Scene 10

So why not simply bolt more GDDR chips onto the board. The answer is pin count, board area, and power. Each additional chip needs its own data lanes, its own power delivery, and its own share of the thermal budget. A processor can only drive so many high speed pins before the package becomes impractical. You can widen the bus, but the traces get longer and signal integrity gets worse. The architecture runs into a wall made of copper.

## ACT II: THE ENGINEERING SOLUTION

### Scene 11

The solution was to stop treating memory as something that lives across the board. Put it directly on top of the processor package. Stack the memory dies vertically and connect the stack to the GPU through a silicon interposer. That idea became high bandwidth memory. Instead of a few hundred bits routed across centimetres of circuit board, you get a thousand bits routed across millimetres of silicon. The distance collapses, and with it, the energy cost.

### Scene 12

Inside the stack, the dies are connected by through silicon vias, or TSVs. These are microscopic holes drilled through each memory die and filled with copper. Thousands run vertically through the stack, carrying power, data, and control signals. Building them is brutal. The dies must be thinned to a fraction of a millimetre, aligned with micron precision, and bonded without cracking. One bad via can ruin an entire stack, and a stack may hold sixteen dies.

### Scene 13

The stack then sits on a silicon interposer, a piece of silicon that acts like a miniature motherboard. It carries thousands of fine traces between the GPU and the memory stacks. This is called two point five D packaging, because the chips sit side by side rather than truly on top of one another. It is expensive, difficult, and the only practical way to deliver enough bandwidth to a modern accelerator. The interposer, not the transistor, became the bottleneck.

### Scene 14

High bandwidth memory has evolved through several generations. The first version arrived in twenty thirteen. HBM2 doubled the stack height and data rate. HBM2E added twelve high stacks. Then came HBM3, with a thousand bit interface that pushed one stack past eight hundred gigabytes per second. Each generation required thinner dies, more vias, and better packaging. By HBM3E, the stack had become a packaging problem.

### Scene 15

HBM3E is the generation that powered Nvidia's Blackwell accelerators. A twelve high stack holds thirty six gigabytes and delivers about one point two terabytes per second. Depending on the accelerator, Nvidia pairs four, six, or eight stacks around the GPU. Total bandwidth reaches eight terabytes per second on a flagship part. That is roughly ten times the fastest consumer graphics card, achieved in a package that still fits on a server board.

### Scene 16

Stacking that many dies creates three problems at once. The first is thickness. To keep the package within a fixed height, each die must be thinned as more layers are added. A twelve high stack uses dies roughly forty percent thinner than an eight high stack. The second is warpage. Thin silicon bends under heat and pressure. The third is heat. Every die generates power, and that heat must escape through the same narrow path.

### Scene 17

To hold the stack together, manufacturers use a packaging process. The conventional approach is called thermal compression non conductive film, or TC-NCF. A film of adhesive is placed between each layer, then heat and pressure bond the stack. Samsung and Micron have stayed with this film based family. SK Hynix used it too, through the second generation of high bandwidth memory. Then, in twenty nineteen, SK Hynix made a bet that would define the next decade.

### Scene 18

TC-NCF has a weakness that becomes serious as stacks get taller. The film is applied one layer at a time, and each layer must be pressed and cured. Trapped air can leave voids. The pressure needed to bond thin dies can cause warpage. And the film sits between the silicon and the heat spreader, adding thermal resistance where heat needs to escape. At eight layers, the process is difficult. At twelve, it becomes a yield problem.

### Scene 19

SK Hynix's alternative is called mass reflow molded underfill, or M R MUF. Instead of a film between every layer, the entire stack is reflowed at once and filled with a liquid epoxy molding compound. The epoxy flows into the gaps between the dies and around the bumps, then hardens. Because the material fills the whole stack, it conducts heat better and spreads stress more evenly. SK Hynix also added up to four times more thermal dummy bumps.

### Scene 20

The results were measurable. SK Hynix says its first M R MUF process improved heat dissipation by thirty six percent. For twelve high HBM3, it developed advanced M R MUF, with a new molding compound offering one point six times the heat dissipation. The process also gave better warpage control and reduced pressure on each die. By HBM3E mass production, SK Hynix was reporting yields around seventy percent.

### Scene 21

That yield number is the heart of the story. A memory stack is useless if only half the finished units work. Nvidia needs millions of stacks, on schedule, with reliability that survives years in a data center. SK Hynix could deliver them at volume. Samsung, using its film based process, struggled with heat and yield on early HBM3E. The result was not a permanent monopoly, but it was close. Nvidia gave the largest share to the supplier that could ship.

## ACT III: THE ECONOMICS OF PICKS AND SHOVELS

### Scene 22

The irony is that SK Hynix nearly went bankrupt before the boom. In twenty twenty three, the memory market collapsed. Prices fell, inventories piled up, and the company reported an operating loss of more than seven point seven trillion Korean won. It was the kind of year that forces a memory maker to cut investment and retreat. SK Hynix did the opposite. It kept betting on high bandwidth memory and advanced packaging.

### Scene 23

The bet paid off faster than expected. In twenty twenty four, SK Hynix reported an operating profit of twenty three point five trillion won. In twenty twenty five, profit nearly doubled to forty seven point two trillion won, on revenue of ninety seven trillion won. High bandwidth memory grew into more than forty percent of its DRAM revenue. A business written off as a commodity cyclical became the most profitable supplier in the AI supply chain.

### Scene 24

High bandwidth memory is also a different business from ordinary DRAM. It consumes at least twice the wafer capacity of standard memory for the same output, because of stacking and packaging. Every bit of high bandwidth memory displaces two bits of commodity DRAM. When demand surges, supply cannot respond quickly. Fabs take years to build, and packaging lines take months to qualify. The result is pricing power that commodity memory never enjoyed, and a shortage that shows up downstream.

### Scene 25

Geography amplifies the concentration. SK Hynix produces DRAM in Icheon and Cheongju, South Korea. Its newest fab, M15X in Cheongju, represents an investment of more than twenty trillion won and is designed to ramp high bandwidth memory. A much larger cluster is rising in Yongin, with a first fab targeted for twenty twenty seven. Advanced packaging lines are being added in Cheongju and Indiana. A single disruption can move the entire artificial intelligence roadmap.

### Scene 26

The second chokepoint is outside Korea. The GPU and its memory stacks must be assembled on a silicon interposer through a process called chip on wafer on substrate, or CoWoS. That process belongs to TSMC. Starting with HBM4, the memory's base die is built on a logic process, bringing TSMC deeper into the chain. Nvidia can design the accelerator, but cannot ship it without Korean memory and Taiwanese packaging. Every side is a bottleneck.

### Scene 27

That is why monopoly needs a qualifier. SK Hynix does not control all of it. TrendForce expects it to hold more than half the market, and Nvidia's first HBM4 allocation reportedly gave SK Hynix the mid fifty percent range, Samsung the mid twenty percent range, and Micron around twenty percent. That is not a textbook monopoly. It is a chokehold. The largest customer cannot diversify faster than its second supplier can fix its yield.

### Scene 28

Concentration cuts both ways. SK Hynix depends on Nvidia for much of its high bandwidth memory revenue, and Nvidia depends on SK Hynix for much of its memory supply. Samsung is spending heavily to close the yield gap, and by twenty twenty six it reported HBM4 yields near eighty percent. China's CXMT is trying to enter, though its yields remain far behind. The lead is real but not permanent, and that uncertainty is priced into every forecast.

## ACT IV: THE NEXT WALL

### Scene 29

The next generation is here. HBM4 doubles the interface from one thousand and twenty four bits to two thousand and forty eight bits. It supports sixteen stacked dies, thirty six gigabytes at twelve high and forty eight at sixteen high, and delivers around two terabytes per second per stack. SK Hynix completed development first in twenty twenty five and is ramping production for Nvidia's Vera Rubin platform. Bandwidth doubles again, and so does the packaging difficulty.

### Scene 30

Beyond HBM4, the industry is preparing to remove the solder bumps entirely. The technique is called hybrid bonding. It presses two surfaces together so copper pads fuse directly, with no solder balls at all. The pitch shrinks from around twenty microns to below one micron. That means more connections per square millimetre, shorter paths, less heat, and the ability to stack sixteen or more dies. SK Hynix has validated twelve high hybrid bonding.

### Scene 31

But hybrid bonding is not a free lunch. Copper expands when heated, and the surfaces must be almost perfectly flat and clean. A single particle can create a void across an entire interface. The equipment is expensive, the process is slow, and the yield learning curve is steep. That is why the industry is delaying the transition where it can. The physical limit is no longer the transistor. It is the wire, the bump, the adhesive, and the heat.

### Scene 32

The lesson of high bandwidth memory is simple. The artificial intelligence boom is usually told as a story about compute. But the companies that control the path between compute and data have as much leverage. Nvidia designs the brain. SK Hynix builds the memory that feeds it. TSMC packages the two together. The next battle is advanced packaging, where interposers, hybrid bonding, and eventually silicon photonics decide how fast data can move. That is where we go next.

## SOURCES

- SK hynix Newsroom, "SK hynix Completes World's First HBM4 Development and Readies Mass Production," September 12, 2025. https://news.skhynix.com/en/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/
- SK hynix Newsroom, "Rulebreakers' Revolutions: How MR-MUF's Heat Control Breakthrough Elevated HBM to New Heights." https://news.skhynix.com/en/rulebreaker-revolutions-mr-muf-unlocks-hbm-heat-control/
- SK hynix Newsroom, "SK hynix unveils iHBM thermal solution to boost AI performance," May 26, 2026. https://news.skhynix.com/en/ihbm-solution/
- SK hynix Newsroom, "Tech Note: Hybrid Bonding, Evolving into a Foundational Technology for Improving Semiconductor Performance." https://news.skhynix.com/en/tech-note-series-ep2/
- SK hynix Newsroom, "SK hynix Announces 4Q24 Financial Results," January 23, 2025. https://news.skhynix.com/en/sk-hynix-announces-4q24-financial-results/
- SK hynix Newsroom, "SK hynix Announces FY25 Financial Results," January 28, 2026. https://news.skhynix.com/en/sk-hynix-announces-fy25-financial-results/
- SK hynix Newsroom, "SK hynix to Produce DRAM From M15X in Cheongju." https://news.skhynix.com/en/sk-hynix-to-produce-dram-from-m15x-in-cheongju/
- SK hynix Newsroom, "SK hynix to Showcase AI Memory Leadership at NVIDIA GTC 2026," March 17, 2026. https://news.skhynix.com/en/skhynix-at-gtc2026/
- SK hynix Newsroom, "Five things you need to know about SK hynix and the future of AI memory," June 23, 2026. https://news.skhynix.com/en/5-things-about-skhynix/
- SK hynix Newsroom, "Overcoming Technological Limits Requires the Integration of Memory and Logic: SK hynix Presents Vision at TSMC Symposium," April 2026. https://news.skhynix.com/en/tsmc-technology-symposium-2026/
- JEDEC, "High Bandwidth Memory (HBM4) DRAM," JESD270-4A, Version 1.1, December 2025. https://www.jedec.org/standards-documents/docs/jesd270-4
- TrendForce, "HBM Market Heats Up as Three Giants Clash, with HBM4 at the Center," September 17, 2025. https://www.trendforce.com/news/2025/09/17/news-hbm-market-heats-up-as-three-giants-clash-with-hbm4-at-the-center/
- TrendForce, "Samsung HBM4 Reportedly to Ship First After Lunar New Year, Initial Share Projected at Mid-20%," February 9, 2026. https://www.trendforce.com/news/2026/02/09/news-samsung-hbm4-reportedly-to-ship-first-after-lunar-new-year-initial-share-projected-at-mid-20/
- TrendForce, "SK hynix 3Q Earnings Preview: Record Profit at 78% Operating Margin; HBM4, LTAs, Solidigm in Focus," October 26, 2026. https://www.trendforce.com/news/2026/10/26/news-sk-hynix-3q-earnings-preview-record-profit-at-78-operating-margin-hbm4-ltas-solidigm-in-focus/
- TrendForce, "Samsung Says HBM Share Matches DRAM Standing as HBM4 Sales Triple; DS Margin Hits 72%, 10 LTA Clients Signed," October 29, 2026. https://www.trendforce.com/news/2026/10/29/news-samsung-says-hbm-share-matches-dram-standing-as-hbm4-sales-triple-ds-margin-hits-72-10-lta-clients-signed/
- TrendForce, "CXMT Reportedly Ships HBM3E Samples, Eyes Production Within 2 Months Despite 20-30% Yields," October 28, 2026. https://www.trendforce.com/news/2026/10/28/news-cxmt-reportedly-ships-hbm3e-samples-eyes-production-within-2-months-despite-20-30-yields/
- TrendForce, "SK hynix Reportedly Completes 12-High Hybrid Bonding HBM Validation, Raises Yields for Mass Production," April 29, 2026. https://www.trendforce.com/news/2026/04/29/news-sk-hynix-reportedly-completes-12-high-hybrid-bonding-hbm-validation-raises-yields-for-mass-production/
- TrendForce, "Samsung, SK hynix Reportedly Reconsider Hybrid Bonding Timeline; 16-High HBM4E May Be Earliest Adoption," July 7, 2026. https://www.trendforce.com/news/2026/07/07/news-samsung-sk-hynix-reportedly-reconsider-hybrid-bonding-timeline-16-high-hbm4e-may-be-earliest-adoption/
- TrendForce, "Samsung's HBM4 Yield Reportedly Hits 80% as HBM Race Heats Up, SK hynix Labor Talks Add a Twist," August 10, 2026. https://www.trendforce.com/news/2026/08/10/news-samsungs-hbm4-yield-reportedly-hits-80-as-race-to-supply-vera-rubin-heats-up-sk-hynix-labor-talks-add-a-twist/
