import requests

# 参数
params = {
    "advertiser_ids": "[7036030828811403266,6950571951626682369,6950572987468742658]"
}

# 代理
proxies = {
    # "http": "http://10.10.1.10:3128",
    "https": "http://127.0.0.1:1087",
}

# 请求头
headers = {"Access-Token": "d1d3e55f5fa9dd881343a61f2bb28b939ee9eebe"}

# params 接收一个字典或者字符串的查询参数，
# 字典类型自动转换为url编码，不需要urlencode()
response = requests.get(
    "https://business-api.tiktok.com/open_api/v1.2/advertiser/info/",
    params=params,
    headers=headers,
    proxies=proxies,
)

# 查看响应内容，response.text 返回的是Unicode格式的数据
# print (response.text)

# 查看响应内容，response.content返回的字节流数据
# print(response.content)

# # 查看完整url地址
# print(response.url)

# # 查看响应头部字符编码
# print(response.encoding)

# # 查看响应码
# print(response.status_code)

res = response.json()["data"]

print(res)

for item in res:
    print(item['company'] )
