from pandas import Series,DataFrame
import pandas as pd

df = pd.read_excel('data.xlsx')  # 这里应该是路径+文件名，我的文件放在脚本同级目录里所以没有加路径
df['花费'] = df['花费'].str.replace('USD', '')
df['花费'] = pd.to_numeric(df['花费'])
df = df.drop(df[df['花费'] <= 0].index)
newFile = df.sort_values(by=['花费'], ascending=False)  # 按照最低位次排序
newFile.to_excel('newData.xlsx')  # 保存文件，如果不想保存在同级目录下面，此处的参数应该为路径+文件名

