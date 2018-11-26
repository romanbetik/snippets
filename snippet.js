(function() {
  
  function parseJiraTime(time) {
    var splittedTime = time.split(', ');

    var result = 0;

    for (var i = 0; i < splittedTime.length; i++) {
      var currentTimeUnit = splittedTime[i];

      if (currentTimeUnit.indexOf('week') > -1) {
        var count = parseInt(currentTimeUnit, 10);

        result += count * 40 * 60;
      }

      if (currentTimeUnit.indexOf('day') > -1) {
        var count = parseInt(currentTimeUnit, 10);

        result += count * 8 * 60;
      }

      if (currentTimeUnit.indexOf('hour') > -1) {
        var count = parseInt(currentTimeUnit, 10);

        result += count * 60;
      }

      if (currentTimeUnit.indexOf('min') > -1) {
        var count = parseInt(currentTimeUnit, 10);

        result += count;
      }
    }

    return result;
  }

  function sumTimeColumn(columnName) {
    var table = document.getElementById('issuetable');

    var ths = table.querySelectorAll('th');
  
    var index = -1;
  
    Array.prototype.forEach.call(ths, function(th, i) {
      var data = th.getAttribute('data-id');
  
      if (data === columnName) index = i;
    });
  
    var rows = table.querySelectorAll('.issuerow');
      
    var total = 0;
  
    Array.prototype.forEach.call(rows, function(row) {
      var cells = row.querySelectorAll('td');
  
      cells = Array.prototype.slice.call(cells, 0);
  
      if (!cells[index]) {
        console.log('There might be an issue with column ' + columnName);
        return 0;
      }

      var value = cells[index].textContent;

      if (!value) {
        return 0;
      }
  
      total += parseJiraTime(value);
    });

    return total
  }

function addLastRow(message) {
  var table = document.getElementById('issuetable');
  var columns = table.rows[0].cells.length;

  var lastRow = table.insertRow(-1);
  var cell1 = lastRow.insertCell(0);
  cell1.innerHTML = '<span>' + message + '</span>';
  cell1.setAttribute("colspan", columns);
}

  function minutesToMds(minutes) {
    return parseFloat(minutes / 60 / 8).toFixed(2);
  }

  function minutesToVerboseTimeString(minutes) {
    var weeks = parseInt(minutes / (60 * 8 * 5), 10);
    var total = minutes;
    var total = total % (60 * 8 * 5);
    
    var days = parseInt(total / (60 * 8), 10);
    total = total % (60 * 8);
    
    var hours = parseInt(total / 60, 10);
    var minutes = total % 60;

    return weeks + 'w, ' + days + 'd, ' + hours + 'h, ' + minutes + 'm';
  }

  var totalOriginalEstimateInMinutes = sumTimeColumn('aggregatetimeoriginalestimate');
  var totalRemainingEstimate = sumTimeColumn('aggregatetimeestimate');
  var totalTimeSpent = sumTimeColumn('aggregatetimespent');

  var message = 'Total original estimate: ' + minutesToMds(totalOriginalEstimateInMinutes) + 'MD (' + minutesToVerboseTimeString(totalOriginalEstimateInMinutes) + '). ';
  message += 'Total remaining estimate: ' + minutesToMds(totalRemainingEstimate) + 'MD (' + minutesToVerboseTimeString(totalRemainingEstimate) + '). '
  message += 'Total time spent: ' + minutesToMds(totalTimeSpent) + 'MD (' + minutesToVerboseTimeString(totalTimeSpent) + '). '
  
  console.log('Total original estimate: ' + minutesToMds(totalOriginalEstimateInMinutes) + 'MD (' + minutesToVerboseTimeString(totalOriginalEstimateInMinutes) + ')' );
  console.log('Total remaining estimate: ' + minutesToMds(totalRemainingEstimate) + 'MD (' + minutesToVerboseTimeString(totalRemainingEstimate) + ')');
  console.log('Total time spent: ' + minutesToMds(totalTimeSpent) + 'MD (' + minutesToVerboseTimeString(totalTimeSpent) + ')');

  addLastRow(message);
})();
