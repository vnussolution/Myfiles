
 debugger;
let args = {
  lines: 0,
  stockouts: 0,
  parValue: 0,
  lineExt: 0,
  locationName: 0,
  turns: 0,
  recommended: 11,
  RemoveRec: 9,
  AddRec: 14,
  Baseline: 4,
};
let isError = true;
if (window.frameElement.dialogArguments) {
  args = window.frameElement.dialogArguments;
  document.title = args.title;
  isError = false;

} else {

}
//a_ItemLocationFederatedGrid



const dateFrom = moment(args.calculationProfile._date_filter_from).format('L');
const dateTo   = moment(args.calculationProfile._date_filter_to).format('L');

const app = new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data () {
    return  {
      errorMessage: 'dialogArguments is null',
      isError,
      message: "Hello Vue!",
      date: moment().format("L"),
      location: {
        lines       : args.lines,
        stockouts   : args.stockouts,
        parValue    : args.parValue,
        lineExt     : args.lineExt,
        turns       : args.turns,
        binCount    : args.binCount,
        parItems    : args.totalParItem,

        recLines       : args.recLines,
        recStockouts   : args.recStockouts,
        recParValue    : args.recParValue,
        recLineExt     : args.recLineExt,
        recTurns       : args.recTurns,
        recBinCount    : args.recBinCount,
        recParItems    : args.recTotalParItem,

        organization: "DemandLogicDev13",
        reportName  : args.locationName,
        dateRange   : dateFrom+' - '+dateTo,
      },
      progressBar: false,
      pagenumber:true,
    }
  },
  computed: {
    classObject: function () {
      return {
        pagenumber: this.pagenumber,
       
      }
    }
  },
  methods: {
    pdf: function () {

      this.progressBar = true;
      this.pagenumber = false;


      const invoice = document.querySelector("body");
      const pageBreaks = invoice.querySelectorAll('.pages');
      pageBreaks.forEach(el=>{
        el.classList.remove('pagenumber1');

      })
   

      const opt = {
        margin: 0.5,
        filename: `${args.locationName}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 3 ,imageTimeout:98222},
        jsPDF: { unit: "pt", format: "letter", orientation: "portrait" },
        pagebreak: { mode: "avoid-all", before: ".pagebreak" },
      };
      html2pdf().from(invoice).set(opt).save();

      setTimeout(() => {

        this.progressBar = false;
        pageBreaks.forEach(el=>{
            el.classList.add('pagenumber1');

        })
      }, 3311);

      debugger;

    
     

      // html2canvas(invoice).then(function(canvas){
      //   const imgData = canvas.toDataURL('image/png');
      //   const doc = new jsPDF();
      //   doc.addImage(imgData,'PNG',10,10);
      //   doc.save('testpdf.pdf');
      // })
    },
    displaySummaryValue: function(value){
      const valueInNumber = Math.floor(+value) +'';
      //return `${ valueInNumber}% ${valueInNumber > 0?'Increase':'Reduction'}`;
      return valueInNumber.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    },
    displayNumberWithComma: value=>{
      return valueInNumber.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }
  },
});

//////////////////////////RENDER CHARTS/////////////////////////////////////////////////////

const parCountData = [
  {
    countTick: "Total Rec. PAR Items",
    count: args.countRecommended,
    color: "rgb(36, 36, 36)",
  },
  {
    countTick: "New PAR Items",
    count: args.countAddRec,
    color: "rgb(36, 36, 36)",
  },
  {
    countTick: "Removed PAR Items",
    count: args.countRemoveRec,
    color: "rgb(36, 36, 36)",
  },
  {
    countTick: "Baseline PAR Items",
    count: args.countBaseline,
    color: "rgb(36, 36, 36)",
  },
];

const parValueData = [
  {
    valueTick: "Total Rec. Value",
    value: Math.floor(+args.valueRecommended),
    color: "rgb(36, 36, 36)",  //"rgb(244, 90 ,16)",
  },
  {
    valueTick: "New Value",
    value: Math.floor(+args.valueAddRec),
    color: "rgb(36, 36, 36)",
  },
  {
    valueTick: "Baseline Value Change",
    value: Math.floor(+args.valueChangedRec),
    color: "rgb(36, 36, 36)",
  },

  {
    valueTick: "Baseline Value",
    value: Math.floor(+args.valueBaseline),
    color: "rgb(36, 36, 36)",
  },
];

function rgbToRgba(rgb, alpha = 1) {
  return `rgba(${rgb
    .substring(rgb.indexOf("(") + 1, rgb.length - 1)
    .split(",")
    .join()}, ${alpha})`;
}

function formatNumber(value){
  //const number = +value;
  // const number = Math.floor(+value);
  // let stringNumber = number + '';
  value = value + '';
  //debugger;
  return value.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}



// Chart.defaults.global.defaultFontFamily =  '"Comic Sans MS", cursive, sans-serif';
// Chart.defaults.global.defaultFontSize = 13;
//Chart.defaults.global.legend = {enabled: false};
Chart.Tooltip.positioners.custom = function(elements, eventPosition) {
  /** @type {Chart.Tooltip} */
  var tooltip = this;

  /* ... */

  return {
      x: eventPosition.x,
      y: eventPosition.y
  };
}

const parCountChart = document.getElementById("chart").getContext("2d");

const parItemCountChart = new Chart(parCountChart, {
  type: "horizontalBar",
  data: {
    labels: parCountData.map((item) => item.countTick),
    //data_Sets
    datasets: [
      {
        label: "value: ",
        data: parCountData.map((item) => item.count),
        backgroundColor: parCountData.map((item) =>
          rgbToRgba(item.color, 0.25)
        ),
        borderWidth: 3,
      },
    ],
  },
  options: {
    plugins: {
      datalabels: {
        color: "black",
        clamp:true,
        clip:true,
        anchor:'end',
        font:{
          size:14,
        },
        formatter: (value,ctx) =>{
          return formatNumber(value);
        },
        labels: {
          title: {
            font: {
              weight: "bold",
              // size: 30,
            },
          },
          value: {
            color: "green",
          },
        },
        // align: "end",
      },
    },
    scales: {
      xAxes: [
        {
          ticks: {
              beginAtZero: true,
              color:"black",
              // format the numbers with comma
              callback: function(value, index, values) {
                return formatNumber(value);
              }
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontColor: '#333', //"#e17232",
            fontStyle:'bold',

          },
        },
      ],
    },
    tooltips: { 
      mode: 'nearest',
      position: 'average',
      intersect: false,
      callbacks:{
        label: function(tooltipItem,data){
          //debugger;
          let label = data.datasets[tooltipItem.datasetIndex].label || '';
          const countInNumber = parCountData[tooltipItem.index].count;
          const count = formatNumber(Math.abs(countInNumber));
          if(label){
            label += countInNumber < 0 ? count + ' Reduction': count;
          }
          return label;
        }
      }
    
    },
    title: {
      display: true,
      text: "PAR Count Insights",
      fontColor: "#333",
      fontSize: 20,
      padding: 5,
    },
    legend: {
      display: false,
      position: "right",
    },
  },
});

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const simplePlugin = {
  
  // This is called at the start of a render. It is only called once, even if the animation will run for a number of frames. Use beforeDraw or afterDraw
  // to do something on each animation frame
  beforeDraw: function(chartInstance) {
    //debugger;
    chartInstance.titleBlock.right = 190;
  }

};

// Let Chart.js know about the new plugin
//Chart.plugins.unregister(ChartDataLabels);
Chart.pluginService.register(simplePlugin);





const parItemValueContext = document.getElementById("par_item_value_chart").getContext("2d");
// parItemValueContext.canvas.style.height = '320px';
// parItemValueContext.canvas.style.width = '800px';
//parItemValueContext.titleBlock.right = 200;
//Chart.plugins.unregister(ChartDataLabels);

const parItemValueChart = new Chart(parItemValueContext, {
  type: "horizontalBar",
  data: {
    labels: parValueData.map((item) => item.valueTick),
    //data_Sets
    datasets: [
      {
        label: "value: $",
        data: parValueData.map((item) => item.value),
        backgroundColor: parValueData.map((item) =>
          rgbToRgba(item.color, 0.25)
        ),
        borderWidth: 3,
      },
    ],
  },
  options: {
    plugins: {
      datalabels: {
        color: "black",
        clamp:true,
        clip:true,
        anchor:'end',
        align:'start',
        offset: -10,
        // borderWidth:1,
        // borderColor:'blue',
        borderRadius:25,
        // backgroundColor: (context)=> context.dataset.backgroundColor ,
        font:{
          size:14,
        },
        formatter: (value,ctx) =>{
          return formatNumber(value);
        },
        labels: {
          title: {
            font: {
              weight: "bold",
              // size: 30,
            },
          },
          value: {
            color: "green",
          },
        },
        // align: "end",
      },
    },
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              //debugger;
              return "$" + formatNumber(value);
            },
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontColor: "#333",
            fontStyle: "bold",
          },
        },
      ],
    },
    tooltips: {
      mode: "nearest",
      position: "average",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          //debugger;
          let label = data.datasets[tooltipItem.datasetIndex].label || "";
          const valueInNumber = parValueData[tooltipItem.index].value;
          const value = formatNumber(valueInNumber);
          if (label) {
            label += valueInNumber < 0 ? value + " Reduction" : value;
          }
          return label;
        },
      },
    },
    title: {
      display: true,
      text: "PAR Value Insights",
      fontColor: "rgb(146 0 0)",
      fontSize: 20,
      padding: 5,
      align: "end",
      position: "top",
    },
    legend: {
      display: false,
      position: "right",
    },
  },
});

