<script>
	import * as d3 from "d3";
	import { onMount } from "svelte";

	let svgEl;

	onMount(() => {
		const svg = d3.select(svgEl);
		const width = 600;
		const height = 600;
		const radius = 200;
		const center = { x: width / 2, y: height / 2 };

		const metrics = [
			"Exploration",
			"Lethality (Wormhole)",
			"Lethality (Faction Warfare)",
			"Logistics & Support",
			"Industry & Infrastructure",
			"Risk-Taking"
		];

		// Example pilots and fake scores (0–1)
		const data = [
			{
				name: "Endo Tzu",
				values: [0.9, 0.8, 0.6, 0.4, 0.2, 0.9]
			},
			{
				name: "Dragon Deveto",
				values: [0.7, 0.4, 0.8, 0.9, 0.3, 0.6]
			},
			{
				name: "Selpora",
				values: [0.3, 0.9, 0.5, 0.3, 0.8, 0.7]
			}
		];

		const angleSlice = (2 * Math.PI) / metrics.length;
		const rScale = d3.scaleLinear().domain([0, 1]).range([0, radius]);
		const colors = ["#00FFFF", "#FF00FF", "#FF4500"];

		// Glow filter
		const defs = svg.append("defs");
		const filter = defs.append("filter").attr("id", "glow");
		filter.append("feGaussianBlur").attr("stdDeviation", 3).attr("result", "coloredBlur");
		const feMerge = filter.append("feMerge");
		feMerge.append("feMergeNode").attr("in", "coloredBlur");
		feMerge.append("feMergeNode").attr("in", "SourceGraphic");

		// Grid circles
		const levels = 5;
		for (let level = 1; level <= levels; level++) {
			const r = (radius / levels) * level;
			svg.append("circle")
				.attr("cx", center.x)
				.attr("cy", center.y)
				.attr("r", r)
				.attr("fill", "none")
				.attr("stroke", "#333")
				.attr("stroke-width", 1);
		}

		// Axis lines + labels
		metrics.forEach((metric, i) => {
			const angle = angleSlice * i - Math.PI / 2;
			const x = center.x + Math.cos(angle) * radius;
			const y = center.y + Math.sin(angle) * radius;

			svg.append("line")
				.attr("x1", center.x)
				.attr("y1", center.y)
				.attr("x2", x)
				.attr("y2", y)
				.attr("stroke", "#555")
				.attr("stroke-width", 1);

			svg.append("text")
				.attr("x", center.x + Math.cos(angle) * (radius + 30))
				.attr("y", center.y + Math.sin(angle) * (radius + 30))
				.attr("fill", "#ccc")
				.attr("font-size", "13px")
				.attr("text-anchor", "middle")
				.attr("alignment-baseline", "middle")
				.text(metric);
		});

		function radarPath(values) {
			return d3.lineRadial()
				.radius((d) => rScale(d))
				.angle((d, i) => i * angleSlice)
				.curve(d3.curveLinearClosed)(values);
		}

		// Data polygons
		data.forEach((d, i) => {
			svg.append("path")
				.attr("transform", `translate(${center.x},${center.y})`)
				.attr("d", radarPath(d.values))
				.attr("fill", colors[i])
				.attr("fill-opacity", 0.2)
				.attr("stroke", colors[i])
				.attr("stroke-width", 2)
				.attr("filter", "url(#glow)");
		});

		// Pilot names / legend
		const legend = svg
			.append("g")
			.attr("transform", `translate(${center.x - 220}, ${height - 80})`);

		data.forEach((d, i) => {
			const g = legend.append("g").attr("transform", `translate(0, ${i * 22})`);
			g.append("rect")
				.attr("width", 14)
				.attr("height", 14)
				.attr("fill", colors[i])
				.attr("fill-opacity", 0.6);
			g.append("text")
				.attr("x", 22)
				.attr("y", 12)
				.attr("fill", "#ccc")
				.attr("font-size", "14px")
				.text(d.name);
		});
	});
</script>

<svg bind:this={svgEl} width="600" height="600" class="mx-auto block" />

<style>
	:global(body) {
		background-color: #0a0a0a;
		color: #ccc;
		font-family: system-ui, sans-serif;
	}
	svg {
		display: block;
		margin: 2rem auto;
		background: radial-gradient(circle at center, #111 0%, #000 100%);
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 255, 255, 0.1);
	}
	text {
		user-select: none;
	}
</style>
