import xlsxwriter
import pandas as pd
from datetime import datetime, date

originFile = pd.read_excel('age-data.xlsx')
# print(df[df['性别'] == '男'])


df = pd.DataFrame(originFile[originFile['性别'] == '女'],columns = ['性别','年龄', '花费', '展现', '点击','CTR','CPM'])
df = df.sort_values(by=['年龄'], ascending=True)  # 按照最低位次排序
df2 = pd.DataFrame(originFile[originFile['性别'] == '男'],columns = ['性别','年龄', '花费', '展现', '点击','CTR','CPM'])
df2 = df2.sort_values(by=['年龄'], ascending=True)  # 按照最低位次排序
print(df2)
# df = df.append([0])
df = df.append(df2)
df.to_excel("demo1.xlsx", sheet_name='Sheet1', index=False)
# print(df.loc[:, '年龄'])
# print(df)

# workbook = xlsxwriter.Workbook('demo2.xlsx')
# worksheet = workbook.add_worksheet('sheet1')
# # 创建列名的样式
# header_format = workbook.add_format({
#     'bold': True,
#     'text_wrap': True,
#     'valign': 'top',
#     'fg_color': '#D7E4BC',
#     'border': 1})
# # 从A1单元格开始写出一行数据，指定样式为header_format
# worksheet.write_row(0, 0,  df.columns, header_format)
# # 创建一批样式对象
# format1 = workbook.add_format(
#     {'border': 1, 'num_format': 'mmm d yyyy hh:mm:ss'})
# format2 = workbook.add_format({'border': 1, 'num_format': 'mmmm dd yyyy'})
# format3 = workbook.add_format({'border': 1, 'num_format': '#,##0.00'})
# format4 = workbook.add_format({'border': 1, 'num_format': '0%'})

# # 从第2行（角标从0开始）开始，分别写出每列的数据，并指定特定的样式
# # worksheet.write_column(1, 0, df.loc[:, '年龄'], format1)
# # worksheet.write_column(1, 1, df.iloc[:, 1], format2)
# # worksheet.write_column(1, 2, df.iloc[:, 2], format3)
# # worksheet.write_column(1, 3, df.iloc[:, 3], format4)
# # worksheet.write_column(1, 4, df.iloc[:, 4], format3)

# # 设置对应列的列宽，单位是字符长度
# worksheet.set_column('A:A', 19)
# worksheet.set_column('B:B', 17)
# worksheet.set_column('C:C', 8)
# worksheet.set_column('D:D', 12)
# worksheet.set_column('E:E', 6)

# workbook.close()
