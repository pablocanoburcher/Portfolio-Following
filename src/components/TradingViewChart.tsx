'use client';

import { useEffect, useRef, memo } from 'react';
import { TimeInterval } from '@/types/assets';

interface TradingViewChartProps {
  symbol: string;
  interval: TimeInterval;
}

function TradingViewChart({ symbol, interval }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Map our intervals to TradingView intervals
  const getTradingViewInterval = (interval: TimeInterval): string => {
    switch (interval) {
      case '24h': return 'D';
      case '7d': return 'W';
      case '1w': return 'W';
      case '1m': return 'M';
      case '6m': return '6M';
      case '1y': return '12M';
      case '5y': return '60M';
      case 'all': return 'ALL';
      default: return 'D';
    }
  };

  // Get range based on interval
  const getRange = (interval: TimeInterval): string => {
    switch (interval) {
      case '24h': return '1D';
      case '7d': return '5D';
      case '1w': return '5D';
      case '1m': return '1M';
      case '6m': return '6M';
      case '1y': return '12M';
      case '5y': return '60M';
      case 'all': return 'ALL';
      default: return '1M';
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = '';

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = 'calc(100% - 32px)';
    widgetDiv.style.width = '100%';

    widgetContainer.appendChild(widgetDiv);
    containerRef.current.appendChild(widgetContainer);

    // Create and load TradingView script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: getTradingViewInterval(interval),
      range: getRange(interval),
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: 'rgba(13, 13, 15, 1)',
      gridColor: 'rgba(32, 33, 35, 0.5)',
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: false,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: 'https://www.tradingview.com'
    });

    widgetContainer.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, interval]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
    />
  );
}

export default memo(TradingViewChart);
