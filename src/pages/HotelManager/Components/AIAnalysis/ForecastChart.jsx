import { useEffect, useMemo, useRef, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { addDays, format, isValid, parse, parseISO } from "date-fns";
import {
  AI_CHART_COLORS,
  LABEL_FORECAST_TITLE,
  LABEL_TREND,
  LABEL_CONFIDENCE,
  LABEL_ESTIMATED,
} from "../../Constants/Analysis/aiAnalysisConstants";
import { formatChartTooltipLabel as fmtLabel } from "../../Helpers/aiAnalysisHelpers";
import styles from "./ForecastChart.module.css";

const PAGE_SIZE = 12;

const parseApiDate = (dateValue) => {
  if (!dateValue) return null;

  const directDate = new Date(dateValue);
  if (isValid(directDate)) return directDate;

  const formats = ["yyyy-MM-dd", "dd/MM/yyyy", "MM/dd/yyyy", "yyyy/MM/dd", "dd-MM-yyyy"];
  for (const f of formats) {
    const parsed = parse(dateValue, f, new Date());
    if (isValid(parsed)) return parsed;
  }

  const isoParsed = parseISO(dateValue);
  return isValid(isoParsed) ? isoParsed : null;
};

const normalizeDayKey = (dateValue) => format(dateValue, "yyyy-MM-dd");
const monthKeyFromDate = (dateValue) => format(dateValue, "yyyy-MM");
const monthLabelFromDate = (dateValue) => format(dateValue, "MM/yyyy");

const generateContinuousTimeline = (inputData = []) => {
  if (!Array.isArray(inputData) || inputData.length === 0) return [];

  const parsedDates = inputData
    .map((item) => parseApiDate(item?.date))
    .filter((d) => d && isValid(d))
    .sort((a, b) => a.getTime() - b.getTime());

  if (parsedDates.length === 0) return [];

  const startDate = parsedDates[0];
  const endDate = parsedDates[parsedDates.length - 1];

  const timeline = [];
  let current = startDate;

  while (current <= endDate) {
    timeline.push(current);
    current = addDays(current, 1);
  }

  return timeline;
};

const mergeForecastData = (timeline = [], inputData = []) => {
  const apiMap = new Map();

  inputData.forEach((item) => {
    const parsedDate = parseApiDate(item?.date);
    if (!parsedDate || !isValid(parsedDate)) return;

    apiMap.set(normalizeDayKey(parsedDate), {
      yhat: Number(item?.yhat) || 0,
      lower: Number(item?.lower) || 0,
      upper: Number(item?.upper) || 0,
    });
  });

  return timeline.map((dateItem) => {
    const dayKey = normalizeDayKey(dateItem);
    const merged = apiMap.get(dayKey) || { yhat: 0, lower: 0, upper: 0 };

    return {
      ...merged,
      rawDate: dayKey,
      date: format(dateItem, "dd/MM"),
      monthKey: monthKeyFromDate(dateItem),
      monthLabel: monthLabelFromDate(dateItem),
    };
  });
};

const buildMonthChunkPages = (fullData = [], pageSize = PAGE_SIZE) => {
  const monthBuckets = fullData.reduce((acc, item) => {
    if (!acc[item.monthKey]) acc[item.monthKey] = [];
    acc[item.monthKey].push(item);
    return acc;
  }, {});

  const orderedMonthKeys = Object.keys(monthBuckets).sort();

  return orderedMonthKeys.flatMap((monthKey) => {
    const monthData = monthBuckets[monthKey];
    const chunks = [];

    for (let i = 0; i < monthData.length; i += pageSize) {
      const chunk = monthData.slice(i, i + pageSize);
      chunks.push({
        monthKey,
        monthLabel: chunk[0]?.monthLabel || monthKey,
        chunk,
        rangeText: `${i + 1}-${Math.min(i + pageSize, monthData.length)} / ${monthData.length}`,
      });
    }

    return chunks;
  });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{fmtLabel(label)}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color || AI_CHART_COLORS.LINE }}>
            {entry.name}: <strong>{entry.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ForecastChart({ data, peakForecast }) {
  const [startIndex, setStartIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("next");
  const chartViewportRef = useRef(null);

  const fullTimelineData = useMemo(() => {
    const timeline = generateContinuousTimeline(data);
    return mergeForecastData(timeline, data);
  }, [data]);

  const pages = useMemo(() => buildMonthChunkPages(fullTimelineData, PAGE_SIZE), [fullTimelineData]);

  useEffect(() => {
    setStartIndex(0);
  }, [pages.length]);

  const safeIndex = Math.min(startIndex, Math.max(0, pages.length - 1));
  const currentPage = pages[safeIndex] || null;
  const paginatedData = currentPage?.chunk || [];

  const canPrev = safeIndex > 0;
  const canNext = safeIndex < pages.length - 1;

  const monthOptions = useMemo(() => {
    const map = new Map();
    pages.forEach((page, idx) => {
      if (!map.has(page.monthKey)) {
        map.set(page.monthKey, {
          monthKey: page.monthKey,
          monthLabel: page.monthLabel,
          firstPageIndex: idx,
        });
      }
    });
    return Array.from(map.values());
  }, [pages]);

  useEffect(() => {
    if (!chartViewportRef.current) return;
    chartViewportRef.current.classList.remove(styles.slideNext, styles.slidePrev);
    void chartViewportRef.current.offsetWidth;
    chartViewportRef.current.classList.add(
      slideDirection === "prev" ? styles.slidePrev : styles.slideNext
    );
  }, [safeIndex, slideDirection]);

  const handlePrev = () => {
    if (!canPrev) return;
    setSlideDirection("prev");
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    if (!canNext) return;
    setSlideDirection("next");
    setStartIndex((prev) => Math.min(pages.length - 1, prev + 1));
  };

  const handleMonthChange = (event) => {
    const selectedMonth = event.target.value;
    const selected = monthOptions.find((m) => m.monthKey === selectedMonth);
    if (!selected) return;

    setSlideDirection(selected.firstPageIndex < safeIndex ? "prev" : "next");
    setStartIndex(selected.firstPageIndex);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.chartTitle}>{LABEL_FORECAST_TITLE}</p>
        </div>
        <div className={styles.peakBadge}>
          <span className={styles.peakNumber}>{peakForecast}</span>
          <span className={styles.peakLabel}>{LABEL_ESTIMATED}</span>
        </div>
      </div>

      <div className={styles.chartArea}>
        <div className={styles.controlsRow}>
          <label className={styles.monthSelectWrap}>
            <span className={styles.controlLabel}>Tháng</span>
            <select
              className={styles.monthSelect}
              value={currentPage?.monthKey || ""}
              onChange={handleMonthChange}
            >
              {monthOptions.map((option) => (
                <option key={option.monthKey} value={option.monthKey}>
                  {option.monthLabel}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div ref={chartViewportRef} className={styles.chartViewport}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={paginatedData} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0070f3" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0070f3" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0070f3" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#0070f3" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#f1f5f9" vertical={false} />

              <XAxis
                dataKey="date"
                interval={0}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={["auto", "auto"]}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(0,112,243,0.2)", strokeWidth: 1 }} />

              <Area type="monotone" dataKey="upper" stroke="none" fill="url(#confGrad)" name="Biên trên" legendType="none" />
              <Area type="monotone" dataKey="lower" stroke="none" fill="#ffffff" name="Biên dưới" legendType="none" />

              <Area
                type="monotone"
                dataKey="yhat"
                stroke="#0070f3"
                strokeWidth={2.5}
                fill="url(#lineGrad)"
                dot={false}
                activeDot={{ r: 5, fill: "#0070f3", stroke: "#fff", strokeWidth: 2 }}
                name={LABEL_TREND}
                isAnimationActive
                animationDuration={420}
              />

              <ReferenceLine
                x={paginatedData[paginatedData.length - 1]?.date}
                stroke="rgba(0,112,243,0.35)"
                strokeDasharray="4 3"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.pagination}>
          <button className={styles.navButton} onClick={handlePrev} disabled={!canPrev}>
            Prev
          </button>

          <div className={styles.pageMeta}>
            <span className={styles.monthChip}>{currentPage?.monthLabel || "--/----"}</span>
            <span className={styles.pageInfo}>{currentPage?.rangeText || "0-0 / 0"}</span>
          </div>

          <button className={styles.navButton} onClick={handleNext} disabled={!canNext}>
            Next
          </button>
        </div>

        <div className={styles.legend}>
          <span className={styles.legendLine} />
          <span className={styles.legendText}>{LABEL_TREND}</span>
          <span className={styles.legendArea} />
          <span className={styles.legendText}>{LABEL_CONFIDENCE}</span>
        </div>
      </div>
    </div>
  );
}
