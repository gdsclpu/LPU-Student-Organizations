import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { merge } from 'lodash-es';

declare var Chart: any;
declare var ChartDataLabels: any;

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'canvas[mdbChart]',
  exportAs: 'mdbChart',
})
export class MdbChartDirective implements OnInit, OnDestroy {
  @Input()
  get datasets(): any {
    return this._datasets;
  }
  set datasets(datasets: any) {
    this._datasets = datasets;

    if (this._chart && this._isInitialized) {
      this._chart.data.datasets = datasets;
      this.update();
    }
  }
  private _datasets: any[];

  @Input()
  get labels(): string[] {
    return this._labels;
  }
  set labels(labels: string[]) {
    this._labels = labels;

    if (this._chart && this._isInitialized) {
      this._chart.data.labels = labels;
      this.update();
    }
  }
  private _labels: string[];

  @Input()
  get options(): any {
    return this._options;
  }
  set options(options: any) {
    this._options = options;

    if (this._isInitialized) {
      this._chart.options = options;
      this.rebuild();
    }
  }
  private _options: any;

  @Input() type: string;

  @Output() chartClick: EventEmitter<any> = new EventEmitter();
  @Output() chartHover: EventEmitter<any> = new EventEmitter();

  private _defaultOptions = {
    line: {
      elements: {
        line: {
          backgroundColor: 'rgba(66, 133, 244, 0.0)',
          borderColor: 'rgb(66, 133, 244)',
          borderWidth: 2,
          tension: 0.0,
        },
        point: {
          borderColor: 'rgb(66, 133, 244)',
          backgroundColor: 'rgb(66, 133, 244)',
        },
      },
      responsive: true,
      plugins: {
        tooltip: {
          intersect: false,
          mode: 'index',
        },
        legend: {
          display: true,
        },
      },
      scales: {
        x: {
          stacked: false,
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            color: 'rgba(0,0,0, 0.5)',
          },
        },
        y: {
          stacked: false,
          grid: {
            borderDash: [2],
            drawBorder: false,
            tickBorderDash: [2],
            tickBorderDashOffset: [2],
          },
          ticks: {
            color: 'rgba(0,0,0, 0.5)',
          },
        },
      },
    },
    bar: {
      elements: {
        line: {
          backgroundColor: 'rgb(66, 133, 244)',
        },
        bar: {
          backgroundColor: 'rgb(66, 133, 244)',
        },
      },
      responsive: true,
      plugins: {
        tooltip: {
          intersect: false,
          mode: 'index',
        },
        legend: {
          display: true,
        },
      },
      scales: {
        x: {
          stacked: false,
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            color: 'rgba(0,0,0, 0.5)',
          },
        },
        y: {
          stacked: false,
          grid: {
            borderDash: [2],
            drawBorder: false,
            color: function (context) {
              if (context.tick && context.tick.value === 0) {
                return 'rgba(0,0,0, 0)';
              }
              return Chart.defaults.borderColor;
            },
            tickBorderDash: [2],
            tickBorderDashOffset: [2],
          },
          ticks: {
            color: 'rgba(0,0,0, 0.5)',
          },
        },
      },
    },
    pie: {
      elements: {
        arc: { backgroundColor: 'rgb(66, 133, 244)' },
      },
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
    },
    doughnut: {
      elements: {
        arc: { backgroundColor: 'rgb(66, 133, 244)' },
      },
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
    },
    polarArea: {
      elements: {
        arc: { backgroundColor: 'rgba(66, 133, 244, 0.5)' },
      },
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
    },
    radar: {
      elements: {
        line: {
          backgroundColor: 'rgba(66, 133, 244, 0.5)',
          borderColor: 'rgb(66, 133, 244)',
          borderWidth: 2,
        },
        point: {
          borderColor: 'rgb(66, 133, 244)',
          backgroundColor: 'rgb(66, 133, 244)',
        },
      },
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
    },
    scatter: {
      elements: {
        line: {
          backgroundColor: 'rgba(66, 133, 244, 0.5)',
          borderColor: 'rgb(66, 133, 244)',
          borderWidth: 2,
          tension: 0.0,
        },
        point: {
          borderColor: 'rgb(66, 133, 244)',
          backgroundColor: 'rgba(66, 133, 244, 0.5)',
        },
      },
      responsive: true,
      plugins: {
        tooltip: {
          intersect: false,
          mode: 'index',
        },
        legend: {
          display: true,
        },
      },
      datasets: {
        borderColor: 'red',
      },
      scales: {
        x: {
          stacked: false,
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            color: 'rgba(0,0,0, 0.5)',
          },
        },
        y: {
          stacked: false,
          grid: {
            borderDash: [2],
            drawBorder: false,
            tickBorderDash: [2],
            tickBorderDashOffset: [2],
          },
          ticks: {
            color: 'rgba(0,0,0, 0.5)',
          },
        },
      },
    },
    bubble: {
      elements: {
        point: {
          borderColor: 'rgb(66, 133, 244)',
          backgroundColor: 'rgba(66, 133, 244, 0.5)',
        },
      },
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            color: 'rgba(0,0,0, 0.5)',
          },
        },
        y: {
          grid: {
            borderDash: [2],
            drawBorder: false,
            tickBorderDash: [2],
            tickBorderDashOffset: [2],
          },
          ticks: {
            color: 'rgba(0,0,0, 0.5)',
          },
        },
      },
    },
  };

  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _chart: any;

  private _isInitialized = false;

  constructor(private _elementRef: ElementRef) {}

  ngOnInit(): void {
    this._canvas = this._elementRef.nativeElement;
    this._ctx = this._canvas.getContext('2d');
    this._chart = this._buildChart(this._ctx);

    this._isInitialized = true;
  }

  ngOnDestroy(): void {
    this._destroyChart();
  }

  private _destroyChart(): void {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }

  private _buildChart(ctx: CanvasRenderingContext2D): any {
    const typeDefaultOptions = { ...this._defaultOptions[this.type] };
    const chartOptions = this.options
      ? merge(typeDefaultOptions, this.options)
      : typeDefaultOptions;

    if (!chartOptions.onHover) {
      chartOptions.onHover = (event: any, elements: any[]) => {
        this.chartHover.emit({ event, elements });
      };
    }

    if (!chartOptions.onClick) {
      chartOptions.onClick = (event: any, elements: any[]) => {
        this.chartClick.emit({ event, elements });
      };
    }

    let options: any;

    if (chartOptions.plugins && chartOptions.plugins.datalabels && ChartDataLabels) {
      options = {
        type: this.type,
        data: {
          labels: this.labels,
          datasets: this.datasets,
        },
        options: chartOptions,
        plugins: [ChartDataLabels],
      };
    } else {
      options = {
        type: this.type,
        data: {
          labels: this.labels,
          datasets: this.datasets,
        },
        options: chartOptions,
      };
    }

    return new Chart(ctx, options);
  }

  update(): void {
    if (this._chart) {
      this._chart.update();
    }
  }

  rebuild(): void {
    this._destroyChart();
    this._buildChart(this._ctx);
  }
}
