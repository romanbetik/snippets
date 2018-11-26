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
  
    var index;
  
    Array.prototype.forEach.call(ths, function(th, i) {
      var data = th.getAttribute('data-id');
  
      if (data === columnName) index = i;
    });
  
    var rows = table.querySelectorAll('.issuerow');
  
    var total = 0;
  
    Array.prototype.forEach.call(rows, function(row) {
      var cells = row.querySelectorAll('td');
  
      cells = Array.prototype.slice.call(cells, 0);
  
      var value = cells[index].textContent;
  
      if (!value) return;
  
      total += parseJiraTime(value);
    });

    return total
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
  console.log('Total original estimate: ' + minutesToMds(totalOriginalEstimateInMinutes) + 'MD (' + minutesToVerboseTimeString(totalOriginalEstimateInMinutes) + ')' );

  var totalRemainingEstimate = sumTimeColumn('aggregatetimeestimate');
  console.log('Total remaining estimate: ' + minutesToMds(totalRemainingEstimate) + 'MD (' + minutesToVerboseTimeString(totalRemainingEstimate) + ')');

  var totalTimeSpent = sumTimeColumn('timespent');
  console.log('Total time spent: ' + minutesToMds(totalTimeSpent) + 'MD (' + minutesToVerboseTimeString(totalTimeSpent) + ')'); 
})();
