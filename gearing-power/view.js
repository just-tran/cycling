var gStock = {
  tableGearing: document.createElement("table"),
  tablePower: document.createElement("table"),
  trPlain: document.createElement("tr"),
  tdPlain: document.createElement("td"),
  tdSpacer: document.createElement("td"),
  tdEmpty: document.createElement("td"),
  tdData: document.createElement("td"),
  tdHeadingRatio: document.createElement("td"),
  tdHeadingSpeedFromCadence: document.createElement("td"),
  tdHeadingCadenceAtSpeed: document.createElement("td"),
  tdHeadingTorqueFromCadence: document.createElement("td"),
  tdHeadingSpeedFromGrade: document.createElement("td"),
  tdHeading: document.createElement("td"),
  tdHeadingIndex: document.createElement("td"),
  trSpacer: document.createElement("tr"),
  spanEmoji: document.createElement("span"),
  divPlain: document.createElement("div"),
  divDogEar: document.createElement("div"),
  divTdPopoverRatio: document.createElement("div"),
  divTdPopoverSpeedFromCadence: document.createElement("div"),
  divTdPopoverCadenceAtSpeed: document.createElement("div"),
  divTdPopoverTorqueFromCadence: document.createElement("div"),
  divTdPopoverSpeedFromGrade: document.createElement("div"),
};
gStock.tableGearing.className = "gearing";
gStock.tablePower.className = "power";
gStock.tdSpacer.className = "spacer";
gStock.tdEmpty.className = "empty";
gStock.tdData.className = "data";
gStock.tdHeadingRatio.className = "heading-ratio";
gStock.tdHeadingSpeedFromCadence.className = "heading-speed-from-cadence";
gStock.tdHeadingCadenceAtSpeed.className = "heading-cadence-from-speed";
gStock.tdHeadingTorqueFromCadence.className = "heading-torque-from-cadence";
gStock.tdHeadingSpeedFromGrade.className = "heading-speed-from-grade";
gStock.tdHeading.className = "heading";
gStock.tdHeadingIndex.className = "heading-index";
gStock.trSpacer.appendChild(gStock.tdSpacer.cloneNode());
gStock.spanEmoji.className = "emoji";
gStock.divDogEar.className = "dog-ear";
gStock.divTdPopoverRatio.classList.add("td-pop-over");
gStock.divTdPopoverRatio.classList.add("heading-ratio");
gStock.divTdPopoverSpeedFromCadence.classList.add("td-pop-over");
gStock.divTdPopoverSpeedFromCadence.classList.add("heading-speed-from-cadence");
gStock.divTdPopoverCadenceAtSpeed.classList.add("td-pop-over");
gStock.divTdPopoverCadenceAtSpeed.classList.add("heading-cadence-from-speed");
gStock.divTdPopoverTorqueFromCadence.classList.add("td-pop-over");
gStock.divTdPopoverTorqueFromCadence.classList.add("heading-torque-from-cadence");
gStock.divTdPopoverSpeedFromGrade.classList.add("td-pop-over");
gStock.divTdPopoverSpeedFromGrade.classList.add("heading-speed-from-grade");

//////////////////////////////////////////////////////////////////////////////

function colorGridByGearIndex (cellGrid, dataGrid, gearIndexByChainring) {
  let even = new Set();

  // Arrays are zero-based, but humans are one-based, so odd row indexes are considered even
  for (let i = 1; i < gearIndexByChainring.length; i += 2) {
    for (let j = 0; j < gearIndexByChainring[i].length; ++j) {
      even.add(gearIndexByChainring[i][j]);
    }
  }

  for (let i = 0; i < dataGrid.length; ++i) {
    for (let j = 0; j < dataGrid[i].length; ++j) {
      if (dataGrid[i].hasOwnProperty(j)) {
        if (even.has(dataGrid[i][j])) {
          cellGrid[i][j].classList.add("index-even");
        } else {
          cellGrid[i][j].classList.add("index-odd");
        }
      }
    }
  }
}

function colorRatioGridConditionally (cellGrid, predicateGrid) {
  for (let i = 0; i < cellGrid.length; ++i) {
    for (let j = 0; j < cellGrid[i].length; ++j) {
      if (predicateGrid.hasOwnProperty(i) &&
        predicateGrid[i].hasOwnProperty(j))
      {
        cellGrid[i][j].classList.add("ratio-selected");
      } else {
        cellGrid[i][j].classList.add("ratio-unselected");
      }
    }
  }
}

function colorGridsByRatio (cellGrids, dataGrid) {
  colorGradient50Percentile(cellGrids, dataGrid, ["grad-pos-low", "grad-pos-middle", "grad-pos-high"]);
}

function colorGridsBySpeed (cellGrids, dataGrid) {
  colorGradient(cellGrids, dataGrid, true, [
      [5, "grad-neg-low"],
      [13, "grad-neg-middle"],
      [30, "grad-neg-high"],
    ]);
}

function colorGridsByCadence (cellGrids, dataGrid) {
  colorGradient(cellGrids, dataGrid, true, [
      [0, "grad-neg-low"],
      [90, "grad-neg-middle"],
      [120, "grad-neg-high"],
      [200, "grad-neg-dead"],
    ]);
}

function colorGridsByCadenceZone (cellGrids, dataGrid) {
  if (gSwitches.cadenceStripe.value) {
    colorGradient(cellGrids, dataGrid, false, [
        [gConfig.cadenceRpm.value - gConfig.toleranceRpm.value, "grad-cadence-low"],
        [gConfig.cadenceRpm.value + gConfig.toleranceRpm.value, "grad-cadence-high"],
      ]);
  }
}

function colorGridsByWheelTorque (cellGrids, dataGrid) {
  colorGradient50Percentile(cellGrids, dataGrid, ["grad-neg-low", "grad-neg-middle", "grad-neg-high"]);
}

function colorGridsByPowerZone (cellGrids, dataGrid) {
  if (gSwitches.burstStripe.value) {
    colorGradient(cellGrids, dataGrid, false, [
        [gPowerBurst.low, "grad-burst-low"],
        [gPowerBurst.high, "grad-burst-high"],
        [gPowerBurst.dead, "grad-burst-dead"],
      ]);
  }
  if (gSwitches.powerStripe.value) {
    colorGradient(cellGrids, dataGrid, false, [
        [gPowerZone[2], "grad-ftp-zone2"],
        [gPowerZone[3], "grad-ftp-zone3"],
        [gPowerZone[4], "grad-ftp-zone4"],
        [gPowerZone[5], "grad-ftp-zone5"],
        [gPowerZone[7], "grad-ftp-high"],
      ]);
  }
}

function formatCadenceCells (cells) {
  for (let i = 0; i < cells.length; ++i) {
    for (let j = 0; j < cells[i].length; ++j) {
      cells[i][j].classList.add("cadence");
    }
  }
}

function formatPowerCells (cells) {
  for (let i = 0; i < cells.length; ++i) {
    for (let j = 0; j < cells[i].length; ++j) {
      cells[i][j].classList.add("power");
    }
  }
}

function formatForceCells (cells) {
  for (let i = 0; i < cells.length; ++i) {
    for (let j = 0; j < cells[i].length; ++j) {
      cells[i][j].classList.add("force");
    }
  }
}

function formatGearIndexCells (cells) {
  for (let i = 0; i < cells.length; ++i) {
    for (let j = 0; j < cells[i].length; ++j) {
      cells[i][j].classList.add("index");
    }
  }
}

function handlePopoverEnter (eventInfo) {
  var target = eventInfo.currentTarget;
  var child = target.lastChild;

  child.style.display = "";
  targetStyle = window.getComputedStyle(target);
  childStyle = window.getComputedStyle(child);

  targetHeight = parseInt(targetStyle.height, 10);
  childHeight = parseInt(childStyle.height, 10);
  if (targetHeight > childHeight) {
    child.style.height = targetStyle.height;
  }

  targetWidth = parseInt(targetStyle.width, 10);
  childWidth = parseInt(childStyle.width, 10);
  if (targetWidth > childWidth) {
    child.style.width = targetStyle.width;
  }
}

function handlePopoverLeave (eventInfo) {
  // Once this node is hidden, it can trigger the underlying node, which might
  // unhide this node!  So stop the event propogation now.
  eventInfo.stopPropagation();

  eventInfo.currentTarget.style.display = "none";
}

function addPopover (parentNode, popoverNode) {
  parentNode.appendChild(gStock.divDogEar.cloneNode());
  parentNode.appendChild(popoverNode);
  parentNode.addEventListener("mouseover", handlePopoverEnter);

  popoverNode.style.display = "none";
  popoverNode.addEventListener("mouseout", handlePopoverLeave);
  // Handle click event for touch-based devices
  popoverNode.addEventListener("click", handlePopoverLeave);
}

function addEmoji (node, kind) {
  var code;
  if (kind == "gear") {
    code = "&#x2699;&#xFE0F;";
  } else if (kind == "bike") {
    code = "&#x1F6B4;";
  } else if (kind == "circle") {
    code = "&#x1F504;";
  } else if (kind == "scale") {
    code = "&#x2696;&#xFE0F;";
  } else if (kind == "wrench") {
    code = "&#x1F527;";
  } else if (kind == "mountain") {
    code = "&#x26F0;&#xFE0F;";
  }
  var span = node.appendChild(gStock.spanEmoji.cloneNode());
  span.innerHTML = code;
}

function buildGridsAndFormatters (info) {
  let grids = [];
  let formatters = [];
  let indexes = [];
  for (let i = 0; i < info.length; ++i) {
    let [enabled, grid, formatter, primary] = info[i];
    if (enabled) {
      grids.push(grid);
      formatters.push(
        (x) => formatter(
          x,
          primary ?
            gSwitches.primaryUnits.value :
            gSwitches.secondaryUnits.value));
      indexes[i] = grids.length - 1;
    }
  }
  return [grids, formatters, indexes];
}

function buildGearingTable (gearing) {
  var table;
  var trHeading;
  var tdMajor, tdMinor;
  var div;
  var cells;

  //////////////////////////////////////////////////////////////////////////////

  table = gStock.tableGearing.cloneNode();

  //////////////////////////////////////////////////////////////////////////////

  trHeading = table.appendChild(gStock.trPlain.cloneNode());
  trHeading.appendChild(gStock.tdSpacer.cloneNode());
  trHeading.appendChild(gStock.tdSpacer.cloneNode());

  tdMinor = [];
  for (let i = 0; gCogsCluster[i]; ++i) {
    let td = gStock.tdHeading.cloneNode();
    td.appendChild(document.createTextNode(formatCogTeeth(gCogsCluster[i])));
    tdMinor.push(td);
    trHeading.appendChild(td);
  }
  formatLabelCellsHorizontal(tdMinor);

  //////////////////////////////////////////////////////////////////////////////

  tdMinor = [];
  for (let i = 0; i < gCogsChainring.length; ++i) {
    let td = gStock.tdHeading.cloneNode();
    td.appendChild(document.createTextNode(formatCogTeeth(gCogsChainring[i])));
    tdMinor.push(td);
  }
  formatLabelCellsVertical(tdMinor);

  if (gSwitches.gearing_table.value) {
    table.appendChild(gStock.trSpacer.cloneNode(true));

    tdMajor = gStock.tdHeadingRatio.cloneNode();
    addEmoji(tdMajor, "gear");
    div = gStock.divTdPopoverRatio.cloneNode();
    div.innerHTML =
      "<div>" +
      "<h2>Exploring</h2>" +
      "What are the unique gear combinations?" +
      "<h2>Available rows</h2>" +
      "<ul>" +
      '<li><span id="gearing_indexes"></span>' +
      "<li>Ratio (Front &divide; Rear)" +
      '<li><span id="gearing_inches"></span>' +
      '<li><span id="gearing_speed"></span>' +
      "</ul>" +
      "</div>";
    addPopover(tdMajor, div);

    let [grids, formatters, indexes] =
      buildGridsAndFormatters([
          [gSwitches.gearing_indexes.value, gearing.gearIndexGridByChainringAndCluster, formatNone, false],
          [true, gearing.ratioGridByChainringAndCluster, formatRatio, true],
          [gSwitches.gearing_inches.value, gearing.gearInchesGridByChainringAndCluster, formatGearInches, true],
          [gSwitches.gearing_speed.value, gearing.speedGridByChainringAndCluster, formatSpeed, false],
        ]);
    let [nums, ratios, inches, speeds] = indexes;

    cells = addInterleavedRows(table, tdMajor, tdMinor, gCogsCluster.length, grids, formatters);

    if (nums >= 0) {
      colorGridByGearIndex(cells[nums], gearing.gearIndexGridByChainringAndCluster, gearing.gearIndexGridByChainringAndCluster);
      formatGearIndexCells(cells[nums]);
    }
    if (speeds >= 0) {
      colorRatioGridConditionally(cells[speeds], gearing.gearIndexGridByChainringAndCluster);
      colorGridsByRatio([cells[speeds]], gearing.ratioGridByChainringAndCluster);
    }
    if (inches >= 0) {
      colorRatioGridConditionally(cells[inches], gearing.gearIndexGridByChainringAndCluster);
      colorGridsByRatio([cells[inches]], gearing.ratioGridByChainringAndCluster);
    }
    if (ratios >= 0) {
      colorRatioGridConditionally(cells[ratios], gearing.gearIndexGridByChainringAndCluster);
      colorGridsByRatio([cells[ratios]], gearing.ratioGridByChainringAndCluster);
    }
    formatCellGridsGroupsConditionally(cells, gearing.gearIndexGridByChainringAndCluster);
  }

  //////////////////////////////////////////////////////////////////////////////

  if (gSwitches.speedAtCadence_table.value) {
    table.appendChild(gStock.trSpacer.cloneNode(true));

    tdMajor = gStock.tdHeadingSpeedFromCadence.cloneNode();
    addEmoji(tdMajor, "bike");
    div = gStock.divTdPopoverSpeedFromCadence.cloneNode();
    div.innerHTML =
      "<div>" +
      "<h2>Exploring</h2>" +
      "How fast can I ride at my preferred cadence?" +
      "<h2>Available rows</h2>" +
      "<ul>" +
      '<li><span id="speedAtCadence_force"></span>' +
      '<li><span id="speedAtCadence_power"></span>' +
      '<li>Speed (MPH)' +
      "</ul>" +
      "<h2>Fixed at</h2>" +
      "<ul>" +
      "<li>" + gConfig.cadenceRpm.value + " RPM" +
      "</ul>" +
      "<div>";
    addPopover(tdMajor, div);

    tdMinor = cloneNodeArray(tdMinor)

    let [grids, formatters, indexes] = buildGridsAndFormatters([
      [gSwitches.speedAtCadence_force.value, gearing.legForceGridByChainringAndCluster, formatForce, false],
      [gSwitches.speedAtCadence_power.value, gearing.legPowerGridByChainringAndCluster, formatPower, false],
      [true, gearing.speedGridByChainringAndCluster, formatSpeed, true]]);
    let [force, power] = indexes;

    cells = addInterleavedRows(table, tdMajor, tdMinor, gCogsCluster.length, grids, formatters);

    colorGridsBySpeed(cells, gearing.speedGridByChainringAndCluster);
    colorGridsByPowerZone(cells, gearing.legPowerGridByChainringAndCluster);
    if (force >= 0) {
      formatForceCells(cells[force]);
    }
    if (power >= 0) {
      formatPowerCells(cells[power]);
    }
    formatCellGridGroups(cells);
  }

  //////////////////////////////////////////////////////////////////////////////

  if (gSwitches.cadenceAtSpeed_table.value) {
    table.appendChild(gStock.trSpacer.cloneNode(true));

    tdMajor = gStock.tdHeadingCadenceAtSpeed.cloneNode();
    addEmoji(tdMajor, "circle");
    div = gStock.divTdPopoverCadenceAtSpeed.cloneNode();
    div.innerHTML =
      "<div>" +
      "<h2>Exploring</h2>" +
      "How fast do I have to pedal at my preferred cruising speed?" +
      "<h2>Available rows</h2>" +
      "<ul>" +
      "<li>Cadence (RPM)" +
      "</ul>" +
      "<h2>Fixed at</h2>" +
      "<ul>" +
      "<li>" + gConfig.speedMph.value + " MPH" +
      "</ul>" +
      "<div>";
    addPopover(tdMajor, div);

    tdMinor = cloneNodeArray(tdMinor)

    let [grids, formatters] = buildGridsAndFormatters([
      [true, gearing.cadenceGridByChainringAndCluster, formatCadence, true]]);

    cells = addInterleavedRows(table, tdMajor, tdMinor, gCogsCluster.length, grids, formatters);

    colorGridsByCadence(cells, gearing.cadenceGridByChainringAndCluster);
    colorGridsByCadenceZone(cells, gearing.cadenceGridByChainringAndCluster);
    formatCellGridGroups(cells);
  }

  //////////////////////////////////////////////////////////////////////////////

  if (gSwitches.torqueAtCadence_table.value) {
    table.appendChild(gStock.trSpacer.cloneNode(true));

    tdMajor = gStock.tdHeadingTorqueFromCadence.cloneNode();
    addEmoji(tdMajor, "wrench");
    div = gStock.divTdPopoverTorqueFromCadence.cloneNode();
    div.innerHTML =
      "<div>" +
      "<h2>Exploring</h2>" +
      "How much of my torque is delivered to the ground?" +
      "<h2>Available rows</h2>" +
      "<ul>" +
      '<li><span id="torqueAtCadence_force"></span>' +
      "<li>Wheel Torque (lb-ft)" +
      "</ul>" +
      "<h2>Fixed at</h2>" +
      "<ul>" +
      "<li>" + gConfig.cadenceRpm.value + " RPM" +
      "</ul>" +
      "</div>";
    addPopover(tdMajor, div);

    tdMinor = cloneNodeArray(tdMinor)

    let [grids, formatters, indexes] = buildGridsAndFormatters([
      [gSwitches.torqueAtCadence_force.value, gearing.legForceGridByChainringAndCluster, formatForce, false],
      [true, gearing.wheelTorqueGridByChainringAndCluster, formatTorque, true]]);
    let [force] = indexes;

    cells = addInterleavedRows(table, tdMajor, tdMinor, gCogsCluster.length, grids, formatters);

    colorGridsByWheelTorque(cells, gearing.wheelTorqueGridByChainringAndCluster);
    if (force >= 0) {
      formatForceCells(cells[force]);
    }
    formatCellGridGroups(cells);
  }

  //////////////////////////////////////////////////////////////////////////////

  var gearingDiv = document.getElementById("gearing-div")
  purgeChildren(gearingDiv);
  gearingDiv.appendChild(table);
}

function buildPowerTable (gearing) {
  var table;
  var trHeading, tdMajor, tdMinor;
  var span;
  var cells;

  var numGears = gearing.ratioSchmoo.length;

  //////////////////////////////////////////////////////////////////////////////

  table = gStock.tablePower.cloneNode();

  //////////////////////////////////////////////////////////////////////////////

  tdMajor = gStock.tdSpacer.cloneNode();

  tdMinor = gStock.tdHeadingIndex.cloneNode();
  tdMinor.appendChild(document.createTextNode("Index"));

  let gearNumbers = [];
  for (let i = 1; i <= numGears; ++i) {
    gearNumbers.push(i);
  }

  cells = [];
  cells[0] = [addRow(table, tdMajor, tdMinor, gearNumbers, formatNone)];
  colorGridByGearIndex(cells[0], [gearNumbers], gearing.gearIndexGridByChainringAndCluster);

  //////////////////////////////////////////////////////////////////////////////

  tdMajor = gStock.tdSpacer.cloneNode();

  tdMinor = gStock.tdHeadingRatio.cloneNode();
  tdMinor.appendChild(document.createTextNode("Ratio"));

  cells[1] = [addRow(table, tdMajor, tdMinor, gearing.ratioSchmoo, formatRatio)];
  colorGridsByRatio([cells[1]], [gearing.ratioSchmoo]);

  //////////////////////////////////////////////////////////////////////////////

  formatCellGridGroups(cells);

  //////////////////////////////////////////////////////////////////////////////

  if (gSwitches.speedByCadence_table.value) {
    table.appendChild(gStock.trSpacer.cloneNode(true));

    tdMajor = gStock.tdHeadingSpeedFromCadence.cloneNode();
    addEmoji(tdMajor, "bike");
    div = gStock.divTdPopoverSpeedFromCadence.cloneNode();
    div.innerHTML =
      "<div>" +
      "<h2>Exploring</h2>" +
      "How fast can I ride over my range of preferred cadences?" +
      "<h2>Available rows</h2>" +
      "<ul>" +
      '<li><span id="speedByCadence_force"></span>' +
      '<li><span id="speedByCadence_power"></span>' +
      "<li>Speed (MPH)" +
      "</ul>" +
      "<h2>Swept over</h2>" +
      "<ul>" +
      "<li>Cadence (RPM)" +
      "</ul>" +
      "</div>";
    addPopover(tdMajor, div);

    tdMinor = [];
    for (let i = 0; i < gCadenceSchmoo.length; ++i) {
      let td = gStock.tdHeading.cloneNode();
      td.appendChild(document.createTextNode(formatCadence(gCadenceSchmoo[i])));
      tdMinor.push(td);
    }
    formatLabelCellsVertical(tdMinor);

    let [grids, formatters, indexes] = buildGridsAndFormatters([
      [gSwitches.speedByCadence_force.value, gLegForceByCadenceAndRatio, formatForce, false],
      [gSwitches.speedByCadence_power.value, gLegPowerByCadenceAndRatio, formatPower, false],
      [true, gSpeedByCadenceAndRatio, formatSpeed, true]]);
    let [force, power] = indexes;

    cells = addInterleavedRows(table, tdMajor, tdMinor, numGears, grids, formatters);

    colorGridsBySpeed(cells, gSpeedByCadenceAndRatio);
    colorGridsByPowerZone(cells, gLegPowerByCadenceAndRatio);
    if (force >= 0) {
      formatForceCells(cells[force]);
    }
    if (power >= 0) {
      formatPowerCells(cells[power]);
    }
    formatCellGridGroups(cells);
  }

  //////////////////////////////////////////////////////////////////////////////

  if (gSwitches.cadenceBySpeed_table.value) {
    table.appendChild(gStock.trSpacer.cloneNode(true));

    tdMajor = gStock.tdHeadingCadenceAtSpeed.cloneNode();
    addEmoji(tdMajor, "circle");
    div = gStock.divTdPopoverCadenceAtSpeed.cloneNode();
    div.innerHTML =
      "<div>" +
      "<h2>Exploring</h2>" +
      "How fast do I have to pedal over my range of my preferred speeds?" +
      "<h2>Available rows</h2>" +
      "<ul>" +
      "<li>Cadence (RPM)" +
      "</ul>" +
      "<h2>Swept over</h2>" +
      "<ul>" +
      "<li>Speed (MPH)" +
      "</ul>" +
      "</div>";
    addPopover(tdMajor, div);

    tdMinor = [];
    for (let i = 0; i < gSpeedSchmoo.length; ++i) {
      let td = gStock.tdHeading.cloneNode();
      td.appendChild(document.createTextNode(formatSpeed(gSpeedSchmoo[i])));
      tdMinor.push(td);
    }
    formatLabelCellsVertical(tdMinor);

    let [grids, formatters] = buildGridsAndFormatters([
      [true, gCadenceBySpeedAndRatio, formatCadence, true]]);

    cells = addInterleavedRows(table, tdMajor, tdMinor, numGears, grids, formatters)
    colorGridsByCadence(cells, gCadenceBySpeedAndRatio);
    colorGridsByCadenceZone(cells, gCadenceBySpeedAndRatio);
    formatCellGridGroups(cells);
  }

  //////////////////////////////////////////////////////////////////////////////

  if (gSwitches.speedByGrade_table.value) {
    table.appendChild(gStock.trSpacer.cloneNode(true));

    tdMajor = gStock.tdHeadingSpeedFromGrade.cloneNode();
    addEmoji(tdMajor, "mountain");
    div = gStock.divTdPopoverSpeedFromGrade.cloneNode();
    div.innerHTML =
      "<div>" +
      "<h2>Exploring</h2>" +
      "<p>How fast can I ride on long stretches of road with steady " +
      "grades while sustaining high power at feasible cadences?" +
      "<p>(In other words, how much of the gear range can I use for " +
      "long steady road segments?)" +
      "<h2>Available rows</h2>" +
      "<ul>" +
      '<li><span id="speedByGrade_cadence"></span> (' + gConfig.cadenceRpmMin.value + " &ndash; " + gConfig.cadenceRpmMax.value + " RPM)" +
      '<li><span id="speedByGrade_force"></span>' +
      '<li><span id="speedByGrade_power"></span>' +
      "<li>Speed (MPH)" +
      "</ul>" +
      "<h2>Swept over</h2>" +
      "<ul>" +
      "<li>Grade (%)" +
      "</ul>" +
      "</div>";
    addPopover(tdMajor, div);

    tdMinor = [];
    for (let i = 0; i < gGradeSchmoo.length; ++i) {
      let td = gStock.tdHeading.cloneNode();
      td.appendChild(document.createTextNode(formatPercent(gGradeSchmoo[i])));
      tdMinor.push(td);
    }
    formatLabelCellsVertical(tdMinor);

    let [grids, formatters, indexes] = buildGridsAndFormatters([
      [gSwitches.speedByGrade_cadence.value, gCadenceByGradeAndRatio, formatCadence, false],
      [gSwitches.speedByGrade_force.value, gLegForceByGradeAndRatio, formatForce, false],
      [gSwitches.speedByGrade_power.value, gLegPowerByGradeAndRatio, formatPower, false],
      [true, gSpeedByGradeAndRatio, formatSpeed, true]]);
    let [cadence, force, power] = indexes;

    cells = addInterleavedRows(table, tdMajor, tdMinor, numGears, grids, formatters);

    colorGridsBySpeed(cells, gSpeedByGradeAndRatio);
    colorGridsByPowerZone(cells, gLegPowerByGradeAndRatio);
    colorGridsByCadenceZone(cells, gCadenceByGradeAndRatio, false);
    if (cadence >= 0) {
      formatCadenceCells(cells[cadence]);
    }
    if (force >= 0) {
      formatForceCells(cells[force]);
    }
    if (power >= 0) {
      formatPowerCells(cells[power]);
    }
    formatCellGridGroups(cells);
  }

  //////////////////////////////////////////////////////////////////////////////

  var powerDiv = document.getElementById("power-div")
  purgeChildren(powerDiv);
  powerDiv.appendChild(table);
}

//////////////////////////////////////////////////////////////////////////////

function wrapFocus () {
  document.getElementById("firstField").focus();
}

function buildFocusWrap (node) {
  node.id = "firstField";

  // TODO: Doesn't handle <Shift-Tab>
  let dummy = document.getElementById("dummyBox");
  dummy.tabIndex = 0;
  // NOTE: Don't use anonymous functions because those will leak handlers
  dummy.addEventListener("focus", wrapFocus);
}

function handleInputBox (eventInfo) {
  var isChange = (eventInfo.type == "change");
  var isEnter = (eventInfo.type == "keypress" && eventInfo.key == "Enter");
  if (isChange || isEnter) {
    let converted = Number(eventInfo.currentTarget.value);
    if (!isNaN(converted)) {
      gConfig[eventInfo.currentTarget.parentNode.id].value = converted;
      refresh();
    }
  }
}

function buildInputBox (content, order, step) {
  var box = document.createElement("input");
  box.type = "number";
  box.value = content;
  box.step = step;
  box.addEventListener("keypress", handleInputBox);
  box.addEventListener("change", handleInputBox);
  if (order) {
    box.tabIndex = order;
  }
  return box;
}

function handleSelect (eventInfo) {
  gConfig[eventInfo.currentTarget.parentNode.id].value = eventInfo.currentTarget.value;
  refresh();
}

function buildDropdownList (choices, order, value) {
  var select = document.createElement("select");
  select.addEventListener("change", handleSelect);
  if (order) {
    select.tabIndex = order;
  }

  if ((choices instanceof Array) && (choices[0] instanceof Array)) {
    for (let i = 0; i < choices.length; ++i) {
      let [groupName, subchoices] = choices[i];
      let optgroup = select.appendChild(document.createElement("optgroup"));
      optgroup.label = groupName;
      for (let j = 0; j < subchoices.length; ++j) {
        let option = optgroup.appendChild(document.createElement("option"));
        option.value = [i, j];
        option.appendChild(document.createTextNode(subchoices[j]));
      }
    }
  } else {
    for (let i = 0; i < choices.length; ++i) {
      let option = select.appendChild(document.createElement("option"));
      option.value = i;
      option.appendChild(document.createTextNode(choices[i]));
    }
  }
  select.value = value;

  return select;
}

function handleCheckBox (eventInfo) {
  let converted = eventInfo.currentTarget.checked;
  gSwitches[eventInfo.currentTarget.parentNode.parentNode.id].value = converted;
  refresh();
}

function buildCheckBox (name, value) {
  var label = document.createElement("label");
  var box = label.appendChild(document.createElement("input"));
  label.appendChild(document.createTextNode(name));
  box.type = "checkbox";
  box.checked = value;
  box.addEventListener("change", handleCheckBox);
  return label;
}

