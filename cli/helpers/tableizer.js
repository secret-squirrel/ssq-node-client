var Table = require('cli-table')

function tableizeRecords(records, fields, fieldLabels) {
  fieldLabels = fieldLabels || []

  fieldLabels.unshift('#')

  fields.forEach(function(field, i) {
    fieldLabels[i] = fieldLabels[i] || fields[i]
  })

  var table = new Table({ head: fieldLabels })

  records.forEach(function(record, i) {
    var entry = [i]

    fields.forEach(function (field, i) {
      entry.push(record[field])
    })

    table.push(entry)
  })

  return table.toString()
}

module.exports = {
  tableizeRecords: tableizeRecords
}
