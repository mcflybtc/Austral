"use client";
import React from "react";
import * as d3 from "d3";

export type CycleData = { date: string; [key: string]: number | string };

export function CycleChart({ data }: { data: CycleData[] }) {
  const ref = React.useRef<SVGSVGElement | null>(null);

  React.useEffect(() => {
    if (!ref.current || data.length === 0) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    const width = ref.current.clientWidth;
    const height = ref.current.clientHeight;
    const margin = { top: 10, right: 20, bottom: 30, left: 40 };
    const keys = Object.keys(data[0]).filter(k => k !== "date");
    const x = d3
      .scalePoint<string>()
      .domain(data.map(d => d.date))
      .range([margin.left, width - margin.right]);
    const y = d3
      .scaleLinear()
      .domain([0, 360])
      .range([height - margin.bottom, margin.top]);
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickValues(x.domain().filter((_, i) => i % Math.ceil(data.length / 10) === 0)));
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
    const line = d3
      .line<{ date: string; value: number }>()
      .x(d => x(d.date)!)
      .y(d => y(d.value));
    keys.forEach((key, idx) => {
      const color = idx === 0 ? "#f59e0b" : "#6366f1";
      const series = data.map(d => ({ date: d.date, value: Number(d[key]) }));
      svg
        .append("path")
        .datum(series)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 1.5)
        .attr("d", line);
    });
  }, [data]);

  return <svg ref={ref} className="w-full h-64"></svg>;
}
