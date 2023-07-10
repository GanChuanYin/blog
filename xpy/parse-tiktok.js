const data = require('./data.json')

const XLSX = require('xlsx')

function parseData(data) {
  let list = data.material_infos
  let res = []
  list.forEach((item) => {
    let cost = item.metrics.stat_cost
    let id = item.base_info.material_id
    let name = item.base_info.material_name
    res.push({ name, id, cost })
  })
  return res
}

// 创建一个工作簿
const workbook = XLSX.utils.book_new()

let dataList = parseData(data)
// 创建一个工作表
const worksheet = XLSX.utils.json_to_sheet(dataList)
// 将工作表添加到工作簿
XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
// 将工作簿保存为 Excel 文件
XLSX.writeFile(workbook, '111-视频.xlsx', { bookType: 'xlsx' })
