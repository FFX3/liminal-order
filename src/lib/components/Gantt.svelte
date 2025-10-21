<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  /** @type {{
   *    data: { name: string, start: Date, end: Date }[]
   * }}
   */
  let { data } = $props();

  /** @type {SVGSVGElement} */
  let svg;
  let width = 800;
  let height = 400;
  const margin = { top: 20, right: 20, bottom: 30, left: 100 };

  function draw() {
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scaleTime()
      .domain([
        d3.min(data, (/** @type {{ start: Date; }} */ d) => d.start),
        d3.max(data, (/** @type {{ end: Date; }} */ d) => d.end)
      ])
      .range([0, innerWidth]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, innerHeight])
      .padding(0.1);

    const svgSel = d3.select(svg);
    svgSel.selectAll('*').remove();  // clear old chart

    const g = svgSel
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Bars
    g.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (/** @type {{ start: Date; }} */ d) => x(d.start))
      .attr('y', (/** @type {{ name: Date; }} */ d) => y(d.name))
      .attr('width', (/** @type {{ end: Date; start: Date; }} */ d) => x(d.end) - x(d.start))
      .attr('height', y.bandwidth())
      .attr('fill', 'steelblue');

    // Axis bottom (time)
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3.axisBottom(x)
        .ticks(d3.timeDay.every(1))
        .tickFormat(d3.timeFormat('%d'))
      );

    // Axis left (job names)
    g.append('g')
      .call(d3.axisLeft(y));

    g.selectAll(".now-line, .now-text").remove();

    const now = new Date();
    const nowX = x(now);
    const labelX = Math.max(Math.min(nowX, innerWidth - 30), 30);

    g.append("line")
        .attr("class", "now-line")
        .attr("x1", nowX)
        .attr("x2", nowX)
        .attr("y1", 0)
        .attr("y2", innerHeight)
        .attr("stroke", "red")
        .attr("stroke-width", 2);

    g.append("text")
        .attr("class", "now-text")
        .attr("x", labelX)
        .attr("y", -5)
        .attr("text-anchor", "middle")
        .attr("fill", "red")
        .text(d3.timeFormat("%H:%M")(now));
  }

  onMount(() => {
    draw();
    const interval = setInterval(() => {
      draw();
    }, 60_000);

    return () => clearInterval(interval);
  });
</script>

<svg bind:this={svg}></svg>

<style>
  svg {
    width: 100%;
    /* optionally set height etc */
  }
</style>
