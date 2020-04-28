function render(datasourceStr, descripe, mode) {
  const keeps = {};

  const datasource = datasourceStr
    .split("\n")
    .map((str) => {
      const array = str.replace(/\s/g, "").split(",");
      if (array.length < 2) return undefined;
      const [start, end, line] = array;
      return { start, end, line: line || "0" };
    })
    .filter((d) => d);
  document.getElementById("textarea").value = datasource
    .filter(function (d) {
      var str = JSON.stringify(d);
      if (keeps[str]) return false;
      keeps[str] = 1;
      return true;
    })
    .map(function (d) {
      return `${d.start},${d.end},${d.line}`;
    })
    .join("\n");
  const data = datasource.reduce(
    function (data, record) {
      if ("remove-edge" == mode && record.line === "1") return data;
      if (!keeps[record.start]) {
        keeps[record.start] = true;
        var start = record.start + "";
        data.nodes.push({ label: start, id: start });
      }
      if (!keeps[record.end]) {
        keeps[record.end] = true;
        var end = record.end + "";
        data.nodes.push({ label: end, id: end });
      }

      data.edges.push({
        source: record.start + "",
        target: record.end + "",
        color: record.line === "1" ? "#f00" : "#fff",
      });
      return data;
    },
    { nodes: [], edges: [] }
  );
  const container = document.getElementById("container");
  container.innerHTML = `<div id="tip" class="tip">${descripe}</div>`;
  const width = container.clientWidth;
  const height = container.clientHeight;

  const minimap = new G6.Minimap({
    size: [150, 100],
  });

  const graph = new G6.Graph({
    plugins: [minimap],
    modes: {
      default: ["drag-canvas", "drag-node", "zoom-canvas"],
    },
    container: "container",
    fitView: true,
    width,
    height,
    layout: {
      type: "dagre",
      rankdir: "LR",
      align: "DL",
      center: [width / 2, height / 2],
      nodesepFunc: () => 1,
      ranksepFunc: () => 1,
    },
    defaultNode: {
      // type: "circle",
      // size: [160],
      // style: {
      //   fill: "#fff",
      //   lineWidth: 1,
      // },
      type: "rect",
      size: [50, 30],
      style: {
        fill: "#9EC9FF",
        stroke: "#5B8FF9",
        lineWidth: 1,
      },
      labelCfg: {
        style: {
          fill: "#fff",
          fontSize: 18,
        },
      },
      linkPoints: {
        top: false,
        right: true,
        bottom: false,
        left: true,
        // circle的大小
        size: 3,
        lineWidth: 1,
        fill: "#fff",
        stroke: "#5B8FF9",
      },
    },
    defaultEdge: {
      size: 2,
      color: "#fff",
      style: {
        endArrow: {
          path: "M 0,0 L 8,4 L 8,-4 Z",
        },
      },
    },
    maxZoom: 1,
  });
  graph.data(data);
  graph.render();
  window.graph = graph;

  // $(".fixed1")
  //   .html(
  //     '<input id="ex1" data-slider-id="ex1Slider" type="text" data-slider-min="' +
  //       graph.getZoom() +
  //       '" data-slider-max="10" data-slider-step="1" data-slider-value="1"/>'
  //   )
  //   .find("#ex1")
  //   .slider({
  //     formatter: function (value) {
  //       return "Current value: " + value;
  //     },
  //   })
  //   .change(function (event) {
  //     graph.zoom(event.value.newValue);
  //   });
}

/**
 * 循环生成节点数组
 *
 * 注意：结束节点不配置，生成串联数据
 * generate([1, 2, 3]) => [{1, 2}, {2, 3}]
 *
 * @param {number / number[]} startOrStarts 开始节点
 * @param {number / number[]} endOrEnds  结束节点
 */
function generate(startOrStarts, endOrEnds) {
  const starts =
    startOrStarts instanceof Array ? startOrStarts : [startOrStarts];
  if (arguments.length == 1) {
    var array = [];
    starts.reduce(function (start, end) {
      array.push({ start: start, end: end });
      return end;
    });
    return array;
  }

  const ends = endOrEnds instanceof Array ? endOrEnds : [endOrEnds];
  return starts.reduce(function (array, start) {
    return ends.reduce(function (array, end) {
      array.push({ start: start, end: end });
      return array;
    }, array);
  }, []);
}

$(".dropdown-menu a").click(function () {
  console.log($(this).text());
  $("#dpbtn").text($(this).text());
});
